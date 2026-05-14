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
    const { birthDate, gender, targetName, turnstileToken } = body

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
    const personName = targetName || 'kawan'
    
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
              content: `Anda ialah rakan karib di Malaysia. Gunakan bahasa Melayu pasar/santai Malaysia SAHAJA (contoh: memang sah, jenis yang, gila babeng, style, lepak). JANGAN guna bahasa Indonesia. Hasilkan 3 poin ringkas (max 10 patah perkataan setiap poin) menerangkan personaliti Zodiak. MESTI sebut nama "${personName}" dalam setiap poin. Return HANYA format JSON array string: ["poin 1", "poin 2", "poin 3"]. Dilarang letak teks lain.` 
            },
            { 
              role: 'user', 
              content: `Nama kawan saya: ${personName}. Zodiak: ${zodiac}. Jantina: ${gender === 'M' ? 'Lelaki' : 'Perempuan'}. Tulis 3 poin personaliti yang sangat santai dan kasual. Gantikan perkataan 'dia' atau 'kawan' dengan nama "${personName}". Contoh: "${personName} ni jenis yang..." atau "Memang sah ${personName} suka..."` 
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
  } catch (error: any) {
    return c.json({ error: 'Internal Server Error', details: error.message }, 500)
  }
})

app.post('/api/recommendations', async (c) => {
  try {
    const body = await c.req.json()
    const { zodiac, gender = 'U', targetName = 'kawan', traits = [] } = body
    
    if (!zodiac) {
      return c.json({ error: 'Missing zodiac' }, 400)
    }

    // 1. Get up to 20 random active products matching gender
    const { results: dbProducts } = await c.env.DB.prepare(`
      SELECT id, name, price_range, image_url, shopee_url 
      FROM products 
      WHERE active = TRUE AND (gender_target = ? OR gender_target = 'U')
      ORDER BY RANDOM()
      LIMIT 20
    `).bind(gender).all()

    if (!dbProducts || dbProducts.length === 0) {
      return c.json({ products: [] })
    }

    // Default generic fallback products (if AI fails)
    let finalProducts = dbProducts.slice(0, 3).map(p => ({
      ...p,
      reason: `Pilihan yang memang ngam dengan gaya ${targetName}.`
    }))

    // 2. Ask AI to pick top 3 if AI binding exists and we have enough traits
    if (c.env.AI && traits.length > 0 && dbProducts.length > 0) {
      try {
        const catalog = dbProducts.map(p => ({ id: p.id, name: p.name, price: p.price_range }))
        const promptSystem = 'Anda ialah pembantu peribadi yang memilih hadiah. Return HANYA JSON array string format tepat: [{"id": "id_produk", "reason": "sebab..."}]. DILARANG letak teks lain.'
        const promptUser = `Senarai hadiah: ${JSON.stringify(catalog)}. Nama: ${targetName}. Personaliti: ${traits.join(', ')}. Pilih tepat 3 produk (guna id sebenar dari senarai) yang paling sesuai. Berikan alasan ringkas kenapa ia sesuai untuk ${targetName} dalam bahasa Melayu santai.`

        const aiResponse = await c.env.AI.run('@cf/meta/llama-3-8b-instruct', {
          messages: [
            { role: 'system', content: promptSystem },
            { role: 'user', content: promptUser }
          ]
        });

        const aiText = (aiResponse as any).response;
        const match = aiText.match(/\[.*?\]/s);
        if (match) {
          const parsed = JSON.parse(match[0]);
          if (Array.isArray(parsed) && parsed.length > 0) {
            // Map AI selections back to DB products
            const selectedProducts = []
            for (const selection of parsed) {
              const matchedProduct = dbProducts.find(p => p.id == selection.id)
              if (matchedProduct) {
                selectedProducts.push({
                  ...matchedProduct,
                  reason: selection.reason || `Sesuai sangat dengan personaliti ${targetName}.`
                })
              }
            }
            if (selectedProducts.length > 0) {
              finalProducts = selectedProducts
            }
          }
        }
      } catch (err) {
        console.error("AI Matchmaker Error:", err);
      }
    }

    return c.json({ products: finalProducts })
  } catch (error) {
    return c.json({ error: 'Server error' }, 500)
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
  const token = await sign(payload, secret, 'HS256')

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
    const decoded = await verify(token, secret, 'HS256')
    if (!decoded.admin) throw new Error('Not admin')
    await next()
  } catch (e: any) {
    console.log("JWT Error:", e); return c.json({ error: 'Unauthorized', details: e.message }, 401)
  }
}

app.get('/api/admin/stats', adminAuth, async (c) => {
  try {
    const sessionCount = await c.env.DB.prepare('SELECT COUNT(*) as count FROM sessions').first('count')
    const clickCount = await c.env.DB.prepare('SELECT COUNT(*) as count FROM affiliate_clicks').first('count')
    
    // Top Zodiacs
    const { results: topZodiacs } = await c.env.DB.prepare(`
      SELECT zodiac_sign, COUNT(*) as count 
      FROM sessions 
      GROUP BY zodiac_sign 
      ORDER BY count DESC 
      LIMIT 3
    `).all()

    // Top Products
    const { results: topProducts } = await c.env.DB.prepare(`
      SELECT p.name, COUNT(*) as count 
      FROM affiliate_clicks ac
      JOIN products p ON ac.product_id = p.id
      GROUP BY p.id
      ORDER BY count DESC 
      LIMIT 3
    `).all()

    return c.json({ 
      sessions: sessionCount || 0, 
      clicks: clickCount || 0,
      topZodiacs: topZodiacs || [],
      topProducts: topProducts || []
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
    const { name, description, price_range, image_url, shopee_url, gender_target } = body
    const id = 'p' + Date.now()

    await c.env.DB.prepare(
      'INSERT INTO products (id, name, description, price_range, image_url, shopee_url, gender_target) VALUES (?, ?, ?, ?, ?, ?, ?)'
    ).bind(id, name, description, price_range, image_url, shopee_url, gender_target).run()

    return c.json({ success: true, id })
  } catch (error) {
    return c.json({ error: 'Database error', details: (error as Error).message }, 500)
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

app.post('/api/admin/scrape-product', adminAuth, async (c) => {
  try {
    const { url } = await c.req.json()
    if (!url) return c.json({ error: 'URL diperlukan' }, 400)

    let name = ''
    let imageUrl = ''
    let description = ''
    let finalUrl = url

    try {
      // 1. Try to fetch the page with more realistic headers
      const response = await fetch(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1',
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
          'Accept-Language': 'en-US,en;q=0.9',
          'Cache-Control': 'no-cache'
        },
        redirect: 'follow'
      })

      finalUrl = response.url
      const html = await response.text()
      
      // Extraction
      const titleMatch = html.match(/<title>(.*?)<\/title>/i)
      const ogImageMatch = html.match(/<meta\s+property=["']og:image["']\s+content=["'](.*?)["']/i) || html.match(/<meta\s+content=["'](.*?)["']\s+property=["']og:image["']/i)
      const ogDescMatch = html.match(/<meta\s+property=["']og:description["']\s+content=["'](.*?)["']/i) || html.match(/<meta\s+content=["'](.*?)["']\s+property=["']og:description["']/i)

      name = titleMatch ? titleMatch[1].split('|')[0].trim() : ''
      imageUrl = ogImageMatch ? ogImageMatch[1] : ''
      description = ogDescMatch ? ogDescMatch[1] : ''
      
      // If we got a "Blocked" page (Shopee often returns 403 or custom challenge)
      if (html.toLowerCase().includes('robot') || html.toLowerCase().includes('challenge') || !name) {
        throw new Error('Blocked by Shopee')
      }
    } catch (fetchErr) {
      console.log("Fetch failed or blocked, falling back to URL inference");
    }

    // 2. Fallback: Use AI to infer info from the URL if name is still empty
    if (c.env.AI && (!name || name.length < 5)) {
      try {
        const aiResponse = await c.env.AI.run('@cf/meta/llama-3-8b-instruct', {
          messages: [
            { 
              role: 'system', 
              content: 'Anda ialah pakar e-commerce. Ekstrak nama produk daripada URL Shopee ini. Jika URL ada perkataan pelik, cuba teka produk apa. Berikan Nama (max 5 kata) dan Deskripsi menarik (BM santai). Return HANYA JSON: {"name": "...", "description": "..."}' 
            },
            { role: 'user', content: `URL: ${finalUrl}` }
          ]
        })
        const aiText = (aiResponse as any).response;
        const match = aiText.match(/\{.*?\}/s);
        if (match) {
          const parsed = JSON.parse(match[0]);
          name = parsed.name || name;
          description = parsed.description || description;
        }
      } catch (aiErr) {
        console.error("AI Inference Error:", aiErr);
      }
    }

    return c.json({
      name: name || 'Produk Baru',
      image_url: imageUrl || 'https://via.placeholder.com/500?text=Sila+Masukkan+Gambar',
      description: description || 'Hadiah yang sangat menarik untuk yang tersayang!',
      shopee_url: finalUrl
    })
  } catch (error: any) {
    return c.json({ error: 'Gagal menarik data', details: error.message }, 500)
  }
})

export default app
