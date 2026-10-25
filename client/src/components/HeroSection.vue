<template>
  <section class="hero">
    <div class="hero__inner">
      <p class="hero__prompt">$ whoami</p>
      <h1 class="hero__heading">
        <span class="hero__accent">{{ me?.name ?? 'Tianna-Lee Salmon' }}</span>
      </h1>

      <div v-if="loading && !me">{{ t('loading') }}</div>
      <div v-else-if="error" class="api-error" role="alert">
        <p>
          {{ error }}<a href="https://www.linkedin.com/in/tia-salmon/" target="_blank" rel="noopener noreferrer">{{ t('linkedinLink') }}</a>{{ t('profileErrorSuffix') }}
        </p>
        <button class="api-error__retry" type="button" @click="retry">{{ t('retry') }}</button>
      </div>
      <template v-if="me">
        <p class="hero__tagline">{{ me.tagline }}</p>
        <div class="hero__links">
          <a class="hero__link" :href="me.github" target="_blank" rel="noopener noreferrer" :aria-label="t('githubProfile')">
            <Github :size="16" class="project-card__icon" />
          </a>
          <a class="hero__link" :href="me.linkedin" target="_blank" rel="noopener noreferrer" :aria-label="t('linkedinProfile')">
            <Linkedin :size="16" class="project-card__icon" />
          </a>
          <a class="hero__link" :href="`mailto:${me.email}`" :aria-label="t('emailTianna')">
            <Mail :size="16" class="project-card__icon" />
          </a>
        </div>
      </template>
    </div>
  </section>
</template>

<script setup lang="ts">
import { useMe } from '../composables/usePortfolioApi'
import { Github, Linkedin, Mail} from 'lucide-vue-next'
import { useLanguage } from '../composables/useLanguage'

const { me, loading, error, retry } = useMe()
const { t } = useLanguage()
</script>

<style lang="scss" scoped>
@use '../styles/components/hero';
</style>