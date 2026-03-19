export async function onRequestPost(request) {
  const API_KEY = "wUNUDANZR8CramNjJj1Eo1w3";
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type"
  };

  try {
    const contentType = request.headers.get("content-type") || "";
    
    if (!contentType.includes("multipart/form-data")) {
      return new Response(JSON.stringify({ error: "Content-Type must be multipart/form-data" }), {
        status: 400,
        headers: { "Content-Type": "application/json", ...headers }
      });
    }

    // Read body as array buffer
    const arrayBuffer = await request.arrayBuffer();
    const uint8Array = new Uint8Array(arrayBuffer);
    
    // Find the boundary
    const boundaryMatch = contentType.match(/boundary=(.+)$/);
    if (!boundaryMatch) {
      return new Response(JSON.stringify({ error: "No boundary found" }), {
        status: 400,
        headers: { "Content-Type": "application/json", ...headers }
      });
    }
    
    const boundary = boundaryMatch[1];
    
    // Simple approach: pass the body directly to remove.bg
    // They should handle multipart parsing
    const apiResponse = await fetch("https://api.remove.bg/v1.0/removebg", {
      method: "POST",
      headers: { 
        "X-Api-Key": API_KEY,
        "Content-Type": contentType
      },
      body: uint8Array
    });

    if (!apiResponse.ok) {
      const errorText = await apiResponse.text();
      return new Response(JSON.stringify({ error: "API error", details: errorText }), {
        status: apiResponse.status,
        headers: { "Content-Type": "application/json", ...headers }
      });
    }

    const blob = await apiResponse.blob();
    return new Response(blob, {
      headers: { "Content-Type": "image/png", "Content-Disposition": "attachment", ...headers }
    });

  } catch (err) {
    return new Response(JSON.stringify({ error: err.message, stack: err.stack }), {
      status: 500,
      headers: { "Content-Type": "application/json", ...headers }
    });
  }
}

export async function onRequestOptions() {
  return new Response(null, {
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type"
    }
  });
}
