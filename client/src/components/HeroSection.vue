<template>
  <section class="hero">
    <div class="hero__inner">
      <div v-if="loading">Loading...</div>
      <div v-else-if="error">{{ error }}</div>
      <template v-else-if="me">
        <p class="hero__prompt">>_ ~/portfolio</p>
        <h1 class="hero__heading">
          Hey, I'm <span class="hero__accent">{{ me.name }}</span>
        </h1>
        <p class="hero__tagline">{{ me.tagline }}</p>
        <div class="hero__links">
          <a class="hero__link" :href="me.github" target="_blank" rel="noopener noreferrer">
            <Github :size="16" class="project-card__icon" />
          </a>
          <a class="hero__link" :href="me.linkedin" target="_blank" rel="noopener noreferrer">
            <Linkedin :size="16" class="project-card__icon" />
          </a>
          <a class="hero__link" :href="`mailto:${me.email}`">
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

const { me, loading, error } = useMe()
</script>

<style lang="scss" scoped>
@use '../styles/components/hero';
</style>