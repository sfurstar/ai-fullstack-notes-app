'use client'

import { useEffect, useState } from 'react'

type Note = {
  id: string
  text: string
}

export default function Home() {
  const [note, setNote] = useState('')
  const [notes, setNotes] = useState<Note[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const loadNotes = async () => {
      try {
        const response = await fetch('/api/notes')
        if (!response.ok) {
          throw new Error('Failed to load notes')
        }

        const data = await response.json()
        setNotes(data.notes ?? [])
      } catch {
        setError('Could not load notes.')
      } finally {
        setLoading(false)
      }
    }

    loadNotes()
  }, [])

  const addNote = async () => {
    const text = note.trim()
    if (!text) return

    setError('')

    try {
      const response = await fetch('/api/notes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text }),
      })

      if (!response.ok) {
        throw new Error('Failed to add note')
      }

      const data = await response.json()
      setNotes((currentNotes) => [data.note, ...currentNotes])
      setNote('')
    } catch {
      setError('Could not add note.')
    }
  }

  return (
    <main style={{ padding: '2rem', fontFamily: 'Arial, sans-serif', maxWidth: '600px' }}>
      <h1>Notes App</h1>

      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
        <input
          type="text"
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="Write a note..."
          style={{ padding: '0.5rem', flex: 1 }}
        />
        <button onClick={addNote} style={{ padding: '0.5rem 1rem' }}>
          Add Note
        </button>
      </div>

      {error ? <p style={{ color: 'crimson' }}>{error}</p> : null}
      {loading ? <p>Loading notes...</p> : null}

      <ul>
        {notes.map((item) => (
          <li key={item.id}>{item.text}</li>
        ))}
      </ul>
    </main>
  )
}