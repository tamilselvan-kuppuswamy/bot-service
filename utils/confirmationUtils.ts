export function isYes(input: string): boolean {
  return ['yes', 'y', 'yeah', 'sure', 'ok', 'okay', 'confirm', 'go ahead'].includes(input.toLowerCase());
}

export function isNo(input: string): boolean {
  return ['no', 'n', 'nope', 'cancel', 'stop', 'never mind'].includes(input.toLowerCase());
}