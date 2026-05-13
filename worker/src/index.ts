import { Hono } from 'hono'
import { cors } from 'hono/cors'

type Bindings = {
  DB: D1Database
}

const app = new Hono<{ Bindings: Bindings }>()

// Middleware
app.use('/*', cors())

// Helper to determine Zodiac Sign
function getZodiacSign(dateString: string): string {
  const date = new Date(dateString)
  const day = date.getDate()
  const month = date.getMonth() + 1 // 1-12

  if ((month == 1 && day <= 19) || (month == 12 && day >= 22)) return 'Capricorn'
  if ((month == 1 && day >= 20) || (month == 2 && day <= 18)) return 'Aquarius'
  if ((month == 2 && day >= 19) || (month == 3 && day <= 20)) return 'Pisces'
  if ((month == 3 && day >= 21) || (month == 4 && day <= 19)) return 'Aries'
  if ((month == 4 && day >= 20) || (month == 5 && day <= 20)) return 'Taurus'
  if ((month == 5 && day >= 21) || (month == 6 && day <= 20)) return 'Gemini'
  if ((month == 6 && day >= 21) || (month == 7 && day <= 22)) return 'Cancer'
  if ((month == 7 && day >= 23) || (month == 8 && day <= 22)) return 'Leo'
  if ((month == 8 && day >= 23) || (month == 9 && day <= 22)) return 'Virgo'
  if ((month == 9 && day >= 23) || (month == 10 && day <= 22)) return 'Libra'
  if ((month == 10 && day >= 23) || (month == 11 && day <= 21)) return 'Scorpio'
  if ((month == 11 && day >= 22) || (month == 12 && day <= 21)) return 'Sagittarius'
  
  return 'Unknown'
}

// Basic health check
app.get('/', (c) => {
  return c.json({ status: 'ok', message: 'Hepibesday API is running' })
})

app.post('/api/generate-traits', async (c) => {
  try {
    const body = await c.req.json()
    const { birthDate, gender } = body

    if (!birthDate || !gender) {
      return c.json({ error: 'Missing birthDate or gender' }, 400)
    }

    const zodiac = getZodiacSign(birthDate)
    
    // In Phase 1, we use static traits. In V3, this would call Cloudflare Workers AI.
    const traitsMap: Record<string, string[]> = {
      'Aries': ['Energetic and driven', 'Loves a good challenge', 'Appreciates directness and action'],
      'Taurus': ['Values comfort and luxury', 'Extremely loyal', 'Has excellent taste in material things'],
      'Gemini': ['Curious and adaptable', 'Loves to communicate', 'Appreciates gadgets and variety'],
      'Cancer': ['Deeply sentimental', 'Values home and family', 'Loves nurturing and being nurtured'],
      'Leo': ['Charismatic and confident', 'Loves to be the center of attention', 'Appreciates premium quality'],
      'Virgo': ['Detail-oriented and practical', 'Values health and wellness', 'Loves useful, well-designed things'],
      'Libra': ['Appreciates beauty and harmony', 'Extremely social', 'Has a refined aesthetic sense'],
      'Scorpio': ['Intense and passionate', 'Values privacy and depth', 'Loves mysterious or meaningful items'],
      'Sagittarius': ['Adventurous and optimistic', 'Loves travel and learning', 'Appreciates experiences over things'],
      'Capricorn': ['Ambitious and disciplined', 'Values status and tradition', 'Loves high-quality, durable items'],
      'Aquarius': ['Unique and forward-thinking', 'Values individuality', 'Loves quirky, innovative, or techy gifts'],
      'Pisces': ['Dreamy and artistic', 'Deeply empathetic', 'Values spiritual and creative items']
    }

    const traits = traitsMap[zodiac] || ['Unique and special', 'A wonderful friend']

    // Create a session in DB
    const sessionId = crypto.randomUUID()
    await c.env.DB.prepare(
      'INSERT INTO sessions (id, zodiac_sign, gender) VALUES (?, ?, ?)'
    ).bind(sessionId, zodiac, gender).run()

    return c.json({ sessionId, zodiac, traits })
  } catch (error) {
    return c.json({ error: 'Internal Server Error' }, 500)
  }
})

app.get('/api/recommendations', async (c) => {
  const zodiac = c.req.query('zodiac')
  const gender = c.req.query('gender') || 'U' // Default to Unisex
  
  if (!zodiac) {
    return c.json({ error: 'Missing zodiac' }, 400)
  }

  // Get products that match the zodiac and gender
  // Gender matching: 'U' fits everyone. 'M' fits 'M' and 'U'. 'F' fits 'F' and 'U'.
  try {
    const { results } = await c.env.DB.prepare(`
      SELECT p.*, pzt.match_score, pzt.reason 
      FROM products p
      JOIN product_zodiac_tags pzt ON p.id = pzt.product_id
      WHERE pzt.zodiac_sign = ? 
      AND (p.gender_target = ? OR p.gender_target = 'U')
      AND p.active = TRUE
      ORDER BY pzt.match_score DESC
      LIMIT 5
    `).bind(zodiac, gender).all()

    return c.json({ products: results })
  } catch (error) {
    return c.json({ error: 'Database error' }, 500)
  }
})

app.post('/api/track-click', async (c) => {
  try {
    const body = await c.req.json()
    const { sessionId, productId } = body

    if (!sessionId || !productId) {
      return c.json({ error: 'Missing sessionId or productId' }, 400)
    }

    const clickId = crypto.randomUUID()
    await c.env.DB.prepare(
      'INSERT INTO affiliate_clicks (id, session_id, product_id) VALUES (?, ?, ?)'
    ).bind(clickId, sessionId, productId).run()

    return c.json({ success: true })
  } catch (error) {
    return c.json({ error: 'Internal Server Error' }, 500)
  }
})

export default app
