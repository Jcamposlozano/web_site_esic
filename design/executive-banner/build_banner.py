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
PHOTO = os.environ.get("PHOTO") or os.path.expanduser(
    "~/Downloads/esic-executive-hero.png"
)
if not os.path.isabs(PHOTO):
    PHOTO = os.path.join(HERE, PHOTO)
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

# Solo titular + subtitulo. Sin la linea de claims (meses / Madrid / año).
TOP = 250
draw_right("EXECUTIVE", f_head, TOP)
# Singular: es UN programa (Digital Business Transformation), no la oferta
# completa de executive programs.
draw_right("PROGRAM", f_head, TOP + 186)
draw_right("DIGITAL BUSINESS TRANSFORMATION", f_sub, TOP + 186 + 270)

# --------------------------------------------------------------------- logos
# Holgura abajo: la barra de stats de la pagina monta sobre el borde inferior
# del banner, asi que los logos no pueden quedar pegados al filo.
LOGO_Y = 855
LOGO_H = 140


def load_logo(path, height):
    """Recorta al contenido, escala y fuerza el logo a blanco sólido.

    Ninguno de los tres viene en blanco: Prestigio está en verde petróleo
    (0,60,79) y Accenture en negro con la flecha morada (161,0,255). Sin
    forzar el color desaparecen o desentonan sobre el azul marino.
    """
    logo = Image.open(path).convert("RGBA")
    logo = logo.crop(logo.getchannel("A").getbbox())
    w = max(1, int(logo.width * height / logo.height))
    logo = logo.resize((w, height), Image.LANCZOS)
    white = Image.new("RGBA", logo.size, WHITE + (0,))
    white.putalpha(logo.getchannel("A"))
    return white


def draw_logo_row(img, d, items, x_left, y_center, pad, sep_h):
    """Fila de logos separados por una regla vertical, centrados en y_center.

    items: [(nombre_archivo, alto_en_px)] — cada logo lleva su propio alto
    porque las proporciones de los tres wordmarks son muy distintas.
    """
    logos = [load_logo(os.path.join(HERE, n), h) for n, h in items]
    x = x_left
    for i, logo in enumerate(logos):
        if i:
            d.rectangle(
                [x, y_center - sep_h // 2, x + 6, y_center + sep_h // 2], fill=WHITE
            )
            x += 6 + pad
        img.paste(logo, (x, y_center - logo.height // 2), logo)
        x += logo.width + pad
    return x - pad


DESKTOP_LOGOS = [("logo-esic.png", 140), ("logo-prestigio.png", 90), ("logo-accenture.png", 64)]
draw_logo_row(canvas, draw, DESKTOP_LOGOS, 200, LOGO_Y + LOGO_H // 2, 55, 120)

canvas.save(OUT, quality=95)
print(f"OK -> {OUT}  {canvas.size}")

# ============================================================ version mobile
# Mismo lenguaje visual en vertical (2048x2900, el ratio del banner mobile
# actual de Digital Business): titular arriba, foto abajo, logos al pie.
MW, MH = 2048, 2900
m = Image.new("RGB", (MW, MH), NAVY)
md = ImageDraw.Draw(m)

MP_X, MP_Y, MP_W, MP_H = 300, 1300, 1448, 1150


def draw_center(d, text, font, y, cx, fill=WHITE, tracking=0):
    if tracking == 0:
        w = d.textlength(text, font=font)
        d.text((cx - w / 2, y), text, font=font, fill=fill)
        return
    total = sum(d.textlength(c, font=font) + tracking for c in text) - tracking
    x = cx - total / 2
    for c in text:
        d.text((x, y), c, font=font, fill=fill)
        x += d.textlength(c, font=font) + tracking


mf_head = fit("", FONT_BOLD, 300, HEAD_WEIGHT)
mf_sub = fit("", FONT_LIGHT, 108, SUB_WEIGHT)

CX = MW // 2
draw_center(md, "EXECUTIVE", mf_head, 330, CX)
draw_center(md, "PROGRAM", mf_head, 330 + 244, CX)
draw_center(md, "DIGITAL BUSINESS", mf_sub, 924, CX)
draw_center(md, "TRANSFORMATION", mf_sub, 1042, CX)

mphoto = Image.open(PHOTO).convert("RGB")
sw, sh = mphoto.size
ch = int(sw / (MP_W / MP_H))
ct = int((sh - ch) * 0.12)
mphoto = mphoto.crop((0, ct, sw, ct + ch)).resize((MP_W, MP_H), Image.LANCZOS)
m.paste(mphoto, (MP_X, MP_Y))

# En vertical el escalón de desktop no funciona: anclado a un margen fijo, la
# pata quedaba flotando sobre el azul y la barra cruzaba la foto por encima de
# la cara (se leía como dos barras atravesando la imagen, no como un marco).
# En mobile se dibujan dos corchetes en "L" POR FUERA de la foto, abrazando la
# esquina superior izquierda y la inferior derecha.
MBAR = int(MP_H * 0.054)          # grosor
MH_LEN = int(MP_W * 0.42)         # brazo horizontal
MV_LEN = int(MP_H * 0.26)         # brazo vertical

# Superior izquierda
mx0, my0 = MP_X - MBAR, MP_Y - MBAR
md.rectangle([mx0, my0, mx0 + MH_LEN, my0 + MBAR], fill=GOLD)
md.rectangle([mx0, my0, mx0 + MBAR, my0 + MV_LEN], fill=GOLD)

# Inferior derecha (misma L girada 180°)
mx1, my1 = MP_X + MP_W + MBAR, MP_Y + MP_H + MBAR
md.rectangle([mx1 - MH_LEN, my1 - MBAR, mx1, my1], fill=GOLD)
md.rectangle([mx1 - MBAR, my1 - MV_LEN, mx1, my1], fill=GOLD)


MOBILE_LOGOS = [
    ("logo-esic.png", 190),
    ("logo-prestigio.png", 116),
    ("logo-accenture.png", 82),
]
MPAD, MSEP_H = 62, 150

# Ancho total de la fila para poder centrarla en el lienzo.
_widths = [load_logo(os.path.join(HERE, n), h).width for n, h in MOBILE_LOGOS]
row_w = sum(_widths) + (len(_widths) - 1) * (6 + 2 * MPAD)
# 2600 y no 2660: la barra blanca de stats monta sobre el borde inferior del
# banner y los logos quedaban casi pegados a ella en mobile.
draw_logo_row(m, md, MOBILE_LOGOS, CX - row_w // 2, 2600, MPAD, MSEP_H)

OUT_M = os.path.join(HERE, "banner-executive-digital-business-transformation-mobile.png")
m.save(OUT_M, quality=95)
print(f"OK -> {OUT_M}  {m.size}")
