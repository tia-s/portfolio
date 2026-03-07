import { ref } from 'vue'

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

  fetch(`${API_URL}/me`)
    .then(r => {
      if (!r.ok) {
        throw new Error(`${r.status} ${r.statusText}`)
      }
      return r.json()
    })
    .then(data => { me.value = data })
    .catch(e => { error.value = `Failed to load profile data: ${e.message}` })
    .finally(() => { loading.value = false })
  return { me: me, loading, error }
}

export function useProjects() {
  const projects = ref<Project[]>([])
  const loading = ref(true)
  const error = ref<string | null>(null)

  fetch(`${API_URL}/projects`)
    .then(r => {
      if (!r.ok) {
        throw new Error(`${r.status} ${r.statusText}`)
      }
      return r.json()
    })
    .then(data => { projects.value = data })
    .catch(e => { error.value = `Failed to load projects: ${e.message}` })
    .finally(() => { loading.value = false })

  return { projects, loading, error }
}