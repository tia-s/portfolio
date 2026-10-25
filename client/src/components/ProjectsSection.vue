<template>
  <section class="projects">
    <div class="projects__inner">
      <p class="projects__label">{{ t('recentProjects') }}</p>

      <Transition name="terminal-slide">
        <TerminalWidget
          v-if="terminalOpen"
          :lines="lines"
          :loading="loading"
          @submit="submit"
          @close="terminalOpen = false"
        />
      </Transition>

      <div v-if="projectsLoading && projects.length === 0">{{ t('loading') }}</div>
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
import { ref, computed, watch } from 'vue'
import ProjectCard from './ProjectCard.vue'
import ProjectModal from './ProjectModal.vue'
import TerminalWidget from './TerminalWidget.vue'
import TerminalToggle from './TerminalToggle.vue'
import { useProjects } from '../composables/usePortfolioApi'
import { useTerminal } from '../composables/useTerminal'
import type { Project } from '../composables/usePortfolioApi'
import { useLanguage } from '../composables/useLanguage'

const { projects, loading: projectsLoading, error: projectsError } = useProjects()
const { language, t } = useLanguage()
const selectedProject = ref<Project | null>(null)
const terminalOpen = ref(true)
const filteredProjects = ref<Project[] | null>(null)

const displayedProjects = computed(() =>
  filteredProjects.value !== null ? filteredProjects.value : projects.value
)

const { lines, loading, submit } = useTerminal((results) => {
  filteredProjects.value = results
})

watch(language, () => {
  selectedProject.value = null
  filteredProjects.value = null
})
</script>

<style lang="scss" scoped>
@use '../styles/components/projects';
</style>