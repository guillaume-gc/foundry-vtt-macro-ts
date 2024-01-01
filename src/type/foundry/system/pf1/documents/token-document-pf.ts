import { TokenDocument } from '../../../client/token-document'
import { ActorPF } from './actor/actor-pf'

export declare class TokenDocumentPF extends TokenDocument {
  get actor(): ActorPF

  get baseActor(): ActorPF

  id: string
  name: string
  texture: {
    src: string
  }
  x: number
  y: number
}
