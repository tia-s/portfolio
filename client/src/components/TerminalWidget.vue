<template>
  <div class="terminal" ref="terminalEl">
    <div class="terminal__bar">
      <span class="terminal__dot terminal__dot--red" />
      <span class="terminal__dot terminal__dot--yellow" />
      <span class="terminal__dot terminal__dot--green" />
      <span class="terminal__bar-title">portfolio — bash</span>
      <button class="terminal__close" @click="$emit('close')">✕</button>
    </div>

    <div class="terminal__output" ref="outputEl">
      <div
        v-for="(line, i) in lines"
        :key="i"
        :class="['terminal__line', `terminal__line--${line.type}`]"
      >
        <span v-if="line.type === 'input'" class="terminal__prompt">❯ </span>
        {{ line.text }}
      </div>
        <div v-if="loading" class="terminal__line terminal__line--response terminal__loading">
            <span class="terminal__loading-text">hang on, asking Tianna...</span>
            <span class="terminal__cursor" />
        </div>
    </div>

    <div class="terminal__input-row">
      <span class="terminal__prompt">❯</span>
      <input
        ref="inputEl"
        v-model="inputValue"
        class="terminal__input"
        placeholder="type a search query or question..."
        @keydown.enter="handleSubmit"
        @keydown.up.prevent="historyBack"
        @keydown.down.prevent="historyForward"
        :disabled="loading"
        autocomplete="off"
        spellcheck="false"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, nextTick } from 'vue'
import type { TerminalLine } from '../composables/useTerminal'

const props = defineProps<{
  lines: TerminalLine[]
  loading: boolean
}>()

const emit = defineEmits<{
  submit: [value: string]
  close: []
}>()

const inputValue = ref('')
const inputEl = ref<HTMLInputElement | null>(null)
const outputEl = ref<HTMLElement | null>(null)
const history = ref<string[]>([])
const historyIndex = ref(-1)

function handleSubmit() {
  if (!inputValue.value.trim() || props.loading) return
  history.value.unshift(inputValue.value)
  historyIndex.value = -1
  emit('submit', inputValue.value)
  inputValue.value = ''
}

function historyBack() {
  if (historyIndex.value < history.value.length - 1) {
    historyIndex.value++
    inputValue.value = history.value[historyIndex.value] ?? ''
  }
}

function historyForward() {
  if (historyIndex.value > 0) {
    historyIndex.value--
    inputValue.value = history.value[historyIndex.value] ?? ''
  } else {
    historyIndex.value = -1
    inputValue.value = ''
  }
}

watch(() => props.lines.length, async () => {
  await nextTick()
  if (outputEl.value) outputEl.value.scrollTop = outputEl.value.scrollHeight
})

watch(inputEl, (el) => el?.focus())
</script>

<style lang="scss" scoped>
@use '../styles/components/terminal-widget';
</style>
