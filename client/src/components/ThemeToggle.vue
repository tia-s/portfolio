<template>
  <button class="theme-toggle" @click="toggle" :aria-label="isDark ? 'Switch to light mode' : 'Switch to dark mode'">
    <Sun v-if="isDark" :size="18" />
    <Moon v-else :size="18" />
  </button>
</template>

<script setup lang="ts">
import { Sun, Moon } from 'lucide-vue-next'
import { useTheme } from '../composables/useTheme'

const { isDark, toggle } = useTheme()
</script>

<style lang="scss" scoped>
.theme-toggle {
  position: fixed;
  top: var(--space-6);
  right: var(--space-6);
  z-index: 50;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  color: var(--color-text);
  cursor: pointer;
  transition: background var(--transition), border-color var(--transition), color var(--transition);

  &:hover {
    border-color: var(--color-accent);
    color: var(--color-accent);
  }
}
</style>