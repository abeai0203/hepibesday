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
    const { birthDate, gender, targetName, turnstileToken, relationship = 'U', hobby = '', occasion = 'birthday' } = body

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
              content: `Anda ialah rakan karib yang sangat kelakar dan 'masuk air' di Malaysia. 
              Gunakan bahasa Melayu pasar/slang Malaysia yang sangat santai dan catchy (contoh: padu teruk, style habis, memang ngam, otak ligat, member kita ni, rileks jap). 
              TEGAS: Dilarang sama sekali guna bahasa Indonesia (contoh: 'banget', 'bisa', 'kamu', 'ingin', 'nggak').
              Hasilkan 3 poin ringkas (max 10-12 patah perkataan setiap poin).
              Sebut nama "${personName}" SEKALI SAHAJA (biasanya di poin pertama). 
              Poin seterusnya, guna kata ganti nama seperti 'dia', 'si dia', atau 'member kita ni'.
              Gaya penulisan mestilah kelakar tapi tepat dengan Zodiak.
              Return HANYA format JSON array string: ["poin 1", "poin 2", "poin 3"]. Dilarang letak teks lain.` 
            },
            { 
              role: 'user', 
              content: `Nama: ${personName}. Zodiak: ${zodiac}. Jantina: ${gender === 'M' ? 'Lelaki' : 'Perempuan'}. Hubungan: ${relationship}. Hobi: ${hobby}. Acara: ${occasion}. Tulis 3 poin personaliti yang kelakar dan sangat 'Malaysian style'.` 
            }
          ]
        });
        
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
    const { zodiac, gender = 'U', targetName = 'kawan', traits = [], relationship = 'U', hobby = '' } = body
    
    if (!zodiac) {
      return c.json({ error: 'Missing zodiac' }, 400)
    }

    const { results: dbProducts } = await c.env.DB.prepare(`
      SELECT id, name, price_range, image_url, shopee_url, tags, relationship_target 
      FROM products 
      WHERE active = TRUE 
      AND (gender_target = ? OR gender_target = 'U')
      AND (relationship_target = ? OR relationship_target = 'U')
      ORDER BY RANDOM()
      LIMIT 20
    `).bind(gender, relationship).all()

    if (!dbProducts || dbProducts.length === 0) {
      return c.json({ products: [] })
    }

    let finalProducts = dbProducts.slice(0, 3).map(p => ({
      ...p,
      reason: `Pilihan yang memang ngam dengan gaya ${targetName}.`
    }))

    if (c.env.AI && (traits.length > 0 || hobby) && dbProducts.length > 0) {
      try {
        const catalog = dbProducts.map(p => ({ id: p.id, name: p.name, tags: p.tags }))
        const promptSystem = 'Anda ialah pakar hadiah Malaysia. Return HANYA JSON array: [{"id": "...", "reason": "..."}]'
        const promptUser = `Pilih 3 hadiah terbaik dari katalog: ${JSON.stringify(catalog)}. 
        Penerima: ${targetName} (${gender === 'M' ? 'Lelaki' : 'Perempuan'}). 
        Hubungan: ${relationship}. Hobi: ${hobby}. Personaliti: ${traits.join(', ')}. 
        Berikan alasan santai dalam BM kenapa hadiah ini paling "ngam" untuk dia.`

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
          const selectedProducts = []
          for (const selection of parsed) {
            const matchedProduct = dbProducts.find(p => p.id == selection.id)
            if (matchedProduct) {
              selectedProducts.push({ ...matchedProduct, reason: selection.reason })
            }
          }
          if (selectedProducts.length > 0) finalProducts = selectedProducts
        }
      } catch (err) {}
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

  const payload = { admin: true, exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 }
  const secret = c.env.JWT_SECRET || 'fallback_secret_for_local_dev'
  const token = await sign(payload, secret, 'HS256')

  return c.json({ token })
})

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
    
    const { results: topZodiacs } = await c.env.DB.prepare(`
      SELECT zodiac_sign, COUNT(*) as count 
      FROM sessions 
      GROUP BY zodiac_sign 
      ORDER BY count DESC 
      LIMIT 3
    `).all()

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
    
    const parsedResults = results.map(r => ({
      ...r,
      zodiac_tags: JSON.parse(r.zodiac_tags as string)
    }))

    return c.json({ products: parsedResults })
  } catch (error) {
    return c.json({ error: 'Database error' }, 500)
  }
})

