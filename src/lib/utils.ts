export function cn(...classes: Array<string | false | null | undefined>): string {
  return classes.filter(Boolean).join(' ')
}

export function formatIdr(value: number): string {
  return new Intl.NumberFormat('id-ID').format(value)
}

export function formatCompactIdr(value: number): string {
  if (value >= 1000) {
    return `${Math.round(value / 1000)}k`
  }
  return `${value}`
}
