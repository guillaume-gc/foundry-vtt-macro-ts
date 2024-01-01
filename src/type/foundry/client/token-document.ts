import { Document } from '../abstract/document'
import { Actor } from './actor'

export declare class TokenDocument extends Document {
  get actor(): Actor

  get baseActor(): Actor

  get isOwner(): boolean

  get isLinked(): boolean
}
