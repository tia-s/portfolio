import { afterEach, beforeEach, describe, it, expect, vi } from 'vitest'
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

  afterEach(() => {
    vi.unstubAllGlobals()
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
  })

  it('shows a recoverable not-found page for unknown routes', async () => {
    await router.push('/this-page-does-not-exist')
    const wrapper = mount(App, { global: { plugins: [router] } })
    await flushPromises()

    expect(wrapper.text()).toContain('ERROR 404')
    expect(wrapper.text()).toContain('Let\'s head back home')
    expect(wrapper.find('a.not-found__link').attributes('href')).toBe('/')

    await router.push('/fr/page-introuvable')
    await flushPromises()

    expect(document.documentElement.lang).toBe('fr')
    expect(wrapper.text()).toContain('ERREUR 404')
    expect(wrapper.find('a.not-found__link').attributes('href')).toBe('/fr')

    wrapper.unmount()
  })

  it('offers a retry when profile and projects requests fail', async () => {
    let requestCount = 0
    vi.stubGlobal('fetch', vi.fn(async (url: string) => {
      requestCount++
      if (requestCount <= 2) throw new Error('connection refused')

      return {
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
      }
    }))

    const wrapper = mount(App, { global: { plugins: [router] } })
    await flushPromises()

    expect(wrapper.text()).toContain('playing hide and seek')
    expect(wrapper.find('.hero h1').text()).toBe('Tianna-Lee Salmon')
    expect(wrapper.text()).not.toContain('connection refused')
    expect(wrapper.findAll('.api-error__retry')).toHaveLength(2)
    expect(wrapper.find('.hero .api-error a').attributes('href')).toBe('https://www.linkedin.com/in/tia-salmon/')
    expect(wrapper.find('.projects .api-error a').attributes('href')).toBe('https://github.com/tia-s')

    await Promise.all(wrapper.findAll('.api-error__retry').map(button => button.trigger('click')))
    await flushPromises()

    expect(wrapper.text()).toContain('Tianna-Lee Salmon')
    expect(wrapper.findAll('.api-error__retry')).toHaveLength(0)

    wrapper.unmount()
  })

  it('lets visitors retry when the chatbot is unavailable', async () => {
    let chatRequests = 0
    vi.stubGlobal('fetch', vi.fn(async (url: string) => {
      if (url.endsWith('/chat')) {
        chatRequests++
        return chatRequests === 1
          ? { ok: false, status: 503, json: async () => ({ detail: 'chat_unavailable' }) }
          : { ok: true, status: 200, json: async () => ({ response: 'Chat is back online.' }) }
      }

      return {
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
      }
    }))

    const wrapper = mount(App, { global: { plugins: [router] } })
    await flushPromises()
    const input = wrapper.find('.terminal__input')
    await input.setValue('Bonjour')
    await input.trigger('keydown.enter')
    await flushPromises()

    expect(wrapper.text()).toContain('feeling a bit overstimulated')
    expect(wrapper.find('.terminal__retry').exists()).toBe(true)

    await wrapper.find('.terminal__retry').trigger('click')
    await flushPromises()

    expect(wrapper.text()).toContain('Chat is back online.')
    expect(chatRequests).toBe(2)

    wrapper.unmount()
  })
})
