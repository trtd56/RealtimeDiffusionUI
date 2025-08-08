export interface UIGeneratorProvider {
  generateUI(appId: string, customPrompt?: string): Promise<string>
}

export type LLMProvider = 'gemini' | 'mercury'
