// Vercel Edge Function - 在全球邊緣節點執行（亞洲節點可存取中國金融 API）
export const config = { runtime: 'edge' };

export default async function handler(request) {
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  };

  if (request.method === 'OPTIONS') {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  const { searchParams } = new URL(request.url);
  const url = searchParams.get('url');

  if (!url) {
    return new Response('Missing url parameter', { status: 400, headers: corsHeaders });
  }

  const targetUrl = decodeURIComponent(url);

  const allowed = ['eastmoney.com', 'sinajs.cn', 'sina.com.cn', 'gtimg.cn'];
  if (!allowed.some(d => targetUrl.includes(d))) {
    return new Response('Domain not allowed', { status: 403, headers: corsHeaders });
  }

  let referer = 'https://data.eastmoney.com/';
  if (targetUrl.includes('sinajs.cn') || targetUrl.includes('sina.com.cn')) {
    referer = 'https://finance.sina.com.cn/';
  }

  try {
    const response = await fetch(targetUrl, {
      headers: {
        'Referer': referer,
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/124.0.0.0 Safari/537.36',
        'Accept': '*/*',
        'Accept-Language': 'zh-CN,zh;q=0.9',
      },
    });

    const text = await response.text();

    return new Response(text, {
      status: 200,
      headers: {
        ...corsHeaders,
        'Content-Type': response.headers.get('content-type') || 'text/plain; charset=utf-8',
        'Cache-Control': 'no-store',
      },
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: e.message, url: targetUrl }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
}
