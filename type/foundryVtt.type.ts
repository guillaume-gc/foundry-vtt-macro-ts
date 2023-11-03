// Note: this is only a very basic representation of FoundryVTT types.
export namespace FoundryVTT {
  export enum ChatMessageType {
    OTHER = 0,
  }

  export interface DocumentModificationContext {}

  export interface RollMode {}

  export interface ChatSpeaker {
    actor: string
    alias: string
    scene: string
    token: string
  }

  export interface RollModeOptions {
    content: string
    user: string
    speaker: ChatSpeaker
    type: ChatMessageType
  }

  export interface GetSpeakerOptions {
    user: User
  }

  export interface GetRollDataOptions {}

  export interface DialogButton {
    icon?: string
    label: string
    callback: (htm: JQuery) => void
  }

  export interface DialogOptions {
    title: string
    content: string
    buttons: {
      [key: string]: DialogButton
    }
    render?: (htm: JQuery) => void
  }

  export interface TokenPF {
    document: {
      name: string
      texture: {
        src: string
      }
      x: number
      y: number
    }
    id: string
    actor: ActorPF
  }

  export interface User {
    _id: string
  }

  export type Permission = 'NONE' | 'LIMITED' | 'OBSERVER' | 'OWNER'

  export interface ActorPFDetails {}

  export interface PFRollDataAbility {
    mod: number
  }

  export interface PFRollDataSkill {
    rank: number
    mod: number
  }

  export interface PFRollData {
    abilities: {
      str: PFRollDataAbility
      dex: PFRollDataAbility
      con: PFRollDataAbility
      int: PFRollDataAbility
      wis: PFRollDataAbility
      cha: PFRollDataAbility
    }
    attributes: {
      hd: {
        total: string
      }
      ac: {
        normal: {
          total: number
        }
        flatFooted: {
          total: number
        }
        touch: {
          total: number
        }
      }
      cmd: {
        flatFootedTotal: number
        total: number
      }
      bab: {
        total: number
      }
      sr: {
        total: number
      }
    }
    skills: {
      sen: PFRollDataSkill
    }
    traits: {
      eres: string
      di: {
        value: string[]
        custom: string
      }
      cres: string
      ci: {
        value: string[]
        custom: string
      }
      dv: {
        value: string[]
        custom: string
      }
    }
  }

  export interface ActorBasePF {
    name: string
    details: ActorPFDetails
    testUserPermission: (user: User, permission: Permission) => boolean
    getRollData: (options: GetRollDataOptions) => PFRollData
  }

  interface ActorNPCPF extends ActorBasePF {
    details: ActorPFDetails & {
      cr: {
        total: number
      }
      xp: {
        value: number
      }
    }
  }

  export type ActorPF = ActorBasePF | ActorNPCPF

  export interface TokenLayer {
    // Tokens owned by the player
    ownedTokens: TokenPF[]

    // Tokens currently selected by the player
    controlled: TokenPF[]
  }

  export interface Flags {
    [key: string]: {
      [key: string]: string[] | string
    }
  }

  export type SetFlag = (
    namespace: string,
    flagName: string,
    flagValue: string | boolean,
  ) => Promise<void>

  export interface TilesLayerObjectChildren {
    document: {
      flags: Flags
      setFlag: SetFlag
    }
  }

  export interface TilesLayer {
    objects: {
      children: TilesLayerObjectChildren[]
    }
  }

  export interface TileDocument {
    flags: Flags
    setFlag: SetFlag
  }

  export interface AmbiantSoundDocument {
    flags: Flags
    setFlag: SetFlag
    hidden: boolean
    path: string
    update: (options: { hidden: boolean }) => Promise<void>
  }

  interface Scene {
    sounds: AmbiantSoundDocument[]
    tiles: TileDocument[]
  }

  export interface Canvas {
    tokens: TokenLayer
    tiles: TilesLayer
    scene: Scene
  }

  export interface UserInterface {
    notifications: {
      info: (message: string) => void
      warn: (message: string) => void
      error: (message: string) => void
    }
  }

  export interface Game {
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
    user: User
    settings: {
      get: (module: string, key: string) => string
    }
  }

  export interface Sound {
    name: string
    playing: boolean
  }

  export interface PlayList {
    name: string
    // Technically, it's an EmbeddedCollection, which is a custom Foundry VTT type, but for now treating it as an array does the job.
    sounds: Sound[]
    playSound: (sound: Sound) => Promise<void>
    stopSound: (sound: Sound) => Promise<void>
  }
}
