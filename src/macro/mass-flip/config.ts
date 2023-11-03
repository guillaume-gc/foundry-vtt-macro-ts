export interface ActorGroupSound {
  tag: string
}

export interface ActorGroupScrolling {
  enabled: boolean
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
      scale: {
        x: number
        y: number
      }
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
          enabled: false,
          tag: 'scrolling',
          speed: '0',
        },
        scale: {
          x: 1.8,
          y: 1.8,
        },
      },
      rest: {
        name: 'Repos',
        fileName: 'horse-*-plain-idle2.webm',
        scrolling: {
          enabled: false,
          tag: 'scrolling',
          speed: '0',
        },
        scale: {
          x: 1.6,
          y: 1.6,
        },
      },
      walk: {
        name: 'Marcher',
        fileName: 'horse-*-plain-walk.webm',
        scrolling: {
          enabled: true,
          tag: 'scrolling',
          speed: '0.12',
        },
        sound: {
          tag: 'horseWalking',
        },
        scale: {
          x: 1.6,
          y: 1.6,
        },
      },
      run: {
        name: 'Galoper',
        fileName: 'horse-*-plain-gallop.webm',
        scrolling: {
          enabled: true,
          tag: 'scrolling',
          speed: '0.36',
        },
        sound: {
          tag: 'horseRunning',
        },
        scale: {
          x: 1.8,
          y: 1.8,
        },
      },
    },
  },
}
