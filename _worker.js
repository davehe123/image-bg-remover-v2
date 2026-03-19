export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    
    // Handle API routes
    if (url.pathname === "/api/remove-bg") {
      if (request.method === "POST") {
        return handleRemoveBg(request);
      }
      if (request.method === "OPTIONS") {
        return handleOptions();
      }
      return new Response("Method not allowed", { status: 405 });
    }
    
    // Return null for static files
    return null;
  }
};

function handleOptions() {
  return new Response(null, {
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type"
    }
  });
}

async function handleRemoveBg(request) {
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type"
  };

  try {
    const formData = await request.formData();
    const imageFile = formData.get("image_file");

    if (!imageFile) {
      return new Response(JSON.stringify({ error: "No image file provided" }), {
        status: 400,
        headers: { "Content-Type": "application/json", ...headers }
      });
    }

    // Call remove.bg API
    const apiFormData = new FormData();
    apiFormData.append("image_file", imageFile);
    apiFormData.append("size", "auto");

    const response = await fetch("https://api.remove.bg/v1.0/removebg", {
      method: "POST",
      headers: { "X-Api-Key": "wUNUDANZR8CramNjJj1Eo1w3" },
      body: apiFormData
    });

    if (!response.ok) {
      const errorText = await response.text();
      return new Response(JSON.stringify({ error: "API error", details: errorText }), {
        status: response.status,
        headers: { "Content-Type": "application/json", ...headers }
      });
    }

    const blob = await response.blob();
    return new Response(blob, {
      headers: { "Content-Type": "image/png", "Content-Disposition": "attachment", ...headers }
    });

  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { "Content-Type": "application/json", ...headers }
    });
  }
}
