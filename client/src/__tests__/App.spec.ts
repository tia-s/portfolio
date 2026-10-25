import { beforeEach, describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { flushPromises } from '@vue/test-utils'
import App from '../App.vue'
import router from '../router'

describe('App', () => {
  beforeEach(async () => {
    vi.stubGlobal('fetch', vi.fn(async (url: string) => ({
      ok: true,
      json: async () => url.includes('/me?')
        ? {
            name: 'Tianna-Lee Salmon',
            tagline: 'Software engineer',
            github: 'https://github.com/tia-s',
            linkedin: 'https://www.linkedin.com/in/tia-salmon/',
            email: 'tianna@example.com',
          }
        : [],
    })))
    await router.push('/')
    await router.isReady()
  })

  it('switches to French at /fr and back to English at /', async () => {
    const wrapper = mount(App, { global: { plugins: [router] } })
    await flushPromises()

    expect(wrapper.text()).toContain('Recent Projects')
    await wrapper.find('.language-toggle').trigger('click')
    await new Promise(resolve => setTimeout(resolve, 240))
    await flushPromises()

    expect(router.currentRoute.value.path).toBe('/fr')
    expect(document.documentElement.lang).toBe('fr')
    expect(wrapper.text()).toContain('Projets récents')

    await wrapper.find('.language-toggle').trigger('click')
    await new Promise(resolve => setTimeout(resolve, 240))
    await flushPromises()

    expect(router.currentRoute.value.path).toBe('/')
    expect(document.documentElement.lang).toBe('en')
    expect(wrapper.text()).toContain('Recent Projects')

    wrapper.unmount()
    vi.unstubAllGlobals()
  })
})
