'use client'

import { ScrollArea } from '@/components/ui/scroll-area'
import { SparklesIcon, UserIcon } from 'lucide-react'

interface Message {
  role: 'user' | 'assistant'
  content: string
}

interface ChatMessagesProps {
  messages: Message[]
  isLoading?: boolean
}

export function ChatMessages({ messages, isLoading }: ChatMessagesProps) {
  if (messages.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="text-center space-y-4 max-w-md animate-in fade-in duration-500">
          <div className="w-16 h-16 rounded-2xl bg-accent/10 flex items-center justify-center mx-auto">
            <SparklesIcon className="h-8 w-8 text-accent" />
          </div>
          <h2 className="text-2xl font-semibold text-foreground">
            Bienvenido a Kodhad AI
          </h2>
          <p className="text-muted-foreground leading-relaxed">
            Tu asistente de inteligencia artificial avanzado. Escribe un mensaje para comenzar una conversación.
          </p>
        </div>
      </div>
    )
  }

  return (
    <ScrollArea className="flex-1 p-4">
      <div className="max-w-3xl mx-auto space-y-6">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex gap-4 animate-in fade-in slide-in-from-bottom-4 duration-500 ${message.role === 'user' ? 'justify-end' : 'justify-start'
              }`}
          >
            {message.role === 'assistant' && (
              <div className="w-8 h-8 rounded-lg bg-accent flex items-center justify-center flex-shrink-0">
                <SparklesIcon className="h-4 w-4 text-accent-foreground" />
              </div>
            )}

            <div
              className={`rounded-2xl px-4 py-3 max-w-[80%] ${message.role === 'user'
                  ? 'bg-accent text-accent-foreground'
                  : 'bg-card border border-border text-card-foreground'
                }`}
            >
              <p className="text-sm leading-relaxed whitespace-pre-wrap">
                {message.content}
              </p>
            </div>

            {message.role === 'user' && (
              <div className="w-8 h-8 rounded-lg bg-secondary flex items-center justify-center flex-shrink-0">
                <UserIcon className="h-4 w-4 text-secondary-foreground" />
              </div>
            )}
          </div>
        ))}

        {isLoading && (
          <div className="flex gap-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="w-8 h-8 rounded-lg bg-accent flex items-center justify-center flex-shrink-0">
              <SparklesIcon className="h-4 w-4 text-accent-foreground" />
            </div>
            <div className="rounded-2xl px-4 py-3 bg-card border border-border text-card-foreground">
              <div className="flex gap-1 items-center">
                <div className="w-2 h-2 rounded-full bg-accent animate-bounce" style={{ animationDelay: '0ms' }} />
                <div className="w-2 h-2 rounded-full bg-accent animate-bounce" style={{ animationDelay: '150ms' }} />
                <div className="w-2 h-2 rounded-full bg-accent animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          </div>
        )}
      </div>
    </ScrollArea>
  )
}