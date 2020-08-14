import React from 'react'
import styled from 'styled-components'
import { fractal, fraction, exec, Fractal, Fraction } from '@fract/core'
import { IS_TOUCH, Color } from './const'
import { playSplitSound, playFillSound } from './sounds'
import { CURRENT_COLOR, MODE, Mode } from './factors'
import { Handlers } from './typings'

type Tree = Fraction<TreeData | Fractal<TreeData | JSX.Element>[]>

export type TreeData = Color | TreeData[]

export function newCircle(data: TreeData): Fractal<TreeData | JSX.Element> {
    const Tree: Tree = fraction(Array.isArray(data) ? data.map((c) => newCircle(c)) : data)

    return fractal<TreeData | JSX.Element>(async function* _Circle(): AsyncGenerator<TreeData | JSX.Element> {
        switch (yield* MODE) {
            case Mode.Data:
                yield* workInDataMode(Tree)
                break
            case Mode.Jsx:
                yield* workInJsxMode(Tree)
                break
        }
    })
}

async function* workInDataMode(Tree: Tree): AsyncGenerator<TreeData> {
    while (true) {
        const tree = yield* Tree

        if (Array.isArray(tree)) {
            const children = [] as TreeData[]

            for (const Child of tree) {
                children.push(yield* Child as Fractal<Color | TreeData[]>)
            }

            yield children
        } else {
            yield tree
        }
    }
}

async function* workInJsxMode(Tree: Tree): AsyncGenerator<JSX.Element> {
    const key = (~~(Math.random() * 1e8)).toString(16)
    const CurrentColor = yield* CURRENT_COLOR

    while (true) {
        const { color, children } = yield* convertTreeToColorAndChildren(Tree)

        let splitTimerId = 0

        const split = () => {
            splitTimerId = setTimeout(() => {
                Tree.use(children.length ? Color.Default : [newCircle(color), newCircle(color), newCircle(color)])
                playSplitSound()
                splitTimerId = 0
            }, 300)
        }
        const fill = () => {
            if (splitTimerId && !children.length) {
                exec(async function* () {
                    Tree.use(yield* CurrentColor)
                    playFillSound()
                })
            }
            clearTimeout(splitTimerId)
        }
        const handlers = createSplitFillHandlers(split, fill)

        yield (
            <Container key={key} color={color} {...handlers}>
                {children}
            </Container>
        )
    }
}

async function* convertTreeToColorAndChildren(
    Tree: Tree
): AsyncGenerator<any, { color: Color; children: JSX.Element[] }> {
    const tree = yield* Tree

    if (Array.isArray(tree)) {
        const children = [] as JSX.Element[]

        for (const Child of tree) {
            children.push(yield* Child as Fractal<JSX.Element>)
        }

        return { color: Color.None, children }
    }
    return { color: tree, children: [] as JSX.Element[] }
}

function createSplitFillHandlers(split: () => void, fill: () => void): Handlers {
    return {
        [IS_TOUCH ? 'onTouchStart' : 'onMouseDown'](e: React.MouseEvent | React.TouchEvent) {
            e.stopPropagation()
            split()
        },
        [IS_TOUCH ? 'onTouchEnd' : 'onMouseUp'](e: React.MouseEvent | React.TouchEvent) {
            e.stopPropagation()
            fill()
        },
    }
}

const Container = styled.div<{ color: Color }>`
    border-radius: 50%;
    background-color: ${(props) => props.color};
    width: 100%;
    height: 100%;
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    position: relative;
    cursor: pointer;
    top: 4%;

    > div {
        width: 46%;
        height: 46%;
        margin: 2%;

        :nth-child(1) {
            margin-left: 26%;
            margin-right: 26%;
            top: -3.85%;
        }
        :nth-child(2),
        :nth-child(3) {
            top: -10.55%;
        }
    }
`
