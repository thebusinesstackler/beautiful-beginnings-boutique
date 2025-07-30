
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { productName, category, contentType, existingDescription } = await req.json();

    console.log(`Generating ${contentType} for product: ${productName} in category: ${category}`);

    let systemPrompt = '';
    let userPrompt = '';

    switch (contentType) {
      case 'description':
        systemPrompt = `You are an expert copywriter specializing in handcrafted keepsakes and personalized gifts. Write compelling product descriptions that emphasize emotional value, craftsmanship quality, and the meaningful nature of these keepsakes. Focus on how the product preserves memories and creates lasting connections.`;
        userPrompt = `Write a detailed product description for "${productName}" in the ${category} category. The description should be 2-3 paragraphs, emotionally engaging, and highlight the craftsmanship and personalization aspects. Make it warm and personal while being informative about the product's features and benefits.`;
        break;

      case 'seo_title':
        systemPrompt = `You are an SEO expert specializing in e-commerce product titles. Create compelling, search-optimized titles that are under 60 characters and include relevant keywords while remaining natural and appealing to customers.`;
        userPrompt = `Create an SEO-optimized title for "${productName}" in the ${category} category. Include relevant keywords like "personalized", "custom", "handcrafted", or "keepsake" where appropriate. Keep it under 60 characters and make it compelling for both search engines and customers.`;
        break;

      case 'seo_description':
        systemPrompt = `You are an SEO expert creating meta descriptions that drive clicks and conversions. Write descriptions that are compelling, action-oriented, and include relevant keywords while staying under 160 characters.`;
        userPrompt = `Create an SEO meta description for "${productName}" in the ${category} category. Include a call-to-action and relevant keywords. Keep it under 160 characters and make it compelling enough to increase click-through rates from search results.`;
        break;

      default:
        throw new Error('Invalid content type');
    }

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        temperature: 0.7,
        max_tokens: contentType === 'description' ? 500 : 200,
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.statusText}`);
    }

    const data = await response.json();
    const generatedContent = data.choices[0].message.content.trim();

    console.log(`Generated ${contentType} successfully for ${productName}`);

    return new Response(JSON.stringify({ content: generatedContent }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in generate-product-content function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
