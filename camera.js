let stream = null;
const video = document.getElementById('webcamVideo');
const canvas = document.getElementById('detectionCanvas');
const ctx = canvas ? canvas.getContext('2d') : null;

async function startCamera() {
    try {
        stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
        video.srcObject = stream;
        document.getElementById('startCamBtn').disabled = true;
        document.getElementById('stopCamBtn').disabled = false;
        video.onloadedmetadata = () => {
            if (canvas) {
                canvas.width = video.videoWidth;
                canvas.height = video.videoHeight;
            }
        };
    } catch(e) {
        alert('Camera error: ' + e.message);
    }
}
function stopCamera() {
    if (stream) stream.getTracks().forEach(t => t.stop());
    video.srcObject = null;
    document.getElementById('startCamBtn').disabled = false;
    document.getElementById('stopCamBtn').disabled = true;
}
async function switchCamera() {
    stopCamera();
    stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: { exact: 'user' } } });
    video.srcObject = stream;
}
function toggleFullscreen() {
    const panel = document.querySelector('.camera-panel');
    if (!panel) return;
    if (!document.fullscreenElement) panel.requestFullscreen();
    else document.exitFullscreen();
}
function captureFrame() {
    if (!ctx) return;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    ctx.drawImage(video, 0, 0);
    const dataUrl = canvas.toDataURL('image/png');
    if (typeof saveDetectionLocal === 'function') {
        saveDetectionLocal({
            animal: 'manual capture',
            confidence: 1,
            timestamp: new Date().toISOString(),
            image: dataUrl
        });
    }
    alert('Frame captured!');
}