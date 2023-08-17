export interface ActorGroupSound {
  playlist: string
  soundName: string
}

export interface ActorGroupScrolling {
  enable: boolean
  tag: string
  speed: string
}

export interface ActorGroup {
  images: {
    [key: string]: {
      name: string
      fileName: string
      sound?: ActorGroupSound
      scrolling?: ActorGroupScrolling
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
        scrolling: {
          enable: false,
          tag: 'scrolling',
          speed: '0',
        },
      },
      walk: {
        name: 'Marcher',
        fileName: 'horse-*-plain-walk.webm',
        scrolling: {
          enable: true,
          tag: 'scrolling',
          speed: '0.12',
        },
        sound: {
          playlist: 'Monsters',
          soundName: 'Horse Walking',
        },
      },
      run: {
        name: 'Galoper',
        fileName: 'horse-*-plain-gallop.webm',
        scrolling: {
          enable: true,
          tag: 'scrolling',
          speed: '0.24',
        },
        sound: {
          playlist: 'Monsters',
          soundName: 'Horse Running',
        },
      },
    },
  },
}
