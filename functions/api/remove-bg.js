export async function onRequestPost(request) {
  const API_KEY = "wUNUDANZR8CramNjJj1Eo1w3";

  const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
  };

  try {
    const formData = await request.formData();
    const imageFile = formData.get("image_file");

    if (!imageFile) {
      return new Response(JSON.stringify({ error: "No image file provided" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      });
    }

    const removeBgFormData = new FormData();
    removeBgFormData.append("image_file", imageFile);
    removeBgFormData.append("size", "auto");

    const response = await fetch("https://api.remove.bg/v1.0/removebg", {
      method: "POST",
      headers: {
        "X-Api-Key": API_KEY,
      },
      body: removeBgFormData
    });

    if (!response.ok) {
      const error = await response.text();
      return new Response(JSON.stringify({ error: "Remove.bg API error", details: error }), {
        status: response.status,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      });
    }

    const blob = await response.blob();
    
    return new Response(blob, {
      headers: {
        ...corsHeaders,
        "Content-Type": "image/png",
        "Content-Disposition": "attachment; filename="removed-bg.png"",
      },
    });

  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" }
    });
  }
}

// Handle CORS preflight
export async function onRequestOptions() {
  return new Response(null, {
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    }
  });
}
