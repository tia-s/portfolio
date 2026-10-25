<template>
  <div class="locale-shell" :class="{ 'locale-shell--changing': isSwitching }">
    <RouterView />
  </div>
</template>

<script setup lang="ts">
import { onMounted, watch } from 'vue'
import { RouterView, useRoute } from 'vue-router'
import { useTheme } from './composables/useTheme'
import { useLanguage } from './composables/useLanguage'

const { init } = useTheme()
const route = useRoute()
const { isSwitching, syncRoute } = useLanguage()

watch(() => route.path, syncRoute, { immediate: true })
onMounted(init)
</script>

<style lang="scss">
@use './styles/main.scss';

.locale-shell {
  transition: opacity 180ms ease, transform 180ms ease;
}

.locale-shell--changing {
  opacity: 0;
  transform: translateY(4px);
  pointer-events: none;
}

@media (prefers-reduced-motion: reduce) {
  .locale-shell {
    transition: none;
  }
}
</style>