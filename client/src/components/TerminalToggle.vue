<template>
  <button class="terminal-toggle" @click="$emit('toggle')" :title="open ? 'Close terminal' : 'Open terminal'">
    <span class="terminal-toggle__icon">⌘_</span>
  </button>
</template>

<script setup lang="ts">
defineProps<{ open: boolean }>()
defineEmits<{ toggle: [] }>()
</script>

<style lang="scss" scoped>
@use '../styles/components/terminal-toggle';
</style>