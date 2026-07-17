export async function onRequestGet(context) {
  const { request, env, params } = context;
  const slug = params.slug;
  
  if (!slug) {
    return Response.json({ error: 'Slug is required' }, { status: 400 });
  }
  
  try {
    const { results } = await env.DB.prepare(
      'SELECT data FROM mcq_tests WHERE slug = ?'
    ).bind(slug).all();
    
    if (results.length === 0) {
      return Response.json({ error: 'Test not found' }, { status: 404 });
    }
    
    // Parse back the JSON string to return as JSON object
    const mcqData = JSON.parse(results[0].data);
    return Response.json(mcqData);
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}
