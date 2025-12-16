type Message = {
  role: string
  content: string
}

export async function POST(req: Request) {
  try {
    const body = await req.json()

    const tokenOpenRouter = process.env.NEXT_PUBLIC_OPENROUTER_API_KEY!
    const messages: Message[] = body.messages
    const model: string = body.model
    const apiKey: string = process.env.NEXT_PUBLIC_OPENROUTER_MODEL!

    if (!messages) {
      return new Response(JSON.stringify({ error: "Messages required" }), { status: 400 })
    }

    if (!apiKey) {
      return new Response(JSON.stringify({ error: "Missing OPENROUTER_MODEL" }), { status: 500 })
    }

    const contents = messages.map(m => ({
      role: m.role,
      content: m.content,
    }))

    const payload = {
      model,
      messages: contents,
      temperature: 0.2,
      max_tokens: 512,
    }

    // const url =
    //   `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`

    const url = 'https://openrouter.ai/api/v1/chat/completions'

    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${tokenOpenRouter}`,
        "Content-Type": "application/json",
        "HTTP-Referer": "http://localhost:3000", // obligatorio
        "X-Title": "Mi App IA Gratis"
      },
      body: JSON.stringify(payload),
    })

    if (res?.error) {
      const text = await res?.error.message
      return new Response(JSON.stringify({ error: text }), { status: 500 })
    }

    const data = await res.json()

    // Adapt response based on OpenRouter/OpenAI format
    const output = data.choices?.[0]?.message?.content;

    return Response.json({ content: output })
  } catch (err: unknown) {
    const message =
      err instanceof Error ? err.message : typeof err === "string" ? err : JSON.stringify(err)
    return new Response(JSON.stringify({ error: message }), { status: 500 })
  }
}
