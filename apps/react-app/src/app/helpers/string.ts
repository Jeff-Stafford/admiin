export function truncateString(
  input: string,
  maxLength?: number | undefined
): string {
  if (!maxLength || input.length <= maxLength) {
    return input;
  }
  return input.slice(0, maxLength) + '...';
}
