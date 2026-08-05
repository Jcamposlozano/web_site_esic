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

# Solo titular + subtitulo. Sin la linea de claims (meses / Madrid / año).
TOP = 250
draw_right("EXECUTIVE", f_head, TOP)
draw_right("PROGRAMS", f_head, TOP + 186)
draw_right("DIGITAL BUSINESS TRANSFORMATION", f_sub, TOP + 186 + 270)

# --------------------------------------------------------------------- logos
# Holgura abajo: la barra de stats de la pagina monta sobre el borde inferior
# del banner, asi que los logos no pueden quedar pegados al filo.
LOGO_Y = 855
LOGO_H = 140


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
draw_center(md, "PROGRAMS", mf_head, 330 + 244, CX)
draw_center(md, "DIGITAL BUSINESS", mf_sub, 924, CX)
draw_center(md, "TRANSFORMATION", mf_sub, 1042, CX)

mphoto = Image.open(PHOTO).convert("RGB")
sw, sh = mphoto.size
ch = int(sw / (MP_W / MP_H))
ct = int((sh - ch) * 0.12)
mphoto = mphoto.crop((0, ct, sw, ct + ch)).resize((MP_W, MP_H), Image.LANCZOS)
m.paste(mphoto, (MP_X, MP_Y))

MBAR = int(MP_H * 0.054)
MSTUB_W = int(MP_W * 0.095)
MSTUB_H = int(MP_H * 0.061)
MOVER = int(MP_W * 0.36)
# En vertical el corchete se saldría del lienzo por la izquierda: se ancla a un
# margen fijo y la barra se acorta, en vez de recortarse contra el borde.
mbx = 130
MBR_W = MP_X + MOVER - mbx
mby = MP_Y + int(MP_H * 0.05)
md.rectangle([mbx, mby, mbx + MBR_W, mby + MBAR], fill=GOLD)
md.rectangle([mbx, mby + MBAR, mbx + MSTUB_W, mby + MBAR + MSTUB_H], fill=GOLD)
mby1 = MP_Y + MP_H - int(MP_H * 0.02)
md.rectangle([mbx, mby1 - MBAR, mbx + MBR_W, mby1], fill=GOLD)
md.rectangle(
    [mbx + MBR_W - MSTUB_W, mby1 - MBAR - MSTUB_H, mbx + MBR_W, mby1 - MBAR], fill=GOLD
)


def paste_logo_on(img, path, x, y, height):
    logo = Image.open(path).convert("RGBA")
    logo = logo.crop(logo.getchannel("A").getbbox())
    w = int(logo.width * height / logo.height)
    logo = logo.resize((w, height), Image.LANCZOS)
    white = Image.new("RGBA", logo.size, WHITE + (0,))
    white.putalpha(logo.getchannel("A"))
    img.paste(white, (x, y), white)
    return w


ML_H = 165
esic_path = os.path.join(HERE, "logo-esic.png")
prest_path = os.path.join(HERE, "logo-prestigio.png")
_e = Image.open(esic_path)
_e = _e.crop(_e.convert("RGBA").getchannel("A").getbbox())
ew = int(_e.width * ML_H / _e.height)
_p = Image.open(prest_path)
_p = _p.crop(_p.convert("RGBA").getchannel("A").getbbox())
pw = int(_p.width * (ML_H * 0.6) / _p.height)
total = ew + 90 + 6 + 90 + pw
lx = CX - total // 2
ly = 2570
paste_logo_on(m, esic_path, lx, ly, ML_H)
sx = lx + ew + 90
md.rectangle([sx, ly + 12, sx + 6, ly + ML_H - 12], fill=WHITE)
paste_logo_on(m, prest_path, sx + 96, ly + int(ML_H * 0.2), int(ML_H * 0.6))

OUT_M = os.path.join(HERE, "banner-executive-digital-business-transformation-mobile.png")
m.save(OUT_M, quality=95)
print(f"OK -> {OUT_M}  {m.size}")
