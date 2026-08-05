#!/usr/bin/env python3
"""
Compone el banner del Executive Program (Digital Business Transformation).

Base: foto generada con IA (ChatGPT) -> panel derecho.
Encima: fondo azul marino, brackets dorados, titular, subtitulo y logos
ESIC | Prestigio en blanco, tal como la referencia que pasó el cliente.

Salida: 2560x1168 (mismo aspect ratio que el banner actual de Digital Business).
"""
import os
import sys
from PIL import Image, ImageDraw, ImageFont

W, H = 2560, 1168
NAVY = (11, 31, 75)
GOLD = (160, 141, 74)
WHITE = (255, 255, 255)

HERE = os.path.dirname(os.path.abspath(__file__))
PHOTO = os.path.expanduser("~/Downloads/esic-executive-hero.png")
OUT = os.path.join(HERE, "banner-executive-digital-business-transformation-desktop.png")

# Fuentes: se pasan por env para poder cambiar entre la de marca (Sofia Sans
# Extra Condensed) y el fallback disponible en el equipo.
FONT_BOLD = os.environ.get("FONT_BOLD")
FONT_LIGHT = os.environ.get("FONT_LIGHT", FONT_BOLD)

if not FONT_BOLD or not os.path.exists(FONT_BOLD):
    sys.exit(f"Falta la fuente display: {FONT_BOLD}")

canvas = Image.new("RGB", (W, H), NAVY)
draw = ImageDraw.Draw(canvas)

# ---------------------------------------------------------------- panel foto
PANEL_X, PANEL_Y, PANEL_W, PANEL_H = 1560, 96, 800, 976

photo = Image.open(PHOTO).convert("RGB")
src_w, src_h = photo.size
target_ratio = PANEL_W / PANEL_H
crop_h = int(src_w / target_ratio)
crop_top = int((src_h - crop_h) * 0.12)  # sesgo hacia arriba: conserva la cabeza
photo = photo.crop((0, crop_top, src_w, crop_top + crop_h)).resize(
    (PANEL_W, PANEL_H), Image.LANCZOS
)
canvas.paste(photo, (PANEL_X, PANEL_Y))

# ----------------------------------------------------------- corchetes oro
# En el original NO son barras rectas: son un escalon en "Gamma" (barra
# horizontal + pata vertical en un extremo) y van POR ENCIMA de la foto,
# cruzando el borde del panel. El de abajo es el mismo girado 180 grados.
# Proporciones tomadas de la referencia, relativas al panel de la foto.
BAR_H = int(PANEL_H * 0.054)      # grosor de la barra horizontal
STUB_W = int(PANEL_W * 0.095)     # ancho de la pata vertical
STUB_H = int(PANEL_H * 0.061)     # alto de la pata vertical
BR_W = int(PANEL_W * 0.62)        # largo total de la barra
OVER = int(PANEL_W * 0.36)        # cuanto invade la foto por la derecha

# Superior: barra + pata bajando por la IZQUIERDA
bx0 = PANEL_X + OVER - BR_W
by0 = PANEL_Y + int(PANEL_H * 0.05)
draw.rectangle([bx0, by0, bx0 + BR_W, by0 + BAR_H], fill=GOLD)
draw.rectangle([bx0, by0 + BAR_H, bx0 + STUB_W, by0 + BAR_H + STUB_H], fill=GOLD)

# Inferior: mismo escalon girado 180 grados (pata subiendo por la DERECHA)
by1 = PANEL_Y + PANEL_H - int(PANEL_H * 0.02)
draw.rectangle([bx0, by1 - BAR_H, bx0 + BR_W, by1], fill=GOLD)
draw.rectangle(
    [bx0 + BR_W - STUB_W, by1 - BAR_H - STUB_H, bx0 + BR_W, by1 - BAR_H], fill=GOLD
)

# --------------------------------------------------------------------- texto
RIGHT = 1330  # el bloque de texto va alineado a la derecha


def fit(text, font_path, size, variation=None):
    """Carga la fuente. Sofia Sans Extra Condensed es variable (eje wght),
    así que se instancia el peso por nombre ('ExtraBold', 'SemiBold'...)."""
    f = ImageFont.truetype(font_path, size)
    if variation:
        f.set_variation_by_name(variation)
    return f


def draw_right(text, font, y, fill=WHITE, tracking=0):
    if tracking == 0:
        w = draw.textlength(text, font=font)
        draw.text((RIGHT - w, y), text, font=font, fill=fill)
        return
    total = sum(draw.textlength(c, font=font) + tracking for c in text) - tracking
    x = RIGHT - total
    for c in text:
        draw.text((x, y), c, font=font, fill=fill)
        x += draw.textlength(c, font=font) + tracking


HEAD_WEIGHT = os.environ.get("HEAD_WEIGHT")  # p.ej. "ExtraBold" en Sofia Sans
SUB_WEIGHT = os.environ.get("SUB_WEIGHT")

f_head = fit("", FONT_BOLD, 230, HEAD_WEIGHT)
f_sub = fit("", FONT_LIGHT, 86, SUB_WEIGHT)
f_meta = fit("", FONT_LIGHT, 52, SUB_WEIGHT)

TOP = 215
draw_right("EXECUTIVE", f_head, TOP)
draw_right("PROGRAMS", f_head, TOP + 186)
draw_right("DIGITAL BUSINESS TRANSFORMATION", f_sub, TOP + 186 + 270)
draw_right("4 MESES  ·  MADRID  ·  2026", f_meta, TOP + 186 + 270 + 116, tracking=6)

# --------------------------------------------------------------------- logos
LOGO_Y = 900
LOGO_H = 150


def paste_logo(path, x, y, height):
    """Recorta al contenido, fuerza el logo a blanco sólido y lo pega por alpha.

    El logo-prestigio.png de S3 viene en verde petróleo (0,60,79), no en blanco:
    sin forzar el color desaparece sobre el azul marino.
    """
    logo = Image.open(path).convert("RGBA")
    bbox = logo.getchannel("A").getbbox()
    logo = logo.crop(bbox)
    w = int(logo.width * height / logo.height)
    logo = logo.resize((w, height), Image.LANCZOS)
    alpha = logo.getchannel("A")
    white = Image.new("RGBA", logo.size, WHITE + (0,))
    white.putalpha(alpha)
    canvas.paste(white, (x, y), white)
    return w


esic_w = paste_logo(os.path.join(HERE, "logo-esic.png"), 200, LOGO_Y, LOGO_H)
sep_x = 200 + esic_w + 70
draw.rectangle([sep_x, LOGO_Y + 10, sep_x + 4, LOGO_Y + LOGO_H - 10], fill=WHITE)
paste_logo(os.path.join(HERE, "logo-prestigio.png"), sep_x + 74, LOGO_Y + 30, 90)

canvas.save(OUT, quality=95)
print(f"OK -> {OUT}  {canvas.size}")
