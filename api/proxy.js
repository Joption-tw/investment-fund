// CORS Proxy for Chinese financial APIs (EastMoney, Sina)
// Deployed at fund.joption.org/api/proxy?url=ENCODED_URL

export default async function handler(req, res) {
  // Handle CORS preflight
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();

  const { url } = req.query;
  if (!url) return res.status(400).send('Missing url parameter');

  try {
    const targetUrl = decodeURIComponent(url);

    // 只允許特定網域，防止被濫用
    const allowed = [
      'eastmoney.com',
      'sinajs.cn',
      'sina.com.cn',
      'gtimg.cn',
    ];
    const isAllowed = allowed.some(d => targetUrl.includes(d));
    if (!isAllowed) return res.status(403).send('Domain not allowed');

    const response = await fetch(targetUrl, {
      headers: {
        'Referer': 'https://data.eastmoney.com/',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120.0.0.0 Safari/537.36',
        'Accept': '*/*',
      },
      signal: AbortSignal.timeout(8000),
    });

    const contentType = response.headers.get('content-type') || 'text/plain; charset=utf-8';
    const text = await response.text();

    res.setHeader('Content-Type', contentType);
    res.setHeader('Cache-Control', 'no-store');
    res.status(200).send(text);
  } catch (e) {
    res.status(500).send('Proxy error: ' + e.message);
  }
}
