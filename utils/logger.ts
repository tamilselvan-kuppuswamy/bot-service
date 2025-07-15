export function logInfo(message: string, context: Record<string, any> = {}): void {
  console.log(`[INFO] ${new Date().toISOString()} - ${message}`, JSON.stringify(context));
}

export function logError(message: string, context: Record<string, any> = {}): void {
  console.error(`[ERROR] ${new Date().toISOString()} - ${message}`, JSON.stringify(context));
}
