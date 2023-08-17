export interface ActorGroupSound {
  playlist: string
  soundName: string
}

export interface ActorGroup {
  images: {
    [key: string]: {
      name: string
      fileName: string
      sound?: ActorGroupSound
    }
  }
}

export interface ActorGroups {
  [key: string]: ActorGroup
}

export const knownActorGroups: ActorGroups = {
  // Cheval Léger
  'Cheval%20L%C3%A9ger': {
    images: {
      idle: {
        name: 'Immobile',
        fileName: 'horse-*-plain-idle.webm',
      },
      walk: {
        name: 'Marcher',
        fileName: 'horse-*-plain-walk.webm',
        sound: {
          playlist: 'Monsters',
          soundName: 'Horse Walking Wagon',
        },
      },
      run: {
        name: 'Galoper',
        fileName: 'horse-*-plain-gallop.webm',
        sound: {
          playlist: 'Monsters',
          soundName: 'Horse Running Wagon',
        },
      },
    },
  },
}
