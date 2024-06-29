import { Document } from '../abstract/document'
import { Actor } from './actor'

export interface DocumentAttributes {}

export declare class TokenDocument
  extends Document
  implements DocumentAttributes
{
  get actor(): Actor

  get baseActor(): Actor

  get isOwner(): boolean

  get isLinked(): boolean
}
