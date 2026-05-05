import { TechStackDetails } from "@workspace/shared"

export async function getTechStacksSSR(): Promise<TechStackDetails[]> {
  const res = await fetch("http://localhost:8000/api/tech-stacks")
  const data = await res.json()

  return data.data
}
