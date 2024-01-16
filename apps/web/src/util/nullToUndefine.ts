type RecursivelyReplaceNullWithUndefined<T> = T extends null
  ? undefined
  : T extends Date
  ? T
  : {
      [K in keyof T]: T[K] extends Array<infer U>
        ? Array<RecursivelyReplaceNullWithUndefined<U>>
        : RecursivelyReplaceNullWithUndefined<T[K]>
    }

export const nullToUndefined = <T>(obj: T): RecursivelyReplaceNullWithUndefined<T> => {
  if (obj === null) {
    return undefined as any
  }

  // object check based on: https://stackoverflow.com/a/51458052/6489012
  if (obj?.constructor.name === 'Object') {
    for (const key in obj) {
      obj[key] = nullToUndefined(obj[key]) as any
    }
  }
  return obj as any
}
