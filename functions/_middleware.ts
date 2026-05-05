export const onRequest: PagesFunction = async (context) => {
  const url = new URL(context.request.url);
  const pathname = url.pathname;

  // Serve static assets directly
  if (
    pathname.startsWith('/client/assets') ||
    pathname.startsWith('/images') ||
    pathname.match(/\.(js|css|svg|png|jpg|jpeg|gif|webp|woff|woff2|ttf|eot)$/)
  ) {
    return context.next();
  }

  // For everything else, serve the SPA entry point
  // Try to fetch the specific file first
  let response = await context.next();
  
  if (response.status === 404) {
    // If not found, serve the client index.html for SPA routing
    response = await context.env.ASSETS.fetch(
      new Request(new URL('/client/index.html', url.origin))
    );
    return new Response(response.body, {
      status: 200,
      headers: response.headers,
    });
  }
  
  return response;
};
