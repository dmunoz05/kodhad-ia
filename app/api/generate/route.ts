type Message = {
  role: string
  content: string
}

interface responseApi {
  model: string,
  created_at: string,
  message: {
    role: string,
    content: string
  },
  done: boolean,
  done_reason: string,
  total_duration: number,
  load_duration: number,
  prompt_eval_count: number,
  prompt_eval_duration: number,
  eval_count: number,
  eval_duration: number
}

export async function POST(req: Request) {
  try {
    const body = await req.json()

    const messages: Message[] = body.messages
    const apiKey: string = process.env.NEXT_PUBLIC_API_KEY!

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
      // model,
      input: body.input,
      // temperature: 0.2,
      // max_tokens: 512,
    }

    const url = apiKey

    const res: responseApi | Response = await fetch(url, {
      method: "POST",
      headers: {
        // "Authorization": `Bearer ${tokenOpenRouter}`,
        "Content-Type": "application/json",
        // "HTTP-Referer": "http://localhost:3000", // obligatorio
        // "X-Title": "Mi App IA Gratis"
      },
      body: JSON.stringify(payload),
    })

    if (!res?.ok) {
      const text = await res.text()
      return new Response(JSON.stringify({ error: text }), { status: 500 })
    }

    const data = await res.json()

    // Adapt response based on OpenRouter/OpenAI format
    // const output = data.choices?.[0]?.message?.content;

    return Response.json({ content: data })
  } catch (err: unknown) {
    const message =
      err instanceof Error ? err.message : typeof err === "string" ? err : JSON.stringify(err)
    return new Response(JSON.stringify({ error: message }), { status: 500 })
  }
}
