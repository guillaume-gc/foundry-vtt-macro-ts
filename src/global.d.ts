// Note: this is only a very basic representation of FoundryVTT types.
export namespace FoundryVTT {
  interface DialogButton {
    icon: string
    label: string
    callback: (htm: JQuery) => void
  }

  interface DialogOptions {
    title: string
    content: string
    buttons: {
      [key: string]: DialogButton
    }
    render: (htm: JQuery) => void
  }

  interface TokenPF {
    document: {
      name: string
      texture: {
        src: string
      }
    }
    id: string
  }

  interface TokenLayer {
    ownedTokens: TokenPF[]
  }

  interface Flags {
    [key: string]: {
      [key: string]: string[] | string
    }
  }

  type SetFlag = (
    namespace: string,
    flagName: string,
    flagValue: string | boolean,
  ) => Primise<void>

  interface TilesLayerObjectChildren {
    document: {
      flags: Flags
      setFlag: SetFlag
    }
  }

  interface TilesLayer {
    objects: {
      children: TilesLayerObjectChildren[]
    }
  }

  interface TileDocument {
    flags: Flags
    setFlag: SetFlag
  }

  interface AmbiantSoundDocument {
    flags: Flags
    setFlag: SetFlag
    hidden: boolean
    path: string
    update: ({ hidden: boolean }) => Promise<void>
  }

  interface Scene {
    sounds: AmbiantSoundDocument[]
    tiles: TileDocument[]
  }

  interface Canvas {
    tokens: TokenLayer
    tiles: TilesLayer
    scene: Scene
  }

  interface UserInterface {
    notifications: {
      info: (message: string) => void
      warn: (message: string) => void
      error: (message: string) => void
    }
  }

  interface Game {
    scenes: {
      viewed: {
        updateEmbeddedDocuments: (
          embeddedName: string,
          updates?: Array<Record<string, unknown>>,
          context?: DocumentModificationContext,
        ) => Promise<void>
      }
    }
    playlists: PlayList[]
  }

  interface Sound {
    name: string
    playing: boolean
  }

  interface PlayList {
    name: string
    // Technically, it's an EmbeddedCollection, which is a custom Foundry VTT type, but for now treating it as an array does the job.
    sounds: Sound[]
    playSound: (sound: Sound) => Promise<void>
    stopSound: (sound: Sound) => Promise<void>
  }
}

declare global {
  const canvas: FoundryVTT.Canvas
  const ui: FoundryVTT.UserInterface
  const game: FoundryVTT.Game

  class Dialog {
    constructor(options: FoundryVTT.DialogOptions)
    render(flag: boolean): void
  }
}

export {}
