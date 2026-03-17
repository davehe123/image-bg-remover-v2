// Cloudflare Worker - Image Background Remover
// 部署: wrangler deploy

export default {
  async fetch(request, env) {
    // CORS headers
    const corsHeaders = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    };

    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders });
    }

    if (request.method !== 'POST') {
      return new Response('Method not allowed', { 
        status: 405, 
        headers: corsHeaders 
      });
    }

    try {
      const formData = await request.formData();
      const imageFile = formData.get('image_file');

      if (!imageFile) {
        return new Response(JSON.stringify({ error: 'No image file provided' }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }

      // Prepare form data for Remove.bg
      const removeBgFormData = new FormData();
      removeBgFormData.append('image_file', imageFile);
      removeBgFormData.append('size', 'auto');

      // Call Remove.bg API
      const response = await fetch('https://api.remove.bg/v1.0/removebg', {
        method: 'POST',
        headers: {
          'X-Api-Key': env.REMOVE_BG_API_KEY,
        },
        body: removeBgFormData
      });

      if (!response.ok) {
        const error = await response.text();
        return new Response(JSON.stringify({ error: 'Remove.bg API error', details: error }), {
          status: response.status,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }

      // Return the processed image
      const blob = await response.blob();
      
      return new Response(blob, {
        headers: {
          ...corsHeaders,
          'Content-Type': 'image/png',
          'Content-Disposition': 'attachment; filename="removed-bg.png"',
        },
      });

    } catch (error) {
      return new Response(JSON.stringify({ error: error.message }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }
  },
};
