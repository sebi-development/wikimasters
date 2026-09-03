import { generateText } from 'ai'

export async function summarizeArticle(
  title: string,
  article: string
): Promise<string> {
  if (!article || !article.trim()) throw new Error('Article content needed to generate summary')


  const prompt = [
    'You are an expert editor tasked with summarizing Wikipedia articles.',
    '',
    'Your objective is to provide a brief overview so readers can quickly decide if they want to read the full text.',
    '',
    'Follow these instructions strictly:',
    '1. Read the provided article text carefully.',
    '2. Write a concise summary of exactly 1 to 2 sentences.',
    '3. Focus only on the main subject and the most crucial details.',
    '4. Do NOT add personal opinions, commentary, or information not present in the article.',
    '5. Output ONLY the summary text, with no conversational filler, preamble, or XML tags.',
    '',
    'Here is the article to summarize:',
    '',
    '<title>',
    title,
    '</title>',
    '',
    '<article>',
    article,
    '</article>'
  ].join('\n');

  const { text } = await generateText({
    model: 'google/gemini-2.5-flash-lite',
    system: 'You are an assistant that writes concise factual summaries.',
    prompt,
  });

  return text;
}