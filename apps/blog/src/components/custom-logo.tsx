import { TypographyP } from '@workspace/ui/components/typography'

export default function CustomLogo() {
  return (
    <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={'/icon.png'} alt={'logo febri ardiansyah'} width={50} height={50} />
      <TypographyP>Blog Dashboard</TypographyP>
    </div>
  )
}
