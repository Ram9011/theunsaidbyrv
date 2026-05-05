import { server } from '../dist/server/server.js';

export default async (req, res) => {
  try {
    const response = await server.fetch(
      new Request(new URL(req.url || '/', `http://${req.headers.host}`), {
        method: req.method,
        headers: req.headers,
        body: req.method !== 'GET' && req.method !== 'HEAD' ? req : undefined,
      })
    );

    res.status(response.status);
    for (const [key, value] of response.headers.entries()) {
      res.setHeader(key, value);
    }
    
    return res.end(await response.text());
  } catch (error) {
    console.error('Handler error:', error);
    res.status(500).end('Internal Server Error');
  }
};



