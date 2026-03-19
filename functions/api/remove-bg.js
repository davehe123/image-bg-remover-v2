export function onRequest(request) {
  return new Response(JSON.stringify({ 
    method: request.method,
    url: request.url,
    headers: Object.fromEntries(request.headers)
  }), {
    headers: { "Content-Type": "application/json" }
  });
}
