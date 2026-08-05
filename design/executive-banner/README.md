# Banner Executive Program — Digital Business Transformation

**Estado: aplicado.** La página ya apunta al banner nuevo en el bucket de
assets. **Falta subir los dos `.webp` de `subir-a-s3/`** — hasta que estén
arriba, el hero de `/digital-business-transformation/` sale roto (403).

## Por qué existe

La página del Executive Program mostraba el banner del **Pregrado en Digital
Business** (`wp/2026/03/banner-digital-business-desktop.webp`), que dice
"Pregado en DIGITAL BUSINESS". Estuvo mal desde que se creó el archivo —
nunca hubo un banner propio de Executive en S3.

## Qué hay aquí

| Archivo | Qué es |
|---|---|
| `build_banner.py` | Compone el banner completo. Salida 2560×1168 (mismo aspect ratio que el banner de Digital Business). |
| `foto-ia-ejecutivo.png` | Foto base 1024×1536 generada con ChatGPT (sin texto ni logos). |
| `logo-esic.png` / `logo-prestigio.png` | Bajados de S3. **Ojo:** el de Prestigio NO es blanco, viene en verde petróleo (0,60,79); el script lo fuerza a blanco por alpha. |
| `fonts/SofiaSansExtraCondensed.ttf` | Variable font (eje wght) de Google Fonts. Display oficial de ESIC. |
| `banner-executive-...-desktop.png` | El resultado. |

## Cómo regenerarlo

```bash
cd design/executive-banner
FONT_BOLD="fonts/SofiaSansExtraCondensed.ttf" \
FONT_LIGHT="fonts/SofiaSansExtraCondensed.ttf" \
HEAD_WEIGHT="ExtraBold" SUB_WEIGHT="SemiBold" \
python3 build_banner.py
```

El script espera la foto en `~/Downloads/esic-executive-hero.png`; si no está,
apuntar `PHOTO` a `foto-ia-ejecutivo.png`.

## Publicación

Los `.webp` listos están en `subir-a-s3/`. Van al bucket de assets:

- Bucket: `prisma-fai-admin` (us-east-2, cuenta dev 092443462435)
- Keys:
  - `src/esic-website/assets/wp/2026/08/banner-executive-digital-business-transformation-desktop.webp`
  - `src/esic-website/assets/wp/2026/08/banner-executive-digital-business-transformation-mobile.webp`

Con el AWS CLI:

```bash
aws s3 cp subir-a-s3/ s3://prisma-fai-admin/src/esic-website/assets/wp/2026/08/ \
  --recursive --exclude "*" --include "banner-executive-*.webp" \
  --content-type image/webp
```

Después: subir el contenido de `apps/web/dist/` a la raíz de `esic-web-site` e
invalidar CloudFront `/*`.

## Decisiones de diseño

- La foto la genera la IA; el texto y los logos se montan por código para que
  las tildes salgan bien y la tipografía sea la de marca (los modelos de imagen
  deforman texto en español).
- Los corchetes dorados son un escalón en "Γ" (barra horizontal + pata
  vertical), van **encima** de la foto, y el de abajo es el de arriba girado
  180°. Las proporciones están calcadas de la referencia, relativas al panel
  de la foto.
