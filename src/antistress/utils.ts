export function memo<T>(initializer: () => NonNullable<T> | Promise<NonNullable<T>>) {
    let cache: NonNullable<T> | Promise<NonNullable<T>>
    return () => cache || (cache = initializer())
}
