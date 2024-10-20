import { Document } from '../abstract/document'
import { Actor } from './actor'

export interface TokenAttribute {
  document: Document

  texture: {
    src: string
    offSetX: number
    offSetY: number
    rotation: number
    scaleX: number
    scaleY: number
    tintX: number | undefined
  }
  name: string
  x: number
  y: number
}

export declare class Token implements TokenAttribute {
  document: Document

  get actor(): Actor

  texture: {
    src: string
    offSetX: number
    offSetY: number
    rotation: number
    scaleX: number
    scaleY: number
    tintX: number | undefined
  }
  name: string
  x: number
  y: number
}
