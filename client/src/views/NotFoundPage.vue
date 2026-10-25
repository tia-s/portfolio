<template>
  <main class="not-found">
    <ThemeToggle />
    <section class="not-found__content" aria-labelledby="not-found-title">
      <p class="not-found__eyebrow"><span aria-hidden="true" />{{ t('notFoundEyebrow') }}</p>
      <div class="not-found__code" aria-hidden="true">
        404<span class="not-found__cursor">_</span>
      </div>
      <h1 id="not-found-title">{{ t('notFoundTitle') }}</h1>
      <p class="not-found__description">{{ t('notFoundDescription') }}</p>
      <RouterLink class="not-found__link" :to="isFrench ? '/fr' : '/'">
        <span aria-hidden="true">←</span> {{ t('backToPortfolio') }}
      </RouterLink>
    </section>
  </main>
</template>

<script setup lang="ts">
import { RouterLink } from 'vue-router'
import ThemeToggle from '../components/ThemeToggle.vue'
import { useLanguage } from '../composables/useLanguage'

const { isFrench, t } = useLanguage()
</script>

<style lang="scss" scoped>
@use '../styles/components/error-states';
</style>
