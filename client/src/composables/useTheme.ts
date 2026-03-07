import { ref } from 'vue'

const isDark = ref(false)

export function useTheme() {
  function init() {
    const saved = localStorage.getItem('theme')
    isDark.value = saved === 'dark'
    applyTheme()
  }

  function toggle() {
    isDark.value = !isDark.value
    localStorage.setItem('theme', isDark.value ? 'dark' : 'light')
    applyTheme()
  }

  function applyTheme() {
    document.documentElement.setAttribute('data-theme', isDark.value ? 'dark' : 'light')
  }

  return { isDark, init, toggle }
}