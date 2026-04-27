// CORS Proxy for Chinese financial APIs
// fund.joption.org/api/proxy?url=ENCODED_URL

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const { url } = req.query;
  if (!url) return res.status(400).send('Missing url parameter');

  const targetUrl = decodeURIComponent(url);

  const allowed = ['eastmoney.com', 'sinajs.cn', 'sina.com.cn', 'gtimg.cn'];
  if (!allowed.some(d => targetUrl.includes(d))) {
    return res.status(403).send('Domain not allowed');
  }

  try {
    const response = await fetch(targetUrl, {
      headers: {
        'Referer': 'https://data.eastmoney.com/',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/124.0.0.0 Safari/537.36',
        'Accept': '*/*',
        'Accept-Language': 'zh-CN,zh;q=0.9',
      },
    });

    const text = await response.text();
    const ct = response.headers.get('content-type') || 'text/plain; charset=utf-8';

    res.setHeader('Content-Type', ct);
    res.setHeader('Cache-Control', 'no-store');
    return res.status(200).send(text);
  } catch (e) {
    return res.status(500).send('Proxy error: ' + e.message);
  }
};
