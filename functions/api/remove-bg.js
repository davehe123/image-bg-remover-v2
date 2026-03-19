export async function onRequestPost(request) {
  const API_KEY = "wUNUDANZR8CramNjJj1Eo1w3";
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

    const apiFormData = new FormData();
    apiFormData.append("image_file", imageFile);
    apiFormData.append("size", "auto");

    const response = await fetch("https://api.remove.bg/v1.0/removebg", {
      method: "POST",
      headers: { "X-Api-Key": API_KEY },
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

export async function onRequestOptions() {
  return new Response(null, {
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type"
    }
  });
}
