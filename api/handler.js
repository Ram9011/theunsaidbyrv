import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));

// Dynamically import the server at runtime
let serverModule;

async function getServer() {
  if (!serverModule) {
    const serverPath = join(__dirname, '../dist/server/server.js');
    serverModule = await import(serverPath);
  }
  return serverModule.default;
}

export default async function handler(request) {
  try {
    const server = await getServer();
    return await server.fetch(request);
  } catch (error) {
    console.error('Handler error:', error);
    return new Response('Internal Server Error', { 
      status: 500,
      statusText: 'Internal Server Error'
    });
  }
}


