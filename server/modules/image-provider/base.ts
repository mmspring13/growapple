import { joinURL } from 'ufo'
import { createOperationsGenerator, defineProvider } from '@nuxt/image/runtime'

const operationsGenerator = createOperationsGenerator()

export default defineProvider<{ baseURL?: string }>({
  getImage (src, { modifiers, baseURL }) {
    if (!baseURL) {
      baseURL = useRuntimeConfig().public.siteUrl as string
    }

    const operations = operationsGenerator(modifiers)

    return {
      url: joinURL(baseURL, src + (operations ? '?' + operations : ''))
    }
  }
})
