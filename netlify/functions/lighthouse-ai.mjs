const GROQ_URL = 'https://api.groq.com/openai/v1/chat/completions';

const schemas = {
  case_brief: '{"title":"short humane title","summary":"2-3 sentence explanation","evidence":["signal"],"recommended_actions":["action"]}',
  intervention_plan: '{"likely_barrier":"text","actions":["specific human action"],"avoid":"one harmful or unsupported action to avoid","follow_up_days":7}',
  lesson_capsule: '{"title":"topic in N minutes","intro":"simple explanation","steps":[{"label":"See it","text":"..."},{"label":"Try it","text":"..."},{"label":"Prove it","text":"..."}]}',
  parent_message: '{"message":"plain, supportive message in the requested language"}',
  systemic_pattern: '{"headline":"short pattern title","summary":"what the pattern may mean and one school-level response"}'
};

const system = `You are Lighthouse Copilot, a responsible school support assistant. Help trained school staff act early when students face attendance, learning, transport, financial, health, family, or safety barriers.
Rules:
- Be humane, concise, specific, and non-blaming.
- Never diagnose a medical or mental-health condition.
- Never recommend automatic punishment, suspension, grading, or irreversible action.
- Treat risk scores as prompts for a conversation, not facts about a child.
- For safety disclosures, recommend the school's trained safeguarding process and an immediate human check-in; do not expose sensitive details.
- Minimize personal information and never invent evidence.
- Make clear that a human reviews every recommendation.
- Return only valid JSON matching the requested schema, with no markdown.`;

export async function handler(event) {
  const headers = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': process.env.ALLOWED_ORIGIN || '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Cache-Control': 'no-store'
  };
  if (event.httpMethod === 'OPTIONS') return { statusCode: 204, headers, body: '' };
  if (event.httpMethod !== 'POST') return { statusCode: 405, headers, body: JSON.stringify({ error: 'POST only' }) };
  if (!process.env.GROQ_API_KEY) return { statusCode: 503, headers, body: JSON.stringify({ error: 'GROQ_API_KEY is not configured on the server.' }) };

  try {
    const body = JSON.parse(event.body || '{}');
    const mode = String(body.mode || '');
    if (!schemas[mode]) return { statusCode: 400, headers, body: JSON.stringify({ error: 'Unknown AI mode.' }) };
    const data = JSON.stringify(body.data || {}).slice(0, 7000);
    const prompt = `Task: ${mode}. Use only the supplied fictional/demo school data. Required JSON shape: ${schemas[mode]}\nData: ${data}`;
    const response = await fetch(GROQ_URL, {
      method: 'POST',
      headers: { Authorization: `Bearer ${process.env.GROQ_API_KEY}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: process.env.GROQ_MODEL || 'llama-3.3-70b-versatile',
        temperature: 0.25,
        max_completion_tokens: 700,
        response_format: { type: 'json_object' },
        messages: [{ role: 'system', content: system }, { role: 'user', content: prompt }]
      })
    });
    const raw = await response.json();
    if (!response.ok) throw new Error(raw?.error?.message || `Groq returned ${response.status}`);
    const content = raw?.choices?.[0]?.message?.content;
    if (!content) throw new Error('No model response received.');
    let result;
    try { result = JSON.parse(content); } catch { throw new Error('The model returned invalid JSON. Please retry.'); }
    return { statusCode: 200, headers, body: JSON.stringify({ result, model: raw.model, requestId: raw.id }) };
  } catch (error) {
    console.error('Lighthouse AI error:', error.message);
    return { statusCode: 500, headers, body: JSON.stringify({ error: error.message || 'AI request failed.' }) };
  }
}
