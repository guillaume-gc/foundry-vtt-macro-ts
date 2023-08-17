import { ActorGroupScrolling } from './config'

export const updateScrolling = async (scrolling: ActorGroupScrolling) => {
  const tilesToUpdate = canvas.scene.tiles.filter((e) => {
    const {
      flags: { tagger: { tags = '' } = {} },
    } = e

    if (!Array.isArray(tags)) {
      return tags === scrolling.tag
    }

    return tags.includes(scrolling.tag)
  })

  const operations: Promise<void>[] = []

  for (const child of tilesToUpdate) {
    operations.push(
      child.setFlag('tile-scroll', 'scrollSpeed', scrolling.speed),
    )
    operations.push(
      child.setFlag('tile-scroll', 'enableScroll', scrolling.enable),
    )
  }

  await Promise.all(operations)
}
