import { ref, watch } from 'vue'
import type { Project } from './usePortfolioApi'
import { useLanguage } from './useLanguage'

const API_URL = import.meta.env.VITE_API_URL

export type TerminalLine =
  | { type: 'input'; text: string }
  | { type: 'response'; text: string }
  | { type: 'error'; text: string }
  | { type: 'warning'; text: string }

export function useTerminal(onSearchResults: (projects: Project[] | null) => void) {
  const { language, t } = useLanguage()
  const lines = ref<TerminalLine[]>(welcomeLines())
  const loading = ref(false)
  const lastQuery = ref('')

  function welcomeLines(): TerminalLine[] {
    return [
      { type: 'response', text: t('terminalWelcome') },
      { type: 'response', text: t('terminalExamples') },
      { type: 'warning', text: t('terminalDisclaimer') },
    ]
  }

  watch(language, () => {
    lines.value = welcomeLines()
    onSearchResults(null)
  })

  function detectIntent(input: string): 'search' | 'chat' {
    const trimmed = input.trim()
    const isQuestion = /^(why|what|how|tell|who|when|is|are|do|did|can|could|pourquoi|quoi|comment|raconte|qui|quand|est-ce|est|sont|peux|quel|quelle)/i.test(trimmed)
    const isLong = trimmed.split(' ').length > 3
    const hasQuestionMark = trimmed.endsWith('?')
    const isGreeting = /^(hi|hello|hey|sup|yo|howdy|hiya|what(?:\x27|’)s up|wassup|bonjour|salut|coucou|bonsoir)[\s!?]*$/i.test(trimmed)

    return isGreeting || isQuestion || isLong || hasQuestionMark ? 'chat' : 'search'
  }

  async function submit(input: string) {
    const trimmed = input.trim()
    if (!trimmed) return
    lastQuery.value = trimmed

    const intent = detectIntent(trimmed)
    const label = intent === 'search' ? '/search' : '/ask'

    lines.value = [{ type: 'input', text: `${label} ${trimmed}` }]
    loading.value = true

    try {
      if (intent === 'search') {
        const res = await fetch(`${API_URL}/search?q=${encodeURIComponent(trimmed)}&lang=${language.value}`)
        if (!res.ok) throw new Error(`${res.status} ${res.statusText}`)
        const data: Project[] = await res.json()
        onSearchResults(data)
        lines.value.push({
          type: 'response',
          text: data.length
            ? t('foundProjects', { count: data.length, plural: data.length > 1 ? 's' : '', query: trimmed })
            : t('noProjects', { query: trimmed })
        })
      } else {
        onSearchResults(null)
        const res = await fetch(`${API_URL}/chat`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ message: trimmed, language: language.value })
        })
        if (!res.ok) {
          if (res.status === 503) {
            lines.value.push({ type: 'error', text: t('chatUnavailable') })
            return
          }
          throw new Error('Chat request failed')
        }
        const data = await res.json()
        if (typeof data.response !== 'string' || !data.response.trim()) {
          lines.value.push({ type: 'error', text: t('chatUnavailable') })
          return
        }
        lines.value.push({ type: 'response', text: data.response })
      }
    } catch {
      lines.value.push({ type: 'error', text: t('chatUnavailable') })
    } finally {
      loading.value = false
    }
  }

  function clear() {
    lines.value = []
    onSearchResults(null)
  }

  return { lines, loading, lastQuery, submit, clear }
}