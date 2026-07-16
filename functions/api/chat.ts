interface Env {
  OPENROUTER_API_KEY: string;
  DB?: D1Database;
}

export const onRequestPost: PagesFunction<Env> = async (context) => {
  const corsHeaders = {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
  };

  try {
    const body = await context.request.json() as any;
    const messages = body.messages || [];

    // Try to save user message to DB (non-blocking — won't crash if DB is unavailable)
    try {
      if (context.env.DB && messages.length > 0) {
        const lastMessage = messages[messages.length - 1];
        if (lastMessage.role === 'user') {
          const id = crypto.randomUUID();
          await context.env.DB.prepare(
            "INSERT INTO messages (id, role, content) VALUES (?, ?, ?)"
          ).bind(id, 'user', lastMessage.content).run();
        }
      }
    } catch (dbErr) {
      console.error("DB write (user) failed, continuing:", dbErr);
    }

    const openRouterUrl = "https://openrouter.ai/api/v1/chat/completions";
    const apiKey = context.env.OPENROUTER_API_KEY;

    if (!apiKey) {
      return new Response(JSON.stringify({ error: "API key not configured. Add OPENROUTER_API_KEY as a secret in Cloudflare Pages settings." }), {
        status: 500,
        headers: corsHeaders
      });
    }

    const response = await fetch(openRouterUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': context.request.url,
        'X-Title': 'Elevate AI Chatbot',
      },
      body: JSON.stringify({
        model: 'meta-llama/llama-3.1-8b-instruct:free',
        messages: messages,
      })
    });

    if (!response.ok) {
      const errorBody = await response.text();
      console.error("OpenRouter error:", response.status, errorBody);
      return new Response(JSON.stringify({ error: `OpenRouter API error: ${response.status}`, details: errorBody }), {
        status: response.status,
        headers: corsHeaders
      });
    }

    const data = await response.json() as any;

    // Try to save AI response to DB (non-blocking)
    try {
      if (context.env.DB && data.choices && data.choices[0]) {
        const aiResponseContent = data.choices[0].message.content;
        const aiMessageId = crypto.randomUUID();
        await context.env.DB.prepare(
          "INSERT INTO messages (id, role, content) VALUES (?, ?, ?)"
        ).bind(aiMessageId, 'assistant', aiResponseContent).run();
      }
    } catch (dbErr) {
      console.error("DB write (ai) failed, continuing:", dbErr);
    }

    return new Response(JSON.stringify(data), {
      status: 200,
      headers: corsHeaders
    });

  } catch (error: any) {
    console.error("Error in chat API:", error);
    return new Response(JSON.stringify({ error: "Internal Server Error", details: error.message }), {
      status: 500,
      headers: corsHeaders
    });
  }
};

// Handle CORS preflight
export const onRequestOptions: PagesFunction = async () => {
  return new Response(null, {
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    },
  });
};
