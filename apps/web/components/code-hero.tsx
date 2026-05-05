import { codeToHtml } from "shiki"

const code = `async function startJourney(): Promise<string> {
  await build();
  await deploy();

  return "Creating digital experiences.";
}`

export default async function CodeHero() {
  const html = await codeToHtml(code, {
    lang: "typescript",
    theme: "one-dark-pro",
  })

  return (
    <div className="w-full overflow-hidden rounded-2xl border border-white/10 bg-[#1e1e1e] shadow-2xl">
      {/* Header ala VSCode */}
      <div className="flex items-center gap-2 border-b border-white/10 bg-[#2d2d2d] px-4 py-3">
        <div className="h-3 w-3 rounded-full bg-red-500" />
        <div className="h-3 w-3 rounded-full bg-yellow-500" />
        <div className="h-3 w-3 rounded-full bg-green-500" />
        <span className="ml-4 text-sm text-gray-400">journey.ts</span>
      </div>

      {/* Code */}
      <div
        className="overflow-x-auto text-sm [&_pre]:!m-0 [&_pre]:!bg-transparent [&_pre]:!p-6 [&_pre]:leading-7"
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </div>
  )
}
