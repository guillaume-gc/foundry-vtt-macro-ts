import { Collection } from '../utils/collection'
import { Application } from './application'

export declare class DocumentCollection<T> extends Collection<T> {
  constructor(data?: T[])

  apps: Application[]
}
