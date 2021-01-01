import { mutator, Mutator } from 'whatsup'

export function element<T extends HTMLElement>(tag: string) {
    return document.createElement(tag) as T
}

export function div<T extends HTMLDivElement>(prev?: T): T {
    if (!prev) {
        return element<T>('div')
    }
    return prev
}

export function span<T extends HTMLDivElement>(prev?: T): T {
    if (!prev) {
        return element<T>('div')
    }
    return prev
}

export function component<T extends HTMLElement>(...mutators: any[]) {
    return function (prev?: T) {
        let input = prev

        for (const mutator of mutators) {
            input = mutator(input)
        }

        return input!
    }
}

export function style<T extends HTMLElement>(...mutators: any[]) {
    return function (prev: T) {
        let input = prev.style

        for (const mutator of mutators) {
            input = mutator(input)
        }

        return prev
    }
}

export function propertyMutator<T extends HTMLElement>(prop: keyof T, value: T[keyof T]) {
    return function (prev: T) {
        prev[prop] = value
        return prev
    }
}

export function eventMutator<T extends HTMLElement>(event: string, cb: (e: any) => void) {
    return function (prev: T) {
        prev.addEventListener(event, cb)
        return prev
    }
}

export function onClick(cb: (e: any) => void) {
    return eventMutator('click', cb)
}

export function stylePropertyMutator<T extends CSSStyleDeclaration>(prop: keyof T, value: T[keyof T]) {
    return function (prev: T) {
        if (prev[prop] !== value) {
            prev[prop] = value
        }
        return prev
    }
}

export function width(value: string) {
    return stylePropertyMutator('width', value)
}

export function height(value: string) {
    return stylePropertyMutator('height', value)
}

export function color(value: string) {
    return stylePropertyMutator('color', value)
}

export function display(value: string) {
    return stylePropertyMutator('display', value)
}

export function backgroundColor(value: string) {
    return stylePropertyMutator('backgroundColor', value)
}

export function cursor(value: string) {
    return stylePropertyMutator('cursor', value)
}

export const HTMLPixelRatio = 5

export function HTMLPixel({ color, evClick }: { color: string; evClick: (e: any) => void }) {
    const size = HTMLPixelRatio + 'px'
    return mutator(
        component(
            div,
            style(display('inline-block'), width(size), height(size), cursor('pointer'), backgroundColor(color)),
            onClick(evClick)
        )
    )
}

// const d = mutator(
//     component(
//         div,
//         style(display('inlineBlock'), width('20px'), height('30px'), color('red'), backgroundColor('green')),
//         onClick(() => console.log('click'))
//     )
// )

// console.log(d, d.mutate())
