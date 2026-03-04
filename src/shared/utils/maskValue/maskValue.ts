export const maskValue = (value: string): string => {
  const stripped = value.replace(/\s/g, "")
  return `•••• •••• •••• ${stripped.slice(-4)}`
}
