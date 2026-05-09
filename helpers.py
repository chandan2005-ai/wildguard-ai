import os, requests, zipfile, io

def download_file(url, dest):
    os.makedirs(os.path.dirname(dest), exist_ok=True)
    if not os.path.exists(dest):
        print(f"Downloading {url} ...")
        r = requests.get(url)
        r.raise_for_status()
        with open(dest, 'wb') as f:
            f.write(r.content)

def download_leaflet():
    base = 'https://unpkg.com/leaflet@1.9.4/dist/'
    files = ['leaflet.css', 'leaflet.js']
    dest_dir = 'static/lib/leaflet'
    os.makedirs(dest_dir, exist_ok=True)
    for f in files:
        download_file(base + f, os.path.join(dest_dir, f))

def download_bootstrap():
    dest = 'static/lib/bootstrap'
    zip_url = 'https://github.com/twbs/bootstrap/releases/download/v5.3.3/bootstrap-5.3.3-dist.zip'
    if not os.path.exists(os.path.join(dest, 'css', 'bootstrap.min.css')):
        print("Downloading Bootstrap...")
        r = requests.get(zip_url)
        r.raise_for_status()
        z = zipfile.ZipFile(io.BytesIO(r.content))
        for member in z.namelist():
            if member.startswith('bootstrap-5.3.3-dist/') and not member.endswith('/'):
                target = member.replace('bootstrap-5.3.3-dist/', '')
                path = os.path.join(dest, target)
                os.makedirs(os.path.dirname(path), exist_ok=True)
                with z.open(member) as f:
                    with open(path, 'wb') as out:
                        out.write(f.read())
        print("Bootstrap downloaded.")

def download_chartjs():
    dest = 'static/lib/chart.js/chart.umd.min.js'
    download_file('https://cdn.jsdelivr.net/npm/chart.js@4.4.0/dist/chart.umd.min.js', dest)

def ensure_static_libs():
    os.makedirs('static/lib', exist_ok=True)
    download_bootstrap()
    download_leaflet()
    download_chartjs()