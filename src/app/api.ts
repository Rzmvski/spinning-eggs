import OpenAI from 'openai';

const apiKey = process.env.OPENROUTER_API_KEY

const client = new OpenAI({
  baseURL: 'https://openrouter.ai/api/v1',
  apiKey,
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