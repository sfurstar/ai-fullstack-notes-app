import { NextResponse } from 'next/server'

type Note = {
  id: string
  text: string
}

const notes: Note[] = []

export async function GET() {
  return NextResponse.json({ notes })
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => null)
  const text = typeof body?.text === 'string' ? body.text.trim() : ''

  if (!text) {
    return NextResponse.json({ error: 'Note text is required' }, { status: 400 })
  }

  const note: Note = {
    id: crypto.randomUUID(),
    text,
  }

  notes.unshift(note)

  return NextResponse.json({ note }, { status: 201 })
}