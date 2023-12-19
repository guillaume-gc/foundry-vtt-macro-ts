interface MapReplacementMembers<K, V> {
  set(key: K, value: V): this
}

type PatchedMap<K, V> = Omit<
  Map<K, V>,
  'forEach' | typeof Symbol.iterator | 'get' | 'set'
> &
  MapReplacementMembers<K, V>

interface PatchedMapConstructor {
  new (): PatchedMap<any, any>
  new <K, V>(entries?: readonly (readonly [K, V])[] | null): PatchedMap<K, V>
  new <K, V>(iterable: Iterable<readonly [K, V]>): PatchedMap<K, V>
  readonly [Symbol.species]: PatchedMapConstructor
  readonly prototype: PatchedMap<any, any>
}

declare const Map: PatchedMapConstructor

export declare class Collection<T> extends Map<string, T> {
  constructor(entries: T[])

  filter(
    condition: (
      element: T,
      index: number,
      collection: Collection<T>,
    ) => boolean,
  ): T[]

  find(
    condition: (
      element: T,
      index: number,
      collection: Collection<T>,
    ) => boolean,
  ): T

  forEach(fn: (element: T) => void): void

  get(key: string, options: { strict: boolean } | undefined): T

  getName(name: string, options: { strict: boolean } | undefined): T

  map(
    transformer: (value: T[], index: number, collection: Collection<T>) => any,
  ): T[]

  reduce(
    reducer: (
      accumulator: T,
      currentValue: T,
      index: number,
      collection: Collection<T>,
    ) => any,
    initial: T,
  ): T

  some(
    condition: (value: T, index: number, collection: Collection<T>) => boolean,
  ): boolean

  get contents(): T[]

  [Symbol.iterator](): IterableIterator<T>
}
