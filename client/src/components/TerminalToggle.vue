<template>
  <button class="terminal-toggle" @click="$emit('toggle')" :title="open ? t('closeTerminal') : t('openTerminal')">
    <span class="terminal-toggle__icon">⌘_</span>
  </button>
</template>

<script setup lang="ts">
import { useLanguage } from '../composables/useLanguage'

defineProps<{ open: boolean }>()
defineEmits<{ toggle: [] }>()

const { t } = useLanguage()
</script>

<style lang="scss" scoped>
@use '../styles/components/terminal-toggle';
</style>