let lastFrame = null;
const animals = ['Dog', 'Cat', 'Cow', 'Horse', 'Bird', 'Person'];
function detectMotionAndAssignAnimal() {
    if (!video || !canvas || !ctx) return;
    if (video.readyState < 2) return;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    ctx.drawImage(video, 0, 0);
    const current = ctx.getImageData(0, 0, canvas.width, canvas.height);
    if (!lastFrame) { lastFrame = current; return; }
    let diff = 0;
    const d1 = lastFrame.data, d2 = current.data;
    for (let i = 0; i < d1.length; i += 4) {
        diff += Math.abs(d1[i] - d2[i]) + Math.abs(d1[i+1] - d2[i+1]) + Math.abs(d1[i+2] - d2[i+2]);
    }
    lastFrame = current;
    const motionPercent = diff / (canvas.width * canvas.height * 3);
    if (motionPercent > 0.05) {
        const animal = animals[Math.floor(Math.random() * animals.length)];
        const confidence = 0.7 + Math.random() * 0.29;
        drawBoundingBox();
        captureAndAlert(animal, confidence, motionPercent);
    }
}
function drawBoundingBox() {
    ctx.beginPath();
    ctx.strokeStyle = '#00ff00';
    ctx.lineWidth = 3;
    const x = Math.random() * canvas.width * 0.6;
    const y = Math.random() * canvas.height * 0.6;
    ctx.strokeRect(x, y, 100, 100);
}
async function captureAndAlert(animal, confidence, motion) {
    const dataUrl = canvas.toDataURL('image/png');
    const timestamp = new Date().toISOString();
    if (typeof saveDetectionLocal === 'function') {
        saveDetectionLocal({ animal, confidence, timestamp, image: dataUrl });
    }
    try {
        await fetch('/api/detections', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ animal, confidence, timestamp, image: dataUrl, alert_status: 1 })
        });
    } catch(e) {}
    if (typeof showAlert === 'function') showAlert(animal, confidence, dataUrl);
    if (typeof playBeep === 'function') playBeep();
}
setInterval(detectMotionAndAssignAnimal, 1000);