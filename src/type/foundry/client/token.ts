import { Document } from '../abstract/document'
import { Actor } from './actor'

export interface TokenAttribute {
  document: Document
}

export declare class Token implements TokenAttribute {
  document: Document

  get actor(): Actor

  texture: {
    src: string
  }
  name: string
}
