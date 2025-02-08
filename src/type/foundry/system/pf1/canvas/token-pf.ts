import { Token, TokenAttribute } from '../../../client/token'
import { ActorPF } from '../documents/actor/actor-pf'
import { TokenDocumentPF } from '../documents/token-document-pf'

interface TokenPDFAttributes extends TokenAttribute {
  document: TokenDocumentPF
  id: string
  visible: boolean
}

export declare class TokenPF extends Token implements TokenPDFAttributes {
  document: TokenDocumentPF

  get actor(): ActorPF
  id: string
  visible: boolean
}
