import { ActorGroupScrolling } from './config'

export const updateScrolling = async (scrolling: ActorGroupScrolling) => {
  const tilesToUpdate = canvas.tiles.objects.children.filter((e) => {
    const {
      document: {
        flags: { tagger: { tags = '' } = {} },
      },
    } = e

    if (!Array.isArray(tags)) {
      return tags === scrolling.tag
    }

    return tags.includes(scrolling.tag)
  })

  const operations: Promise<void>[] = []

  for (const child of tilesToUpdate) {
    operations.push(
      child.document.setFlag('tile-scroll', 'scrollSpeed', scrolling.speed),
    )
    operations.push(
      child.document.setFlag('tile-scroll', 'enableScroll', scrolling.enable),
    )
  }

  await Promise.all(operations)
}
