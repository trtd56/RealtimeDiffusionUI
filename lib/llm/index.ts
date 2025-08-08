import { UIGeneratorProvider, LLMProvider } from './types'
import { GeminiProvider } from './gemini'
import { MercuryProvider } from './mercury'

let providerInstance: UIGeneratorProvider | null = null

function getProvider(): UIGeneratorProvider {
  if (!providerInstance) {
    const llmProvider = (process.env.LLM_PROVIDER as LLMProvider) || 'gemini'

    switch (llmProvider) {
      case 'mercury':
        providerInstance = new MercuryProvider()
        break
      case 'gemini':
      default:
        providerInstance = new GeminiProvider()
        break
    }
  }

  return providerInstance
}

export async function generateUI(
  appId: string,
  customPrompt?: string
): Promise<string> {
  const provider = getProvider()
  return provider.generateUI(appId, customPrompt)
}
