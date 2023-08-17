import { ActorGroupSound, knownActorGroups } from './config'

export const startSound = async (sound: ActorGroupSound) => {
  const soundToPlay = canvas.scene.sounds.find((e) => {
    const {
      flags: { tagger: { tags = '' } = {} },
    } = e

    if (!Array.isArray(tags)) {
      return tags === sound.tag
    }

    return tags.includes(sound.tag)
  })

  if (soundToPlay === undefined) {
    throw new Error(`Could not find to play sound with ${sound.tag} tag`)
  }

  console.log(`Found sound to play with tag ${sound.tag}`, soundToPlay)

  await soundToPlay.update({ hidden: false })
}

export const stopCurrentSounds = async () => {
  const sounds = Object.values(knownActorGroups)
    .flatMap((item) => Object.values(item.images))
    .filter((image) => image.sound)
    .map((image) => image.sound) as ActorGroupSound[]

  console.log('Stop all sounds', sounds)

  for (const sound of sounds) {
    const soundToStop = canvas.scene.sounds.find((e) => {
      const {
        flags: { tagger: { tags = '' } = {} },
      } = e

      if (!Array.isArray(tags)) {
        return tags === sound.tag
      }

      return tags.includes(sound.tag)
    })

    if (soundToStop === undefined) {
      throw new Error(`Could not find sound to stop with ${sound.tag} tag`)
    }

    if (soundToStop.hidden) {
      console.log(
        `Found sound to stop with tag ${sound.tag}, but it's already hidden`,
        soundToStop,
      )
      continue
    }

    console.log(`Found sound to stop with tag ${sound.tag}`, soundToStop)

    await soundToStop.update({ hidden: true })
  }
}
