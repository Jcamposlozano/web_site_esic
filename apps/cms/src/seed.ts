import path from 'path'
import { fileURLToPath } from 'url'
import { getPayload } from 'payload'
import config from '@payload-config'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

// Carpeta de portadas (reutilizamos las del Rethink del sitio web).
const COVERS = path.resolve(dirname, '../../web/public/images/home/rethink')

/** Crea un editorState lexical mínimo a partir de párrafos de texto. */
function lexical(paragraphs: string[]) {
  return {
    root: {
      type: 'root',
      format: '',
      indent: 0,
      version: 1,
      direction: 'ltr',
      children: paragraphs.map((text) => ({
        type: 'paragraph',
        format: '',
        indent: 0,
        version: 1,
        direction: 'ltr',
        textFormat: 0,
        children: [
          { type: 'text', detail: 0, format: 0, mode: 'normal', style: '', text, version: 1 },
        ],
      })),
    },
  }
}

type SeedPost = {
  title: string
  category: 'blog' | 'podcast'
  cover: string
  author: string
  excerpt: string
  publishedAt: string
  externalUrl?: string
  status?: 'draft' | 'published'
  body?: string[]
}

const POSTS: SeedPost[] = [
  {
    title: 'Aprender a decidir: el valor de los casos reales en el aula',
    category: 'blog',
    cover: 'aprender-a-decidir.png',
    author: 'ESIC Medellín',
    excerpt: 'Por qué el método del caso forma criterio: decidir con información incompleta, defender supuestos y aprender del error.',
    publishedAt: '2026-05-19T15:00:00.000Z',
    body: [
      'En ESIC creemos que aprender a decidir es la competencia que más diferencia a un profesional. No basta con conocer la teoría: hay que ejercitarse en tomar decisiones con información incompleta, bajo presión y con consecuencias.',
      'El método del caso pone al estudiante frente a situaciones reales de empresa. Allí no hay una única respuesta correcta; hay decisiones que se justifican, supuestos que se defienden y resultados que se evalúan con evidencia.',
      'Esa práctica repetida construye criterio. Y el criterio, más que cualquier contenido, es lo que sostiene una carrera profesional a largo plazo.',
    ],
  },
  {
    title: 'Formar criterio directivo',
    category: 'blog',
    cover: 'formar-criterio-directivo.png',
    author: 'ESIC Medellín',
    excerpt: 'El criterio directivo no se memoriza: se entrena. Cómo lo desarrollamos en nuestros programas.',
    publishedAt: '2026-04-13T19:00:00.000Z',
    body: [
      'El criterio directivo es la capacidad de leer un contexto, priorizar y decidir con responsabilidad sobre recursos y personas. No se transmite en una clase magistral; se entrena con práctica deliberada.',
      'Por eso integramos retos reales, mentoría y trabajo por proyectos: para que cada participante ejercite el juicio que necesitará al frente de un equipo o de una organización.',
    ],
  },
  {
    title: 'Ser o no ser: el papel de la página web en 2026',
    category: 'blog',
    cover: 'pagina-web-2026.png',
    author: 'ESIC Medellín',
    excerpt: 'En plena era de plataformas e IA, ¿sigue siendo relevante el sitio web propio? Spoiler: más que nunca.',
    publishedAt: '2026-03-15T18:00:00.000Z',
    body: [
      'Con el auge de las plataformas y la inteligencia artificial, muchas marcas se preguntan si su página web sigue siendo necesaria. La respuesta es sí: el sitio propio es el único activo digital que controlas por completo.',
      'Es tu casa en internet: donde defines la narrativa, mides el comportamiento real de tu audiencia y construyes relaciones que no dependen del algoritmo de un tercero.',
    ],
  },
  {
    title: 'Emprender sin fundar una startup: el nuevo perfil del profesional emprendedor',
    category: 'blog',
    cover: 'emprender-sin-startup.png',
    author: 'ESIC Medellín',
    excerpt: 'Emprender ya no es solo crear empresa. Es una forma de trabajar: con iniciativa, criterio y ejecución.',
    publishedAt: '2026-02-16T16:00:00.000Z',
    body: [
      'Durante años, emprender fue sinónimo de fundar una startup. Hoy el concepto es más amplio: emprender es una manera de trabajar, dentro o fuera de una empresa.',
      'El profesional emprendedor detecta oportunidades, asume responsabilidad sobre resultados y ejecuta con criterio. Esa mentalidad es la que más valoran las organizaciones que lideran la economía digital.',
    ],
  },
  {
    title: 'Excelencia académica: cuando la educación deja de ser contenido y se convierte en criterio',
    category: 'blog',
    cover: 'excelencia-academica.png',
    author: 'ESIC Medellín',
    excerpt: 'La excelencia no se mide por cuánto contenido transmites, sino por el criterio que despiertas.',
    publishedAt: '2026-02-10T16:00:00.000Z',
    body: [
      'La educación que se limita a transmitir contenido se vuelve obsoleta el día en que ese contenido cambia. La que forma criterio, en cambio, prepara para un mundo que no para de transformarse.',
      'Nuestra apuesta por la excelencia académica pasa por ahí: menos memorización, más juicio; menos respuestas cerradas, más preguntas bien formuladas.',
    ],
  },
  {
    title: 'Rethink Podcast Ep. 29: El Futuro de Nuestra Consciencia con IA con Sebastián Chinkovsky',
    category: 'podcast',
    cover: 'ep29.jpg',
    author: 'Rethink Podcast',
    excerpt: 'Conversamos con Sebastián Chinkovsky sobre IA, consciencia y el futuro de la mente humana.',
    publishedAt: '2025-09-01T16:00:00.000Z',
    externalUrl: 'https://www.youtube.com/watch?v=zS-ibHyImvI',
  },
  {
    title: 'Rethink Podcast Ep. 28: El Futuro de la Política con IA con Federico Hoyos',
    category: 'podcast',
    cover: 'ep28.jpg',
    author: 'Rethink Podcast',
    excerpt: 'Federico Hoyos analiza el impacto de la inteligencia artificial en la política y la democracia.',
    publishedAt: '2025-08-01T16:00:00.000Z',
    externalUrl: 'https://www.youtube.com/watch?v=XFziCxsoUr0',
  },
  {
    title: '[BORRADOR] Post de prueba que NO debe publicarse',
    category: 'blog',
    cover: 'aprender-a-decidir.png',
    author: 'ESIC Medellín',
    excerpt: 'Este borrador valida que los drafts no entran al build de producción.',
    publishedAt: '2026-06-01T16:00:00.000Z',
    status: 'draft',
    body: ['Si ves este post en /blog del build de producción, algo está mal: los borradores no deben publicarse.'],
  },
]

