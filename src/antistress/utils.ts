export function memo<T>(initializer: () => T | Promise<T>) {
    let memoized = false
    let cache: T | Promise<T>
    return () => (memoized ? cache : ((memoized = true), (cache = initializer())))
}
