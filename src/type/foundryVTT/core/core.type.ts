import { TokenPF } from '../system/pf1e.type'

export type SystemName = 'PF1'

type SystemToken<CurrentSystemName extends SystemName> =
  CurrentSystemName extends 'PF1' ? TokenPF : never

export enum ChatMessageType {
  OTHER = 0,
}

interface CollectionInstance<T> extends Map<string, T> {
  get contents(): T[]
}

interface Collection<T> {
  new (entries: T[]): CollectionInstance<T>

  // Find an entry in the Map using a functional condition.
  find: (
    condition: (
      element: T,
      index: number,
      collection: Collection<T>,
    ) => boolean,
  ) => T

  // Filter the Collection, returning an Array of entries which match a functional condition.
  filter: (
    condition: (
      element: T,
      index: number,
      collection: Collection<T>,
    ) => boolean,
  ) => T[]

  forEach: (fn: (element: T) => void) => void

  get: (key: string, options?: { strict: boolean }) => T

  // Get an entry from the Collection by name. Use of this method assumes that the objects stored in the collection have a "name" attribute.
  getName: (name: string, options?: { strict: boolean }) => T

  map: (
    transformer: (value: T[], index: number, collection: Collection<T>) => any,
  ) => T[]

  reduce: (
    reducer: (
      accumulator: T,
      currentValue: T,
      index: number,
      collection: Collection<T>,
    ) => any,
    initial: T,
  ) => T

  some: (
    condition: (value: T, index: number, collection: Collection<T>) => boolean,
  ) => boolean
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
