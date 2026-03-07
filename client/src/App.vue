<template>
  <div id="app">
    <ThemeToggle />
    <HeroSection />
    <ProjectsSection />
    <FooterSection />
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import HeroSection from './components/HeroSection.vue'
import ProjectsSection from './components/ProjectsSection.vue'
import ThemeToggle from './components/ThemeToggle.vue'
import FooterSection from './components/FooterSection.vue'
import { useTheme } from './composables/useTheme'

const { init } = useTheme()
onMounted(() => init())
</script>

<style lang="scss">
@use './styles/main.scss';
</style>