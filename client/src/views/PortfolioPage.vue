<template>
  <div id="app">
    <ThemeToggle />
    <HeroSection />
    <ProjectsSection />
    <FooterSection />
  </div>
</template>

<script setup lang="ts">
import FooterSection from '../components/FooterSection.vue'
import HeroSection from '../components/HeroSection.vue'
import ProjectsSection from '../components/ProjectsSection.vue'
import ThemeToggle from '../components/ThemeToggle.vue'
</script>
