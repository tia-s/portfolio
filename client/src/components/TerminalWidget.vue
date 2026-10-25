<template>
  <div class="terminal" ref="terminalEl">
    <div class="terminal__bar">
      <span class="terminal__dot terminal__dot--red" />
      <span class="terminal__dot terminal__dot--yellow" />
      <span class="terminal__dot terminal__dot--green" />
      <span class="terminal__bar-title">portfolio — bash</span>
      <button class="terminal__close" @click="$emit('close')" :aria-label="t('close')">✕</button>
    </div>

    <div class="terminal__output" ref="outputEl">
      <div
        v-for="(line, i) in lines"
        :key="i"
        :class="[
          'terminal__line',
          `terminal__line--${line.type}`,
          { 'api-error': line.type === 'error', 'api-error--terminal': line.type === 'error' },
        ]"
        :role="line.type === 'error' ? 'alert' : undefined"
      >
        <span v-if="line.type === 'input'" class="terminal__prompt">❯ </span>
        <span :class="{ 'terminal__error-message': line.type === 'error' }">{{ line.text }}</span>
        <button
          v-if="line.type === 'error' && lastQuery"
          class="api-error__retry terminal__retry"
          type="button"
          :disabled="loading"
          @click="emit('submit', lastQuery)"
        >
          {{ t('retry') }}
        </button>
      </div>
        <div v-if="loading" class="terminal__line terminal__line--response terminal__loading">
            <span class="terminal__loading-text">{{ t('askingTianna') }}</span>
            <span class="terminal__cursor" />
        </div>
    </div>

    <div class="terminal__input-row">
      <span class="terminal__prompt">❯</span>
      <input
        ref="inputEl"
        v-model="inputValue"
        class="terminal__input"
        :placeholder="t('terminalPlaceholder')"
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
import { useLanguage } from '../composables/useLanguage'

const props = defineProps<{
  lines: TerminalLine[]
  loading: boolean
  lastQuery: string
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
const { t } = useLanguage()

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
