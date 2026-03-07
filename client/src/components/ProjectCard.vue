<template>
  <div class="project-card" @click="emit('open')">
    <div class="project-card__header">
    <a
        v-if="project.url"
        :href="project.url"
        target="_blank"
        rel="noopener noreferrer"
        @click.stop
    >
        <Github :size="16" class="project-card__icon" />
    </a>
    <Github v-else :size="16" class="project-card__icon" />
    </div>
    <h3 class="project-card__title">{{ project.title }}</h3>
    <p class="project-card__description">{{ project.description }}</p>
    <ul class="project-card__tech">
      <li v-for="tag in visibleTech" :key="tag" class="project-card__tag">{{ tag }}</li>
      <li v-if="hiddenCount > 0" class="project-card__tag">+{{ hiddenCount }}</li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { Github } from 'lucide-vue-next'
import type { Project } from '../composables/usePortfolioApi'

const props = defineProps<{
  project: Project
  index: number
}>()

const emit = defineEmits<{
  open: []
}>()

const MAX_VISIBLE_TAGS = 3
const visibleTech = computed(() => props.project.tech.slice(0, MAX_VISIBLE_TAGS))
const hiddenCount = computed(() => Math.max(0, props.project.tech.length - MAX_VISIBLE_TAGS))
</script>

<style lang="scss" scoped>
@use '../styles/components/project-card';
</style>