app.get('/api/admin/search-shopee', adminAuth, async (c) => {
  try {
    const keyword = c.req.query('q')
    if (!keyword) return c.json({ error: 'Keyword diperlukan' }, 400)

    const targetUrl = `https://shopee.com.my/api/v4/search/search_items?by=relevancy&keyword=${encodeURIComponent(keyword)}&limit=12&newest=0&order=desc&page_type=search&scenario=PAGE_GLOBAL_SEARCH&version=2`
    const proxyUrl = `https://corsproxy.io/?${encodeURIComponent(targetUrl)}`
    
    const res = await fetch(proxyUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'application/json',
        'X-Requested-With': 'XMLHttpRequest'
      }
    })

    if (!res.ok) throw new Error(`Shopee API responded with ${res.status}`)

    const data: any = await res.json()
    const items = (data.items || []).map((i: any) => {
      const basic = i.item_basic
      return {
        id: basic.itemid,
        shop_id: basic.shopid,
        name: basic.name,
        price: (basic.price / 100000).toFixed(2),
        image_url: `https://down-my.img.susercontent.com/file/${basic.image}`,
        shopee_url: `https://shopee.com.my/product/${basic.shopid}/${basic.itemid}`,
        rating: basic.item_rating?.rating_star?.toFixed(1)
      }
    })

    return c.json({ results: items })
  } catch (error) {
    return c.json({ error: 'Gagal mencari di Shopee', details: (error as Error).message }, 500)
  }
})

app.post('/api/admin/bulk-products', adminAuth, async (c) => {
  try {
    const products = await c.req.json()
    if (!Array.isArray(products)) return c.json({ error: 'Data mestilah dalam format array' }, 400)

    const statements = products.map(p => {
      const id = 'p' + Math.random().toString(36).substr(2, 9)
      return c.env.DB.prepare(
        'INSERT INTO products (id, name, description, price_range, image_url, shopee_url, gender_target, tags, relationship_target) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)'
      ).bind(
        id, p.name || 'Produk Tanpa Nama', p.description || '', p.price_range || 'RM 0', p.image_url || '', p.shopee_url || '', p.gender_target || 'U', p.tags || '', p.relationship_target || 'U'
      )
    })

    await c.env.DB.batch(statements)
    return c.json({ success: true, count: products.length })
  } catch (error) {
    return c.json({ error: 'Bulk upload gagal', details: (error as Error).message }, 500)
  }
})

app.post('/api/admin/products', adminAuth, async (c) => {
  try {
    const body = await c.req.json()
    const { name, description, price_range, image_url, shopee_url, gender_target, tags, relationship_target } = body
    const id = 'p' + Date.now()

    await c.env.DB.prepare(
      'INSERT INTO products (id, name, description, price_range, image_url, shopee_url, gender_target, tags, relationship_target) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)'
    ).bind(id, name, description, price_range, image_url, shopee_url, gender_target, tags, relationship_target || 'U').run()

    return c.json({ success: true, id })
  } catch (error) {
    return c.json({ error: 'Database error', details: (error as Error).message }, 500)
  }
})

