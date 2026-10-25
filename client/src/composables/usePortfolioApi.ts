import { ref, watch } from 'vue'
import { useLanguage } from './useLanguage'

const API_URL = import.meta.env.VITE_API_URL

export interface Me {
  name: string
  tagline: string
  github: string
  linkedin: string
  email: string
}

export interface Project {
  id: number
  title: string
  description: string
  long_description: string
  motivation: string
  features: string[]
  tech: string[]
  url?: string
}

export function useMe() {
  const me = ref<Me | null>(null)
  const loading = ref(true)
  const error = ref<string | null>(null)
  const { language, t } = useLanguage()
  let requestId = 0

  async function load(locale = language.value) {
    const currentRequest = ++requestId
    loading.value = true
    error.value = null

    try {
      const response = await fetch(`${API_URL}/me?lang=${locale}`)
      if (!response.ok) throw new Error('Profile request failed')
      const data: Me = await response.json()
      if (currentRequest === requestId) me.value = data
    } catch {
      if (currentRequest === requestId) {
        error.value = t('profileError')
      }
    } finally {
      if (currentRequest === requestId) loading.value = false
    }
  }

  watch(language, locale => load(locale), { immediate: true })

  return { me, loading, error, retry: () => load() }
}

export function useProjects() {
  const projects = ref<Project[]>([])
  const loading = ref(true)
  const error = ref<string | null>(null)
  const { language, t } = useLanguage()
  let requestId = 0

  async function load(locale = language.value) {
    const currentRequest = ++requestId
    loading.value = true
    error.value = null

    try {
      const response = await fetch(`${API_URL}/projects?lang=${locale}`)
      if (!response.ok) throw new Error('Projects request failed')
      const data: Project[] = await response.json()
      if (currentRequest === requestId) projects.value = data
    } catch {
      if (currentRequest === requestId) {
        error.value = t('projectsError')
      }
    } finally {
      if (currentRequest === requestId) loading.value = false
    }
  }

  watch(language, locale => load(locale), { immediate: true })

  return { projects, loading, error, retry: () => load() }
}