<template>
  <footer class="footer">
    <p class="footer__text">{{ t('builtWith') }}</p>
    <p class="footer__text">{{ t('deployedWith') }}</p>
  </footer>
</template>

<script setup lang="ts">
import { useLanguage } from '../composables/useLanguage'

const { t } = useLanguage()
</script>

<style lang="scss" scoped>
@use '../styles/components/footer';
</style>