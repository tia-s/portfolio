import { ref } from 'vue'
import type { Project } from './usePortfolioApi'

const API_URL = import.meta.env.VITE_API_URL

export type TerminalLine =
  | { type: 'input'; text: string }
  | { type: 'response'; text: string }
  | { type: 'error'; text: string }
  | { type: 'warning'; text: string }

export function useTerminal(onSearchResults: (projects: Project[] | null) => void) {
  const lines = ref<TerminalLine[]>([
    { type: 'response', text: 'Welcome to my portfolio terminal. Type a search query or ask a question.' },
    { type: 'response', text: 'Try: "python", "spring boot", or ask "what is Tianna\'s tech stack?"' },
    { type: 'warning', text: '⚠ Heads up: I\'m a lightweight chatbot based on limited conversations with Tianna, so I might not always get things exactly right.' },
  ])
  const loading = ref(false)

  function detectIntent(input: string): 'search' | 'chat' {
    const trimmed = input.trim()
    const isQuestion = /^(why|what|how|tell|who|when|is|are|do|did|can|could)/i.test(trimmed)
    const isLong = trimmed.split(' ').length > 3
    const hasQuestionMark = trimmed.endsWith('?')
    const isGreeting = /^(hi|hello|hey|sup|yo|howdy|hiya|what's up|wassup)[\s!?]*$/i.test(trimmed)

    return isGreeting || isQuestion || isLong || hasQuestionMark ? 'chat' : 'search'
  }

  async function submit(input: string) {
    const trimmed = input.trim()
    if (!trimmed) return

    const intent = detectIntent(trimmed)
    const label = intent === 'search' ? '/search' : '/ask'

    lines.value = [{ type: 'input', text: `${label} ${trimmed}` }]
    loading.value = true

    try {
      if (intent === 'search') {
        const res = await fetch(`${API_URL}/search?q=${encodeURIComponent(trimmed)}`)
        const data: Project[] = await res.json()
        onSearchResults(data)
        lines.value.push({
          type: 'response',
          text: data.length
            ? `Found ${data.length} project${data.length > 1 ? 's' : ''} matching "${trimmed}"`
            : `No projects found for "${trimmed}". Try a different keyword.`
        })
      } else {
        onSearchResults(null)
        const res = await fetch(`${API_URL}/chat`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ message: trimmed })
        })
        const data = await res.json()
        lines.value.push({ type: 'response', text: data.response })
      }
    } catch {
      lines.value.push({ type: 'error', text: 'Something went wrong. Is the server running?' })
    } finally {
      loading.value = false
    }
  }

  function clear() {
    lines.value = []
    onSearchResults(null)
  }

  return { lines, loading, submit, clear }
}