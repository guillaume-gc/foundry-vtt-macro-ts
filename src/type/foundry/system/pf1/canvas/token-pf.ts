import { Token } from '../../../client/token'
import { ActorPF } from '../documents/actor/actor-pf'
import { TokenDocumentPF } from '../documents/token-document-pf'

export declare class TokenPF extends Token {
  document: TokenDocumentPF

  get actor(): ActorPF
  id: string
}
