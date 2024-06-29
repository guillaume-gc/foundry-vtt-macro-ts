import { Token, TokenAttribute } from '../../../client/token'
import { DocumentModificationContext } from '../../../foundry'
import { RecursivePartial } from '../../../utils/partial'
import { ActorPF } from '../documents/actor/actor-pf'
import { TokenDocumentPF } from '../documents/token-document-pf'

interface TokenPDFAttributes extends TokenAttribute {
  document: TokenDocumentPF
}

export declare class TokenPF extends Token implements TokenPDFAttributes {
  document: TokenDocumentPF

  get actor(): ActorPF
  id: string

  update(
    data?: RecursivePartial<TokenPDFAttributes>,
    context?: DocumentModificationContext,
  ): Promise<TokenPF>
}
