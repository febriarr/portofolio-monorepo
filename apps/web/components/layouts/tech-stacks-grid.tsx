"use client"

import { useState } from "react"
import Image from "next/image"
import { Tooltip, TooltipContent, TooltipTrigger } from "@workspace/ui/components/tooltip"
import { Button } from "@workspace/ui/components/button"
import { TypographyH3 } from "@workspace/ui/components/typography"
import { TechStackDetails } from "@workspace/shared"

export function TechStacksGrid({ techStacks }: { techStacks: TechStackDetails[] }) {
  const [expanded, setExpanded] = useState(false)

  return (
    <div className="col-span-1 md:col-span-2">
      <TypographyH3 className="text-start md:text-center">Tech Stacks</TypographyH3>

      <div className="grid grid-cols-4 gap-6 py-12 md:grid-cols-5 md:px-16 lg:grid-cols-10">
        {techStacks.map((techStack, index) => {
          let className =
            "rounded-xs grayscale transition-all duration-200 ease-in-out hover:grayscale-0"

          if (!expanded) {
            if (index >= 30) {
              className += " hidden"
            } else if (index >= 15) {
              // visible hanya di lg+
              className += " hidden lg:block"
            } else if (index >= 8) {
              // visible hanya di md+
              className += " hidden md:block"
            }
            // index < 8: selalu visible
          }

          return (
            <Tooltip key={techStack.id}>
              <TooltipTrigger asChild>
                <Image
                  src={`${process.env.NEXT_PUBLIC_LINK_R2}/${techStack.logo}`}
                  alt={techStack.name}
                  width={80}
                  height={80}
                  className={className}
                />
              </TooltipTrigger>
              <TooltipContent>{techStack.name}</TooltipContent>
            </Tooltip>
          )
        })}
      </div>

      {/* Button dikontrol CSS per breakpoint agar akurat */}
      {!expanded && (
        <>
          {/* Mobile: tampil jika total > 8 */}
          {techStacks.length > 8 && (
            <div className="flex justify-center md:hidden">
              <Button variant="outline" onClick={() => setExpanded(true)}>
                Show all {techStacks.length} stacks
              </Button>
            </div>
          )}
          {/* md: tampil jika total > 15 */}
          {techStacks.length > 15 && (
            <div className="hidden justify-center md:flex lg:hidden">
              <Button variant="outline" onClick={() => setExpanded(true)}>
                Show all {techStacks.length} stacks
              </Button>
            </div>
          )}
          {/* lg: tampil jika total > 30 */}
          {techStacks.length > 30 && (
            <div className="hidden justify-center lg:flex">
              <Button variant="outline" onClick={() => setExpanded(true)}>
                Show all {techStacks.length} stacks
              </Button>
            </div>
          )}
        </>
      )}

      {expanded && (
        <div className="flex justify-center">
          <Button variant="outline" onClick={() => setExpanded(false)}>
            Show less
          </Button>
        </div>
      )}
    </div>
  )
}
