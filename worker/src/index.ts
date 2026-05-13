import { Hono } from 'hono'
import { cors } from 'hono/cors'

import { sign, verify } from 'hono/jwt'

type Bindings = {
  DB: D1Database
  ADMIN_PASSPHRASE: string
  JWT_SECRET: string
  TURNSTILE_SECRET_KEY?: string
  AI: any
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
    const { birthDate, gender, turnstileToken } = body

    if (!birthDate || !gender) {
      return c.json({ error: 'Missing birthDate or gender' }, 400)
    }

    // Verify Turnstile if key exists
    if (c.env.TURNSTILE_SECRET_KEY && turnstileToken) {
      const formData = new FormData()
      formData.append('secret', c.env.TURNSTILE_SECRET_KEY)
      formData.append('response', turnstileToken)
      
      const turnstileRes = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
        method: 'POST',
        body: formData,
      })
      const turnstileData = await turnstileRes.json()
      if (!turnstileData.success) {
        return c.json({ error: 'Bot verification failed' }, 403)
      }
    }

    const zodiac = getZodiacSign(birthDate)
    
    // In Phase 1, we use static traits. In V3, this would call Cloudflare Workers AI.
    const traitsMap: Record<string, string[]> = {
      'Aries': ['Penuh tenaga & suka cabaran baru', 'Pantang dicabar, selalu nak menang', 'Suka benda yang direct dan cepat jalan'],
      'Taurus': ['Suka keselesaan dan benda-benda premium', 'Kawan yang sangat setia', 'Citarasa tinggi bab makanan & barang'],
      'Gemini': ['Sangat peramah dan mudah masuk air', 'Otak selalu ligat berfikir', 'Suka gajet dan benda-benda trending'],
      'Cancer': ['Sangat menjaga hati orang lain', 'Sayang sangat kat family & kawan rapat', 'Suka lepak rumah dari keluar'],
      'Leo': ['Karismatik dan penuh keyakinan', 'Suka jadi pusat perhatian', 'Peminat barang berkualiti & eksklusif'],
      'Virgo': ['Sangat detail dan pembersih', 'Utamakan kesihatan & self-care', 'Suka hadiah yang praktikal & berguna'],
      'Libra': ['Pencinta kecantikan & keharmonian', 'Sangat sosial dan pandai ambil hati', 'Ada taste yang sangat aesthetic'],
      'Scorpio': ['Intens, misteri tapi penuh semangat', 'Sangat menjaga privasi', 'Suka benda-benda yang ada deep meaning'],
      'Sagittarius': ['Suka travel dan adventure', 'Sentiasa positif dan happy-go-lucky', 'Lebih hargai pengalaman dari barang'],
      'Capricorn': ['Sangat disiplin dan kuat kerja', 'Pentingkan kejayaan dan status', 'Suka barang yang tahan lama & nampak mahal'],
      'Aquarius': ['Sangat unik dan luar kotak', 'Suka kebebasan dan berdikari', 'Peminat inovasi & benda-benda pelik/rare'],
      'Pisces': ['Sangat kreatif dan berjiwa seni', 'Penyayang dan mudah empati', 'Suka benda yang sentimental & spiritual']
    }

    let traits = traitsMap[zodiac] || ['Unik dan sangat istimewa', 'Kawan yang sangat baik']

    if (c.env.AI) {
      try {
        const aiResponse = await c.env.AI.run('@cf/meta/llama-3-8b-instruct', {
          messages: [
            { 
              role: 'system', 
              content: 'Anda ialah pembaca horoskop dalam bahasa Melayu santai. Hasilkan 3 poin ringkas (max 10 patah perkataan setiap poin) menerangkan personaliti berdasarkan Zodiak. Return HANYA format JSON array string: ["poin 1", "poin 2", "poin 3"]. Jangan tambah sebarang teks lain atau penerangan.' 
            },
            { 
              role: 'user', 
              content: `Zodiak: ${zodiac}. Jantina: ${gender === 'M' ? 'Lelaki' : 'Perempuan'}.` 
            }
          ]
        });
        
        // Extract JSON array from response string safely
        const aiText = (aiResponse as any).response;
        const match = aiText.match(/\[.*?\]/s);
        if (match) {
          const parsed = JSON.parse(match[0]);
          if (Array.isArray(parsed) && parsed.length >= 2) {
            traits = parsed;
          }
        }
      } catch (err) {
        console.error("AI Error:", err);
      }
    }

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