const seed = async () => {
  const payload = await getPayload({ config })

  // 1) Admin
  const existingUsers = await payload.count({ collection: 'users' })
  if (existingUsers.totalDocs === 0) {
    await payload.create({
      collection: 'users',
      data: {
        email: process.env.SEED_ADMIN_EMAIL || 'admin@esic.co',
        password: process.env.SEED_ADMIN_PASSWORD || 'esic12345',
        name: 'Administrador ESIC',
      },
    })
    payload.logger.info('✓ Admin creado')
  } else {
    payload.logger.info('• Ya existe un usuario admin, no se crea otro')
  }

  // 2) Posts (idempotente por slug)
  let created = 0
  for (const p of POSTS) {
    const slug = p.title
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '')

    const exists = await payload.find({
      collection: 'posts',
      where: { slug: { equals: slug } },
      limit: 1,
    })
    if (exists.totalDocs > 0) {
      payload.logger.info(`• Post ya existe: ${slug}`)
      continue
    }

    // Sube la portada
    const media = await payload.create({
      collection: 'media',
      data: { alt: p.title },
      filePath: path.join(COVERS, p.cover),
    })

    await payload.create({
      collection: 'posts',
      data: {
        title: p.title,
        slug,
        category: p.category,
        status: p.status || 'published',
        publishedAt: p.publishedAt,
        author: p.author,
        excerpt: p.excerpt,
        coverImage: media.id,
        externalUrl: p.externalUrl,
        body: p.body ? lexical(p.body) : undefined,
        seo: {
          metaTitle: p.title,
          metaDescription: p.excerpt,
        },
      },
    })
    created++
    payload.logger.info(`✓ Post creado: ${slug}`)
  }

  payload.logger.info(`Seed completo. ${created} posts nuevos.`)
  process.exit(0)
}

try {
  await seed()
} catch (err) {
  console.error(err)
  process.exit(1)
}
