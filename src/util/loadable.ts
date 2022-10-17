type LoadableLike<TResult> =
  | { state: 'loading'; contents: Promise<TResult> }
  | { state: 'hasValue'; contents: TResult }
  | { state: 'hasError'; contents: any }

export const unwrapLoadableValue = <TResult>(loadable: LoadableLike<TResult>) =>
  loadable.state === 'hasValue' ? loadable.contents : undefined
