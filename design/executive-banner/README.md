# Banner Executive Program — Digital Business Transformation

**Estado: EN PAUSA, pendiente de aprobación.** El banner está terminado pero
todavía NO se aplicó a la página. Cuando lo aprueben, ver "Cómo publicarlo".

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

## Cómo publicarlo (cuando se apruebe)

1. Convertir a webp desktop + mobile.
2. Subir a `prisma-fai-admin` bajo `src/esic-website/assets/wp/2026/08/`.
3. Apuntar las tres referencias en `apps/web/src/pages/digital-business-transformation.astro`
   (líneas 26-29) al nuevo asset.
4. `astro build`, subir `dist/` al bucket `esic-web-site`, invalidar CloudFront `/*`.

## Decisiones de diseño

- La foto la genera la IA; el texto y los logos se montan por código para que
  las tildes salgan bien y la tipografía sea la de marca (los modelos de imagen
  deforman texto en español).
- Los corchetes dorados son un escalón en "Γ" (barra horizontal + pata
  vertical), van **encima** de la foto, y el de abajo es el de arriba girado
  180°. Las proporciones están calcadas de la referencia, relativas al panel
  de la foto.
