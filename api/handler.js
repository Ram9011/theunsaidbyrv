export default async (req, res) => {
  try {
    // Load the server module - use require.resolve to find it at runtime
    const server = await import("../dist/server/server.js").then((m) => m.default);

    // Create a Request object compatible with Fetch API
    const url = new URL(req.url || "/", `http://${req.headers.host}`);
    const request = new Request(url, {
      method: req.method,
      headers: req.headers,
      body: ["GET", "HEAD"].includes(req.method) ? undefined : req,
    });

    // Call the server handler
    const response = await server.fetch(request);

    // Set response status and headers
    res.status(response.status);
    response.headers.forEach((value, key) => {
      res.setHeader(key, value);
    });

    // Send the response body
    const buffer = await response.buffer();
    res.end(buffer);
  } catch (error) {
    console.error("Handler error:", error);
    res.status(500).json({
      error: "Internal Server Error",
      message: error instanceof Error ? error.message : "Unknown error",
    });
  }
};
