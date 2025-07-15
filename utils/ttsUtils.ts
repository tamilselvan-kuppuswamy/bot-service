export function stripEmojis(text: string): string {
  return text.replace(/[\u{1F300}-\u{1FAFF}]/gu, ''); // Unicode emoji range
}