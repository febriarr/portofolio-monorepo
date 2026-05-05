import { TechStackDetails } from "@workspace/shared"
import {
  TypographyH2,
  TypographyH3,
  TypographyList,
  TypographyP,
} from "@workspace/ui/components/typography"
import { TechStacksGrid } from "./tech-stacks-grid"

export default function AboutSection({ techStacks }: { techStacks: TechStackDetails[] }) {
  return (
    <section className="h-screen w-full space-y-8 md:space-y-12 lg:space-y-16">
      <TypographyH2>About</TypographyH2>
      <div className="grid w-full grid-cols-1 gap-12 md:grid-cols-2 lg:gap-16 xl:gap-24">
        <div className="about">
          <TypographyH3>
            <span className="text-primary">[01]</span> About Me
          </TypographyH3>
          <TypographyP>
            I currently work as an{" "}
            <span className="font-semibold text-orange-foreground">
              Operational Warehouse at PT Suri Tani Pemuka
            </span>
            . Outside of work, I'm focused on growing as a fullstack developer.
          </TypographyP>
        </div>

        <div className="background">
          <TypographyH3>
            <span className="text-primary">[02]</span> Background
          </TypographyH3>
          <TypographyP>My experience in operations shaped how I work:</TypographyP>
          <TypographyList>
            <li>Structured Workflows</li>
            <li>Process Efficiency</li>
            <li>Practical Problem Solving</li>
          </TypographyList>
        </div>

        <div className="interest">
          <TypographyH3>
            <span className="text-primary">[03]</span> Interest
          </TypographyH3>
          <TypographyP>
            I enjoy building things from both backend and frontend side. Some areas I often explore:
          </TypographyP>
          <TypographyList>
            <li>APIs & backend systems</li>
            <li>Integration Third Party</li>
            <li>Clean application structure</li>
          </TypographyList>
        </div>

        <div className="how-i-work">
          <TypographyH3>
            <span className="text-primary">[04]</span> How I Work
          </TypographyH3>
          <TypographyP>
            I prefer simple and clear solutions. I focus on building things that are{" "}
            <span className="font-semibold text-orange-foreground">
              reliable, easy to understand, and scalable
            </span>
            .
          </TypographyP>
        </div>

        <div className="current">
          <TypographyH3>
            <span className="text-primary">[05]</span> Current
          </TypographyH3>
          <TypographyP>Right now I:</TypographyP>
          <TypographyList>
            <li>Work in operations</li>
            <li>Build personal projects in web development</li>
          </TypographyList>
        </div>

        <div className="goal">
          <TypographyH3>
            <span className="text-primary">[06]</span> Goal
          </TypographyH3>
          <TypographyP>I aim to grow into a developer who:</TypographyP>
          <TypographyList>
            <li>Can build end-to-end systems</li>
            <li>Understands how things work under the hood</li>
          </TypographyList>
        </div>

        {techStacks.length > 0 && <TechStacksGrid techStacks={techStacks} />}
      </div>
    </section>
  )
}
