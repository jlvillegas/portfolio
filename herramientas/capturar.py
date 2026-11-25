"""Saca la captura de un sitio para la galería del portfolio.

Uso:
    python herramientas/capturar.py nombre-corto https://el-sitio.netlify.app/

Guarda img/nombre-corto.jpg de 1280x614, el mismo tamaño que las demás capturas.
La primera vez: pip install playwright pillow  y  python -m playwright install chromium
Opcional: --chrome "RUTA" usa un Chrome ya instalado en lugar del de Playwright.
"""
import argparse
import os
import time
from io import BytesIO

from PIL import Image
from playwright.sync_api import sync_playwright

ANCHO, ALTO = 1280, 614
CARPETA_IMG = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "img")


def main():
    parser = argparse.ArgumentParser(description="Captura de un sitio para el portfolio")
    parser.add_argument("nombre", help="nombre del archivo, sin .jpg (por ejemplo unalome)")
    parser.add_argument("url", help="dirección del sitio")
    parser.add_argument("--chrome", help="ruta de un Chrome instalado (opcional)")
    parser.add_argument("--espera", type=float, default=3.5, help="segundos a esperar después de cargar (animaciones)")
    args = parser.parse_args()

    proxy = os.environ.get("HTTPS_PROXY")
    with sync_playwright() as p:
        navegador = p.chromium.launch(executable_path=args.chrome or None,
                                      proxy={"server": proxy} if proxy else None)
        pagina = navegador.new_page(viewport={"width": ANCHO, "height": ALTO}, locale="es-AR")
        pagina.goto(args.url, wait_until="networkidle", timeout=60000)
        time.sleep(args.espera)
        png = pagina.screenshot(clip={"x": 0, "y": 0, "width": ANCHO, "height": ALTO})
        navegador.close()

    destino = os.path.normpath(os.path.join(CARPETA_IMG, args.nombre + ".jpg"))
    Image.open(BytesIO(png)).convert("RGB").save(destino, "JPEG", quality=72, optimize=True, progressive=True)
    print("Listo:", destino, f"({os.path.getsize(destino) // 1024} KB)")


if __name__ == "__main__":
    main()
