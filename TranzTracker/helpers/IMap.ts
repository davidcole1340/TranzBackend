import { Value } from "react-native-reanimated"

interface Items<T> {
  [key: string]: T
}

export default class IMap<Value> {
  items: Items<Value> = [] as any
  keyResolver: (item: Value) => string

  constructor(keyResolver: (item: Value) => string) {
    this.keyResolver = keyResolver
  }

  push(...items: Value[]): void {
    items.forEach(item => {
      this.items[this.keyResolver(item)] = item
    })
  }

  has(item: Value): boolean {
    return this.items[this.keyResolver(item)] !== undefined
  }

  get(index: string): Value|undefined {
    return this.items[index]
  }
}