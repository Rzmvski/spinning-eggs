import OpenAI from 'openai';

const client = new OpenAI({
  baseURL: 'https://openrouter.ai/api/v1',
  apiKey: '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',
  dangerouslyAllowBrowser: true,
})

export const loadAnalytics = async () => {
  return client.chat.completions.create({
    model: 'google/gemma-3-12b-it:free',
    messages: [
      {
        role: 'user',
        content: 'pretend to be an analyst Viatcheslav and send one wierd or interesting fact about eggs, no longer then 50 words',
      }
    ],
    max_tokens: 50,
  }).then(response => {
    return response?.choices[0]?.message?.content
  }).catch(() => {
    return 'That is all for today'
  })
}