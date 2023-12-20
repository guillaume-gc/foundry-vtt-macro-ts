import { Document } from '../abstract/document'
import { Actor } from './actor'

export declare class Token {
  document: Document

  get actor(): Actor

  texture: {
    src: string
  }
}
