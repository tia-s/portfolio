<template>
  <section class="projects">
    <div class="projects__inner">
      <p class="projects__label">Projects</p>
      <div v-if="loading">Loading...</div>
      <div v-else-if="error">{{ error }}</div>
      <div v-else class="projects__grid">
        <ProjectCard
          v-for="(project, i) in projects"
          :key="project.id"
          :project="project"
          :index="i + 1"
          @open="selectedProject = project"
        />
      </div>
    </div>
    <ProjectModal
      :project="selectedProject"
      :visible="selectedProject !== null"
      @close="selectedProject = null"
    />
  </section>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import ProjectCard from './ProjectCard.vue'
import ProjectModal from './ProjectModal.vue'
import { useProjects } from '../composables/usePortfolioApi'
import type { Project } from '../composables/usePortfolioApi'

const { projects, loading, error } = useProjects()
const selectedProject = ref<Project | null>(null)
</script>

<style lang="scss" scoped>
@use '../styles/components/projects';
</style>