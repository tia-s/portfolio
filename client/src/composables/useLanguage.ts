import { computed, ref } from 'vue'
import router from '../router'

export type Language = 'en' | 'fr'

const language = ref<Language>(window.location.pathname === '/fr' || window.location.pathname.startsWith('/fr/') ? 'fr' : 'en')
const isSwitching = ref(false)

const translations = {
  en: {
    switchThemeLight: 'Switch to light mode',
    switchThemeDark: 'Switch to dark mode',
    recentProjects: 'Recent Projects',
    loading: 'Loading...',
    profileError: 'Tianna\'s profile is playing hide and seek. Her ',
    profileErrorSuffix: ' is the only proof she exists.',
    projectsError: 'Tianna\'s projects are taking a coffee break. See what\'s brewing on ',
    projectsErrorSuffix: '.',
    linkedinLink: 'LinkedIn',
    githubLink: 'GitHub',
    retry: 'Try again',
    chatUnavailable: 'Tianna\'s chatbot is feeling a bit overstimulated. Give it a moment to decompress while you explore her projects below.',
    notFoundEyebrow: 'ERROR 404 · NOTHING TO SEE HERE',
    notFoundTitle: 'Typo or time traveller?',
    notFoundDescription: 'Either way, this page isn\'t here.',
    backToPortfolio: 'Let\'s head back home',
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
    profileError: 'Le profil de Tianna préfère rester anonyme pour l\'instant. Pour en savoir plus, ça se passe sur ',
    profileErrorSuffix: '.',
    projectsError: 'Les projets de Tianna jouent la carte du mystère. Passez plutôt par la porte de derrière sur ',
    projectsErrorSuffix: '.',
    linkedinLink: 'LinkedIn',
    githubLink: 'GitHub',
    retry: 'Réessayer',
    chatUnavailable: 'Le chatbot de Tianna a vidé sa batterie sociale. Laissez-lui un moment pour recharger, ou jetez un œil à ses projets ci-dessous.',
    notFoundEyebrow: 'ERREUR 404 · RIEN À VOIR ICI',
    notFoundTitle: 'Vous cherchiez un bug ?',
    notFoundDescription: 'Super, vous avez trouvé un écran blanc. Vous pouvez fêter ça en retournant sur le site.',
    backToPortfolio: 'Retour chez Tianna',
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
    terminalPlaceholder: 'posez une question ou cherchez un sujet...',
    terminalWelcome: 'Bienvenue dans le terminal de mon portfolio. Saisissez une recherche ou posez une question.',
    terminalExamples: 'Essayez : « python », « spring boot » ou « quelles technologies utilise Tianna ? »',
    terminalDisclaimer: '⚠ À savoir : ce chatbot léger se base sur un nombre limité de conversations avec Tianna. Ses réponses ne sont donc pas toujours exactes.',
    noProjects: 'Aucun projet trouvé pour « {query} ». Essayez un autre mot-clé.',
    foundProjects: '{count} projet{plural} trouvé{plural} pour « {query} »',
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
    language.value = path === '/fr' || path.startsWith('/fr/') ? 'fr' : 'en'
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
