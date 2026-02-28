import { EmbeddedCollection } from './abstract/embedded-collection'
import { CompendiumPack } from './client/compendium-pack'
import { TokenPF } from './system/pf1/canvas/token-pf'
import { ItemPF } from './system/pf1/documents/item/item-pf'
import { PacksMinimalIndexPF } from './system/pf1/documents/minimal-index-pf'

export type SystemName = 'PF1'

type SystemToken<CurrentSystemName extends SystemName> =
  CurrentSystemName extends 'PF1' ? TokenPF : never

type SystemPacksData<CurrentSystemName extends SystemName> =
  CurrentSystemName extends 'PF1' ? ItemPF : never

type SystemPacksMinimalIndex<CurrentSystemName extends SystemName> =
  CurrentSystemName extends 'PF1' ? PacksMinimalIndexPF : never

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
  default: string
  close: (htm: JQuery) => void
}

export interface User {
  _id: string
}

export type Permission = 'NONE' | 'LIMITED' | 'OBSERVER' | 'OWNER'

export interface Flags {
  [key: string]: {
    [key: string]: string[] | string
  }
}

export interface TokenLayer<CurrentSystemName extends SystemName> {
  // Tokens owned by the player
  ownedTokens: SystemToken<CurrentSystemName>[]

  // Tokens currently selected by the player
  controlled: SystemToken<CurrentSystemName>[]
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

export interface Canvas<CurrentSystemName extends SystemName> {
  tokens: TokenLayer<CurrentSystemName>
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

export interface Game<CurrentSystemName extends SystemName> {
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
  packs: CompendiumPack<
    SystemPacksMinimalIndex<CurrentSystemName>,
    SystemPacksData<CurrentSystemName>
  >
}

export interface Sound {
  name: string
  playing: boolean
}

export interface PlayList {
  name: string
  sounds: EmbeddedCollection<Sound>
  playSound: (sound: Sound) => Promise<void>
  stopSound: (sound: Sound) => Promise<void>
}
