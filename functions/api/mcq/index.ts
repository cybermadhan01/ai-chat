export async function onRequestPost(context: any) {
  const { request, env } = context;
  try {
    const data = await request.json();
    
    // Validate format (expecting an array of questions)
    if (!Array.isArray(data)) {
      return Response.json({ error: 'Invalid JSON format. Expected an array of questions.' }, { status: 400 });
    }
    
    // Generate a random 6-character slug (base36)
    const slug = Math.random().toString(36).substring(2, 8);
    const id = crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).substring(2, 15);
    
    await env.DB.prepare(
      'INSERT INTO mcq_tests (id, slug, data) VALUES (?, ?, ?)'
    ).bind(id, slug, JSON.stringify(data)).run();
    
    return Response.json({ slug, id, success: true });
  } catch (error: any) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}
