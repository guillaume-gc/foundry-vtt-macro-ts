import { Document } from '../../../abstract/document'
import { TokenAttribute } from '../../../client/token'
import { TokenDocument } from '../../../client/token-document'
import { DocumentModificationContext } from '../../../foundry'
import { RecursivePartial } from '../../../utils/partial'
import { ActorPF } from './actor/actor-pf'

export type TokenDocumentPFAttributes = TokenAttribute

export declare class TokenDocumentPF
  extends TokenDocument
  implements TokenDocumentPFAttributes
{
  get actor(): ActorPF

  get baseActor(): ActorPF

  document: Document

  id: string
  name: string
  texture: {
    src: string
    offSetX: number
    offSetY: number
    rotation: number
    scaleX: number
    scaleY: number
    tintX: number | undefined
  }
  x: number
  y: number

  update(
    data?: RecursivePartial<TokenDocumentPFAttributes>,
    context?: DocumentModificationContext,
  ): Promise<TokenDocumentPF>
}
