<template>
  <Teleport to="body">
    <Transition name="modal">
      <div v-if="visible && project" class="modal-overlay" @click.self="emit('close')">
        <div class="modal" role="dialog" aria-modal="true">
          <button class="modal__close" @click="emit('close')" aria-label="Close">✕</button>

          <div class="modal__header">
            <h2 class="modal__title">{{ project.title }}</h2>
            <p class="modal__subtitle">{{ project.description }}</p>
          </div>

          <div class="modal__left">
            <p class="modal__long-description">{{ project.long_description }}</p>
            <div class="modal__section">
              <p class="modal__label">Motivation</p>
              <p class="modal__text">{{ project.motivation }}</p>
            </div>
          </div>

          <div class="modal__right">
            <div class="modal__section">
              <p class="modal__label">Tech Stack</p>
              <ul class="modal__tech">
                <li v-for="tag in project.tech" :key="tag" class="modal__tag">{{ tag }}</li>
              </ul>
            </div>
            <div class="modal__section">
              <p class="modal__label">Key Features</p>
              <ul class="modal__features">
                <li v-for="feature in project.features" :key="feature" class="modal__feature">
                  → {{ feature }}
                </li>
              </ul>
            </div>
            
            <a
              v-if="project.url"
              :href="project.url"
              target="_blank"
              rel="noopener noreferrer"
              class="modal__cta"
            >
              View on GitHub ↗
            </a>
          </div>

        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import type { Project } from '../composables/usePortfolioApi'

defineProps<{
  project: Project | null
  visible: boolean
}>()

const emit = defineEmits<{ close: [] }>()
</script>

<style lang="scss" scoped>
@use '../styles/components/modal';
</style>