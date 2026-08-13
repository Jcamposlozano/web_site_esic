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
WHITE = (255, 255, 255)

# ── Corchetes (MANUAL DE MARCA ESIC, cap. 05, pág. 29-34) ──────────────────
# Reglas que aplican aquí:
#  · El corchete SUPERIOR es el "doble": relleno con degradado + la misma forma
#    en línea hueca desplazada. Va arriba a la IZQUIERDA.
#  · El corchete INFERIOR es SOLO la línea hueca, girada 180°, abajo a la
#    DERECHA. Invertir esa posición es uso incorrecto (pág. 34).
#  · Sobre fondo azul la línea va en blanco.
#  · Degradado según target. Para "Executive Programs": dorado si se comunica
#    bajo Corporate Education (target empresas), cyan si es bajo Business
#    School. Se elige con CORCHETE=dorado|cyan.
#  · Prohibido deformar, rotar o tapar el texto o al sujeto (pág. 34).
# Degradados muestreados del propio manual (pág. 30).
GRADIENTS = {
    "dorado": ((133, 117, 80), (180, 149, 53)),
    "cyan": ((0, 71, 233), (0, 200, 255)),
}
CORCHETE = os.environ.get("CORCHETE", "dorado")
if CORCHETE not in GRADIENTS:
    sys.exit(f"CORCHETE debe ser uno de {list(GRADIENTS)}")
GRAD_FROM, GRAD_TO = GRADIENTS[CORCHETE]

HERE = os.path.dirname(os.path.abspath(__file__))
PHOTO = os.environ.get("PHOTO") or os.path.expanduser(
    "~/Downloads/DSC05139.jpg"
)
if not os.path.isabs(PHOTO):
    PHOTO = os.path.join(HERE, PHOTO)
OUT = os.path.join(HERE, "banner-executive-human-ai-first-leadership-desktop.png")

# Fuentes: se pasan por env para poder cambiar entre la de marca (Sofia Sans
# Extra Condensed) y el fallback disponible en el equipo.
FONT_BOLD = os.environ.get("FONT_BOLD")
FONT_LIGHT = os.environ.get("FONT_LIGHT", FONT_BOLD)

if not FONT_BOLD or not os.path.exists(FONT_BOLD):
    sys.exit(f"Falta la fuente display: {FONT_BOLD}")

canvas = Image.new("RGB", (W, H), NAVY)
draw = ImageDraw.Draw(canvas)


def _linear_gradient(size, c0, c1):
    """Degradado horizontal c0 → c1."""
    w, h = size
    row = Image.new("RGB", (w, 1))
    for x in range(w):
        t = x / max(1, w - 1)
        row.putpixel((x, 0), tuple(int(c0[i] + (c1[i] - c0[i]) * t) for i in range(3)))
    return row.resize((w, h), Image.BILINEAR)


