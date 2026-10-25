<template>
  <div class="site-controls">
    <button class="theme-toggle" @click="toggle" :aria-label="t(isDark ? 'switchThemeLight' : 'switchThemeDark')">
      <Sun v-if="isDark" :size="18" />
      <Moon v-else :size="18" />
    </button>
    <button
      class="language-toggle"
      @click="toggleLanguage"
      :aria-label="isFrench ? 'Switch to English' : 'Passer en français'"
      :aria-pressed="isFrench"
    >
      <span :class="{ 'language-toggle__active': !isFrench }">EN</span>
      <span class="language-toggle__separator" aria-hidden="true">/</span>
      <span :class="{ 'language-toggle__active': isFrench }">FR</span>
    </button>
  </div>
</template>

<script setup lang="ts">
import { Sun, Moon } from 'lucide-vue-next'
import { useTheme } from '../composables/useTheme'
import { useLanguage } from '../composables/useLanguage'

const { isDark, toggle } = useTheme()
const { isFrench, toggle: toggleLanguage, t } = useLanguage()
</script>

<style lang="scss" scoped>
@use '../styles/components/theme-toggle';
</style>