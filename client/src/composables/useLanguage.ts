import { computed, ref } from 'vue'
import router from '../router'

export type Language = 'en' | 'fr'

const language = ref<Language>(window.location.pathname === '/fr' ? 'fr' : 'en')
const isSwitching = ref(false)

const translations = {
  en: {
    switchThemeLight: 'Switch to light mode',
    switchThemeDark: 'Switch to dark mode',
    recentProjects: 'Recent Projects',
    loading: 'Loading...',
    profileError: 'Failed to load profile data',
    projectsError: 'Failed to load projects',
    close: 'Close',
    motivation: 'Motivation',
    techStack: 'Tech Stack',
    keyFeatures: 'Key Features',
    viewGitHub: 'View on GitHub',
    builtWith: 'Built with Vue.js + TypeScript and FastAPI',
    deployedWith: 'Deployed with Netlify and Railway',
    closeTerminal: 'Close terminal',
    openTerminal: 'Open terminal',
    askingTianna: 'hang on, asking Tianna...',
    terminalPlaceholder: 'type a search query or question...',
    terminalWelcome: 'Welcome to my portfolio terminal. Type a search query or ask a question.',
    terminalExamples: 'Try: "python", "spring boot", or ask "what is Tianna\'s tech stack?"',
    terminalDisclaimer: '⚠ Heads up: I\'m a lightweight chatbot based on limited conversations with Tianna, so I might not always get things exactly right.',
    noProjects: 'No projects found for "{query}". Try a different keyword.',
    foundProjects: 'Found {count} project{plural} matching "{query}"',
    serverError: 'Something went wrong. Is the server running?',
    githubProfile: 'GitHub profile',
    linkedinProfile: 'LinkedIn profile',
    emailTianna: 'Email Tianna',
    openProjectGitHub: 'Open project on GitHub',
  },
  fr: {
    switchThemeLight: 'Passer en mode clair',
    switchThemeDark: 'Passer en mode sombre',
    recentProjects: 'Projets récents',
    loading: 'Chargement...',
    profileError: 'Échec du chargement du profil',
    projectsError: 'Échec du chargement des projets',
    close: 'Fermer',
    motivation: 'Motivation',
    techStack: 'Technologies',
    keyFeatures: 'Fonctionnalités clés',
    viewGitHub: 'Voir sur GitHub',
    builtWith: 'Réalisé avec Vue.js, TypeScript et FastAPI',
    deployedWith: 'Déployé avec Netlify et Railway',
    closeTerminal: 'Fermer le terminal',
    openTerminal: 'Ouvrir le terminal',
    askingTianna: 'un instant, je demande à Tianna...',
    terminalPlaceholder: 'saisissez une recherche ou une question...',
    terminalWelcome: 'Bienvenue dans le terminal de mon portfolio. Saisissez une recherche ou posez une question.',
    terminalExamples: 'Essayez : « python », « spring boot » ou « quelles technologies utilise Tianna ? »',
    terminalDisclaimer: '⚠ À savoir : ce chatbot léger se base sur un nombre limité de conversations avec Tianna. Ses réponses ne sont donc pas toujours exactes.',
    noProjects: 'Aucun projet trouvé pour « {query} ». Essayez un autre mot-clé.',
    foundProjects: '{count} projet{plural} trouvé{plural} pour « {query} »',
    serverError: 'Une erreur est survenue. Le serveur est-il démarré ?',
    githubProfile: 'Profil GitHub',
    linkedinProfile: 'Profil LinkedIn',
    emailTianna: 'Écrire à Tianna',
    openProjectGitHub: 'Ouvrir le projet sur GitHub',
  },
} as const

type TranslationKey = keyof (typeof translations)['en']

export function useLanguage() {
  const isFrench = computed(() => language.value === 'fr')

  function syncRoute(path: string) {
    language.value = path === '/fr' ? 'fr' : 'en'
    document.documentElement.lang = language.value
    document.title = language.value === 'fr'
      ? 'Tianna-Lee Salmon | Ingénieure logiciel'
      : 'Tianna-Lee Salmon | Software Engineer'
  }

  async function toggle() {
    if (isSwitching.value) return

    isSwitching.value = true
    await new Promise(resolve => window.setTimeout(resolve, 180))

    try {
      await router.push(language.value === 'en' ? '/fr' : '/')
    } finally {
      await new Promise(resolve => window.setTimeout(resolve, 40))
      isSwitching.value = false
    }
  }

  function t(key: TranslationKey, values: Record<string, string | number> = {}) {
    return translations[language.value][key].replace(/\{(\w+)\}/g, (_, name: string) =>
      String(values[name] ?? `{${name}}`)
    )
  }

  return { language, isFrench, isSwitching, syncRoute, toggle, t }
}
