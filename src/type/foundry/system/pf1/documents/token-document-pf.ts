import { TokenDocument } from '../../../client/token-document'
import { DocumentModificationContext } from '../../../foundry'
import { RecursivePartial } from '../../../utils/partial'
import { ActorPF } from './actor/actor-pf'

export interface TokenDocumentPFAttributes {
  id: string
  name: string
  texture: {
    src: string
  }
  x: number
  y: number
}

export declare class TokenDocumentPF
  extends TokenDocument
  implements TokenDocumentPFAttributes
{
  get actor(): ActorPF

  get baseActor(): ActorPF

  id: string
  name: string
  texture: {
    src: string
  }
  x: number
  y: number

  update(
    data?: RecursivePartial<TokenDocumentPFAttributes>,
    context?: DocumentModificationContext,
  ): Promise<TokenDocumentPF>
}
