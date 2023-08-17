import { ActorGroupSound, knownActorGroups } from './config'

export const startSound = async (sound: ActorGroupSound) => {
  const playlistToUse = game.playlists.find((p) => p.name === sound.playlist)
  if (playlistToUse === undefined) {
    throw new Error(`Could not find "${sound.playlist}" playlist to play sound`)
  }

  console.log(`Found playlist ${sound.playlist} to play sound`, playlistToUse)

  const soundToPlay = playlistToUse.sounds.find(
    (s) => s.name === sound.soundName,
  )
  if (soundToPlay === undefined) {
    throw new Error(`Could not find "${sound.soundName}" sound to play`)
  }

  console.log(`Found sound ${sound.soundName} to play`, soundToPlay)

  await playlistToUse.playSound(soundToPlay)
}

export const stopCurrentSounds = async () => {
  const sounds = Object.values(knownActorGroups)
    .flatMap((item) => Object.values(item.images))
    .filter((image) => image.sound)
    .map((image) => image.sound) as ActorGroupSound[]

  console.log('Stop all sounds', sounds)

  for (const sound of sounds) {
    const playlistToUse = game.playlists.find((p) => p.name === sound.playlist)
    if (playlistToUse === undefined) {
      throw new Error(
        `Could not find "${sound.playlist}" playlist to stop sounds`,
      )
    }

    console.log(`Found playlist ${sound.playlist} to stop sound`, playlistToUse)

    const soundToStop = playlistToUse.sounds.find(
      (s) => s.name === sound.soundName,
    )
    if (soundToStop === undefined) {
      throw new Error(`Could not find "${sound.soundName}" sound to stop`)
    }

    if (!soundToStop.playing) {
      console.log(
        `Found sound ${sound.soundName} to stop, but it's not playing`,
        soundToStop,
      )
      continue
    }

    console.log(`Found sound ${sound.soundName} to stop`, soundToStop)

    await playlistToUse.stopSound(soundToStop)
  }
}
