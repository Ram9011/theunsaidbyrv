export const onRequest: PagesFunction = async (context) => {
  const url = new URL(context.request.url);
  const pathname = url.pathname;

  // Serve static assets from client folder
  if (
    pathname.startsWith('/assets/') ||
    pathname.startsWith('/images/') ||
    pathname.match(/\.(js|css|svg|png|jpg|jpeg|gif|webp|woff|woff2|ttf|eot)$/)
  ) {
    // Rewrite to client folder if not already there
    const newUrl = pathname.startsWith('/client/') 
      ? pathname 
      : `/client${pathname}`;
    
    const response = await context.env.ASSETS.fetch(
      new Request(new URL(newUrl, url.origin))
    );
    return response;
  }

  // For everything else, serve the SPA entry point
  let response = await context.next();
  
  if (response.status === 404) {
    // Fetch the client index.html for SPA routing
    const indexResponse = await context.env.ASSETS.fetch(
      new Request(new URL('/client/index.html', url.origin))
    );
    
    if (indexResponse.ok) {
      // Rewrite asset paths in the HTML from /assets to /client/assets
      let html = await indexResponse.text();
      html = html.replace(/src="\/assets\//g, 'src="/client/assets/');
      html = html.replace(/href="\/assets\//g, 'href="/client/assets/');
      
      return new Response(html, {
        status: 200,
        headers: {
          'content-type': 'text/html; charset=utf-8',
          ...Object.fromEntries(indexResponse.headers.entries()),
        },
      });
    }
  }
  
  return response;
};