// --- ADMIN ROUTES ---

app.post('/api/admin/login', async (c) => {
  const { passphrase } = await c.req.json()
  
  if (!c.env.ADMIN_PASSPHRASE || passphrase !== c.env.ADMIN_PASSPHRASE) {
    return c.json({ error: 'Unauthorized' }, 401)
  }

  // Issue JWT valid for 24 hours
  const payload = { admin: true, exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 }
  const secret = c.env.JWT_SECRET || 'fallback_secret_for_local_dev'
  const token = await sign(payload, secret)

  return c.json({ token })
})

// Admin Middleware
const adminAuth = async (c: any, next: any) => {
  const authHeader = c.req.header('Authorization')
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return c.json({ error: 'Unauthorized' }, 401)
  }
  const token = authHeader.split(' ')[1]
  const secret = c.env.JWT_SECRET || 'fallback_secret_for_local_dev'
  try {
    const decoded = await verify(token, secret)
    if (!decoded.admin) throw new Error('Not admin')
    await next()
  } catch (e) {
    return c.json({ error: 'Unauthorized' }, 401)
  }
}

app.get('/api/admin/stats', adminAuth, async (c) => {
  try {
    const sessionCount = await c.env.DB.prepare('SELECT COUNT(*) as count FROM sessions').first('count')
    const clickCount = await c.env.DB.prepare('SELECT COUNT(*) as count FROM affiliate_clicks').first('count')
    return c.json({ 
      sessions: sessionCount || 0, 
      clicks: clickCount || 0 
    })
  } catch (error) {
    return c.json({ error: 'Database error' }, 500)
  }
})

app.get('/api/admin/products', adminAuth, async (c) => {
  try {
    const { results } = await c.env.DB.prepare(`
      SELECT p.*, json_group_array(json_object('zodiac', pzt.zodiac_sign, 'score', pzt.match_score, 'reason', pzt.reason)) as zodiac_tags
      FROM products p
      LEFT JOIN product_zodiac_tags pzt ON p.id = pzt.product_id
      GROUP BY p.id
    `).all()
    
    // Parse the JSON array string from SQLite
    const parsedResults = results.map(r => ({
      ...r,
      zodiac_tags: JSON.parse(r.zodiac_tags as string)
    }))

    return c.json({ products: parsedResults })
  } catch (error) {
    return c.json({ error: 'Database error' }, 500)
  }
})

app.post('/api/admin/products', adminAuth, async (c) => {
  try {
    const body = await c.req.json()
    const { name, description, price_range, image_url, shopee_url, gender_target, zodiac_tags } = body
    const id = 'p' + Date.now()

    await c.env.DB.prepare(
      'INSERT INTO products (id, name, description, price_range, image_url, shopee_url, gender_target) VALUES (?, ?, ?, ?, ?, ?, ?)'
    ).bind(id, name, description, price_range, image_url, shopee_url, gender_target).run()

    if (zodiac_tags && Array.isArray(zodiac_tags)) {
      for (const tag of zodiac_tags) {
        await c.env.DB.prepare(
          'INSERT INTO product_zodiac_tags (product_id, zodiac_sign, match_score, reason) VALUES (?, ?, ?, ?)'
        ).bind(id, tag.zodiac, tag.score || 90, tag.reason).run()
      }
    }

    return c.json({ success: true, id })
  } catch (error) {
    return c.json({ error: 'Database error' }, 500)
  }
})

app.delete('/api/admin/products/:id', adminAuth, async (c) => {
  try {
    const id = c.req.param('id')
    await c.env.DB.prepare('DELETE FROM product_zodiac_tags WHERE product_id = ?').bind(id).run()
    await c.env.DB.prepare('DELETE FROM products WHERE id = ?').bind(id).run()
    return c.json({ success: true })
  } catch (error) {
    return c.json({ error: 'Database error' }, 500)
  }
})

export default app
