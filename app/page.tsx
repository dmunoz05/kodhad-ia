'use client'

import { useState } from 'react'
import { ChatSidebar } from '@/components/chat-sidebar'
import { ChatHeader } from '@/components/chat-header'
import { ChatMessages } from '@/components/chat-messages'
import { ChatInput } from '@/components/chat-input'

export default function Home() {
  type Message = { role: 'user' | 'assistant'; content: string }
  type Conversation = { id: number; title: string; messages: Message[] }

  const [conversations, setConversations] = useState<Conversation[]>([
    { id: 1, title: 'Nueva conversación', messages: [] },
  ])
  const [currentConversationId, setCurrentConversationId] = useState<number>(1)
  const [nextId, setNextId] = useState(2)
  const [selectedModel, setSelectedModel] = useState('default')
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)

  const getCurrentConversation = () => conversations.find(c => c.id === currentConversationId) ?? conversations[0]

  const setConversationMessages = (id: number, messages: Message[]) => {
    setConversations(prev => prev.map(c => c.id === id ? { ...c, messages } : c))
  }

  const handleSendMessage = async (content: string) => {
    const model = process.env.GOOGLE_MODEL || 'gemini-1.5-flash'

    const conv = getCurrentConversation()
    const newMessages = [...(conv?.messages ?? []), { role: 'user' as const, content }]
    setConversationMessages(conv.id, newMessages)

    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: newMessages,
          model,
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        const err = data?.error || 'Error al generar respuesta'
        setConversationMessages(conv.id, [
          ...newMessages,
          { role: 'assistant', content: `Error: ${err}` },
        ])
        return
      }

      const assistantContent = data.content || 'No se recibió respuesta.'
      setConversationMessages(conv.id, [
        ...newMessages,
        { role: 'assistant', content: assistantContent },
      ])

    } catch (err) {
      console.error(err)
      setConversationMessages(conv.id, [
        ...newMessages,
        { role: 'assistant', content: 'Error de conexión con la API.' },
      ])
    }
  }

  const handleNewConversation = () => {
    const id = nextId
    const newConv: Conversation = { id, title: 'Nueva conversación', messages: [] }
    setConversations(prev => [newConv, ...prev])
    setCurrentConversationId(id)
    setNextId(id + 1)
  }

  const handleSelectConversation = (id: number) => {
    setCurrentConversationId(id)
  }

  const handleClearConversation = () => {
    setConversationMessages(currentConversationId, [])
  }

  const currentMessages = getCurrentConversation()?.messages ?? []

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      <ChatSidebar
        isOpen={isSidebarOpen}
        onToggle={() => setIsSidebarOpen(!isSidebarOpen)}
        conversations={conversations}
        onNewConversation={handleNewConversation}
        onSelectConversation={handleSelectConversation}
      />

      <div className="flex-1 flex flex-col">
        <ChatHeader
          selectedModel={selectedModel}
          onModelChange={setSelectedModel}
          onMenuClick={() => setIsSidebarOpen(!isSidebarOpen)}
          onClearConversation={handleClearConversation}
        />

        <ChatMessages messages={currentMessages} />

        <ChatInput onSendMessage={handleSendMessage} />
      </div>
    </div>
  )
}