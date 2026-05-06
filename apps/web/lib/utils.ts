export function formatDate(date: string | Date) {
  return new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(date))
}

export const truncate = (str: string, max: number) =>
  str.length > max ? str.slice(0, max) + "..." : str
