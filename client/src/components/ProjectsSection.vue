<template>
  <section class="projects">
    <div class="projects__inner">
      <p class="projects__label">Recent Projects</p>

      <Transition name="terminal-slide">
        <TerminalWidget
          v-if="terminalOpen"
          :lines="lines"
          :loading="loading"
          @submit="submit"
          @close="terminalOpen = false"
        />
      </Transition>

      <div v-if="projectsLoading">Loading...</div>
      <div v-else-if="projectsError">{{ projectsError }}</div>
      <TransitionGroup v-else name="project-filter" tag="div" class="projects__grid">
        <ProjectCard
          v-for="(project, i) in displayedProjects"
          :key="project.id"
          :project="project"
          :index="i + 1"
          @open="selectedProject = project"
        />
      </TransitionGroup>
    </div>

    <TerminalToggle :open="terminalOpen" @toggle="terminalOpen = !terminalOpen" />

    <ProjectModal
      :project="selectedProject"
      :visible="selectedProject !== null"
      @close="selectedProject = null"
    />
  </section>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import ProjectCard from './ProjectCard.vue'
import ProjectModal from './ProjectModal.vue'
import TerminalWidget from './TerminalWidget.vue'
import TerminalToggle from './TerminalToggle.vue'
import { useProjects } from '../composables/usePortfolioApi'
import { useTerminal } from '../composables/useTerminal'
import type { Project } from '../composables/usePortfolioApi'

const { projects, loading: projectsLoading, error: projectsError } = useProjects()
const selectedProject = ref<Project | null>(null)
const terminalOpen = ref(true)
const filteredProjects = ref<Project[] | null>(null)

const displayedProjects = computed(() =>
  filteredProjects.value !== null ? filteredProjects.value : projects.value
)

const { lines, loading, submit } = useTerminal((results) => {
  filteredProjects.value = results
})
</script>

<style lang="scss" scoped>
@use '../styles/components/projects';
</style>