app.put('/api/admin/products/:id', adminAuth, async (c) => {
  try {
    const id = c.req.param('id')
    const body = await c.req.json()
    const { name, description, price_range, image_url, shopee_url, gender_target, tags, relationship_target } = body

    await c.env.DB.prepare(`
      UPDATE products 
      SET name = ?, description = ?, price_range = ?, image_url = ?, shopee_url = ?, gender_target = ?, tags = ?, relationship_target = ?
      WHERE id = ?
    `).bind(name, description, price_range, image_url, shopee_url, gender_target, tags, relationship_target, id).run()

    return c.json({ success: true })
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
    const { url, name: providedName } = await c.req.json()
    if (!url) return c.json({ error: 'URL diperlukan' }, 400)

    let name = providedName || ''
    let description = ''
    let tags = ''
    let imageUrl = 'https://via.placeholder.com/500?text=Sila+Masukkan+Gambar'
    let priceRange = 'RM -'

    // 1. "Ninja Scraper" - Multi-Proxy & Google Translate Bridge
    try {
      // Step A: Try Shopee API v4 first (Fastest if it works)
      const idMatch = url.match(/product\/(\d+)\/(\d+)/)
      if (idMatch) {
        const shopId = idMatch[1]
        const itemId = idMatch[2]
        const shopeeApi = `https://shopee.com.my/api/v4/item/get?itemid=${itemId}&shopid=${shopId}`
        const apiRes = await fetch(`https://corsproxy.io/?${encodeURIComponent(shopeeApi)}`)
        const apiData = await apiRes.json() as any
        if (apiData?.data) {
          const item = apiData.data
          name = item.name || ''
          description = item.description || ''
          imageUrl = item.image ? `https://down-my.img.susercontent.com/file/${item.image}` : imageUrl
          if (item.price_min) priceRange = `RM ${(item.price_min / 100000).toFixed(2)}`
        }
      }

      // Step B: If API fails, try Google Translate Proxy (High Success Rate)
      if (!name) {
        const googleProxy = `https://translate.google.com/translate?sl=auto&tl=en&u=${encodeURIComponent(url)}`
        const gRes = await fetch(googleProxy, {
          headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36' }
        })
        const gHtml = await gRes.text()
        
        // Extract from Google's wrapper
        const titleMatch = gHtml.match(/<title>(.*?)<\/title>/i)
        if (titleMatch && !titleMatch[1].toLowerCase().includes('translate')) {
          name = titleMatch[1].replace('Google Translate', '').replace(/\|\s*Shopee.*/gi, '').trim()
        }
        
        const imgMatch = gHtml.match(/property="og:image"\s+content="(.*?)"/i)
        if (imgMatch) imageUrl = imgMatch[1]
      }
    } catch (e) {
      console.error("Ninja Scrape Error:", e)
    }

    // 2. AI Polish (Cleanup and description)
    const seedName = name || providedName || ''
    if (c.env.AI && seedName && seedName.toLowerCase() !== 'shopee') {
      try {
        const aiResponse = await c.env.AI.run('@cf/meta/llama-3-8b-instruct', {
          messages: [
            { 
              role: 'system', 
              content: 'Anda pakar hadiah Malaysia. Kemaskan Nama Produk, buat Deskripsi menarik dlm BM santai, dan berikan 2-3 tag hobi. Return JSON: {"name": "...", "description": "...", "tags": "tag1, tag2"}' 
            },
            { role: 'user', content: `Nama: ${seedName}. URL: ${url}` }
          ]
        })
        const aiText = (aiResponse as any).response;
        const match = aiText.match(/\{.*?\}/s);
        if (match) {
          const parsed = JSON.parse(match[0]);
          name = parsed.name || seedName;
          description = parsed.description || description || '';
          tags = parsed.tags || '';
        }
      } catch (err) {}
    }

    return c.json({
      name: name || seedName || 'Produk Baru (Sila Edit)',
      image_url: imageUrl,
      description: description || 'Hadiah menarik dari Shopee!',
      tags: tags,
      price_range: priceRange,
      shopee_url: url
    })

    return c.json({
      name: name,
      image_url: imageUrl,
      description: description || 'Hadiah menarik dari Shopee!',
      tags: tags,
      price_range: priceRange,
      shopee_url: url
    })
  } catch (error: any) {
    return c.json({ error: 'Gagal memproses data', details: error.message }, 500)
  }
})

export default app