def corchete(img, x, y, bar_len, thick, *, filled, flip=False, line=WHITE):
    """Dibuja un corchete del manual en (x, y).

    Forma: barra horizontal + pata que baja en el extremo izquierdo. Con
    `filled` se pinta el "doble" (degradado + línea hueca desplazada); sin él,
    solo la línea hueca. `flip` lo gira 180° para el corchete inferior.
    """
    L, T = bar_len, thick
    off = max(2, T // 3)                     # desplazamiento línea ↔ relleno
    stroke = max(2, round(T * 0.085))        # grosor de la línea hueca
    poly = [(0, 0), (L, 0), (L, T), (T, T), (T, 2 * T), (0, 2 * T)]

    layer = Image.new("RGBA", (L + off, 2 * T + off), (0, 0, 0, 0))
    if filled:
        shape = Image.new("L", (L, 2 * T), 0)
        ImageDraw.Draw(shape).polygon(poly, fill=255)
        grad = _linear_gradient((L, 2 * T), GRAD_FROM, GRAD_TO).convert("RGBA")
        grad.putalpha(shape)
        layer.paste(grad, (off, off), grad)

    ImageDraw.Draw(layer).line(
        [*poly, poly[0]], fill=line, width=stroke, joint="curve"
    )

    if flip:
        layer = layer.rotate(180)
    img.paste(layer, (x, y), layer)

# ---------------------------------------------------------------- foto + overlay
# La foto ya no es un retrato en un panel lateral: es la foto real de la cohorte
# (grupo ancho en las escaleras del campus). Va a sangre, con overlay azul ESIC
# para que el texto tenga contraste, como manda la regla de imágenes del sitio.


def cover(img, size, focus_y=0.5):
    """Recorta y escala tipo `object-fit: cover`."""
    tw, th = size
    sw, sh = img.size
    scale = max(tw / sw, th / sh)
    nw, nh = int(sw * scale + 0.5), int(sh * scale + 0.5)
    img = img.resize((nw, nh), Image.LANCZOS)
    left = (nw - tw) // 2
    top = int((nh - th) * focus_y)
    return img.crop((left, top, left + tw, top + th))


def overlay_navy(img, base=0.40, peak=0.94, flat=0.30, split=0.70):
    """Overlay azul ESIC sobre la foto.

    No es un degradado suave de punta a punta: es un scrim. Se mantiene casi
    opaco hasta `flat` (la zona del titular y los logos, donde si no el texto
    blanco cae encima de las caras) y de ahí baja hasta `base`, que es el
    overlay mínimo que lleva toda imagen del sitio.
    """
    w, h = img.size
    grad = Image.new("L", (w, 1))
    for x in range(w):
        t = x / max(1, w - 1)
        if t <= flat:
            a = peak
        elif t >= split:
            a = base
        else:
            k = (t - flat) / (split - flat)
            a = peak + (base - peak) * (k * k * (3 - 2 * k))   # smoothstep
        grad.putpixel((x, 0), int(255 * a))
    ov = Image.new("RGBA", (w, h), NAVY + (0,))
    ov.putalpha(grad.resize((w, h), Image.BILINEAR))
    return Image.alpha_composite(img.convert("RGBA"), ov)


photo = Image.open(PHOTO).convert("RGB")
canvas = overlay_navy(cover(photo, (W, H), focus_y=0.42)).convert("RGB")
draw = ImageDraw.Draw(canvas)

# ------------------------------------------------------------- corchetes
# Ahora la "ventana" del manual es el banner completo: corchete doble arriba a
# la izquierda (por encima del titular) y línea hueca abajo a la derecha.
BAR_T = int(H * 0.048)
BAR_L = int(W * 0.20)

corchete(canvas, 90, 78, BAR_L, BAR_T, filled=True)
corchete(
    canvas,
    W - BAR_L - 90,
    H - 2 * BAR_T - 78,
    BAR_L,
    BAR_T,
    filled=False,
    flip=True,
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
draw_right("HUMAN AI-FIRST LEADERSHIP", f_sub, TOP + 186 + 270)

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

# La foto de grupo es muy ancha: en vertical va como banda a todo el ancho
# (menos un margen), no como panel estrecho, o se perdería medio grupo.
MP_X, MP_Y, MP_W, MP_H = 90, 1230, MW - 180, 1150


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
draw_center(md, "HUMAN AI-FIRST", mf_sub, 924, CX)
draw_center(md, "LEADERSHIP", mf_sub, 1042, CX)

# Overlay más suave que en desktop: aquí la foto no lleva texto encima.
mphoto = overlay_navy(
    cover(Image.open(PHOTO).convert("RGB"), (MP_W, MP_H), focus_y=0.45),
    base=0.26,
    peak=0.26,
).convert("RGB")
m.paste(mphoto, (MP_X, MP_Y))

# Los corchetes ENMARCAN la foto: montan sobre las esquinas (superior izquierda
# y inferior derecha) y sobresalen hacia el azul, de modo que la imagen queda
# dentro de la ventana. Antes iban por dentro y se leían pegados encima de la
# foto, no como marco.
MBAR_T = int(MP_H * 0.062)
MBAR_L = int(MP_W * 0.40)
MBR_OUT = int(MBAR_T * 0.8)     # cuánto sobresale del borde de la foto

corchete(
    m,
    MP_X - MBR_OUT,
    MP_Y - MBR_OUT,
    MBAR_L,
    MBAR_T,
    filled=True,
)
corchete(
    m,
    MP_X + MP_W - MBAR_L + MBR_OUT,
    MP_Y + MP_H - 2 * MBAR_T + MBR_OUT,
    MBAR_L,
    MBAR_T,
    filled=False,
    flip=True,
)


MOBILE_LOGOS = [
    ("logo-esic.png", 190),
    ("logo-prestigio.png", 116),
    ("logo-accenture.png", 82),
]
MPAD, MSEP_H = 62, 150

# Ancho total de la fila para poder centrarla en el lienzo.
_widths = [load_logo(os.path.join(HERE, n), h).width for n, h in MOBILE_LOGOS]
row_w = sum(_widths) + (len(_widths) - 1) * (6 + 2 * MPAD)
# 2490 y no 2660: la barra blanca de stats monta sobre el borde inferior del
# banner y los logos quedaban casi pegados a ella en mobile.
draw_logo_row(m, md, MOBILE_LOGOS, CX - row_w // 2, 2560, MPAD, MSEP_H)

OUT_M = os.path.join(HERE, "banner-executive-human-ai-first-leadership-mobile.png")
m.save(OUT_M, quality=95)
print(f"OK -> {OUT_M}  {m.size}")
