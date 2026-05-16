import type { FieldHook } from 'payload'
import type { Post } from '@/payload-types' // generated types kamu

export const handleIsHighlighted: FieldHook<Post, boolean, Post> = async ({
  value, // nilai field isHighlighted yang masuk
  originalDoc, // full doc sebelum perubahan (defined on update, undefined on create)
  operation, // 'create' | 'update'
  req,
  siblingData,
}) => {
  // stop rekursi, return value saat ini sebagai boolean
  if (req.context?.isHighlightUpdate) return Boolean(siblingData?.isHighlighted ?? value)

  if (value === true) {
    await req.payload.update({
      collection: 'posts',
      where: {
        and: [
          { isHighlighted: { equals: true } },
          ...(operation === 'update' && originalDoc?.id
            ? [{ id: { not_equals: originalDoc.id } }]
            : []),
        ],
      },
      data: { isHighlighted: false },
      context: { isHighlightUpdate: true },
      req,
    })
  }

  // return boolean
  return Boolean(value)
}
