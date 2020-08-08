import React from 'react'
import styled from 'styled-components'
import { fractal, fraction } from '@fract/core'
import { STORE_KEY, IS_TOUCH, Color, Palette } from './const'
import { Handlers, TreeData } from './typings'
import { CURRENT_COLOR, MODE, Mode } from './factors'

export const App = fractal(async function* _Antistress() {
    const { newCircle } = await import('./circle')

    const data = JSON.parse(localStorage.getItem(STORE_KEY) || `"${Color.Default}"`) as TreeData
    const Circle = newCircle(data)
    const CurrentColor = fraction(Color.Default)

    yield* CURRENT_COLOR(CurrentColor)

    yield* fractal(async function* _AutoSyncWithLocalStore() {
        yield* MODE(Mode.Data)

        while (true) {
            yield localStorage.setItem(STORE_KEY, JSON.stringify(yield* Circle))
        }
    })

    const newColorSelectHandler = (color: Color): Handlers => ({
        [IS_TOUCH ? 'onTouchEnd' : 'onMouseUp']: () => CurrentColor.use(color),
    })

    while (true) {
        const currentColor = yield* CurrentColor

        yield (
            <Container>
                <Main>
                    <Title>antistress</Title>
                    <Canvas>{yield* Circle}</Canvas>
                    <Tools>
                        {Palette.map((color) => (
                            <ColorBtn
                                key={color}
                                color={color}
                                selected={color === currentColor}
                                {...newColorSelectHandler(color)}
                            />
                        ))}
                    </Tools>
                </Main>
                <Help>Click to fill, long click to split</Help>
            </Container>
        )
    }
})

const Container = styled.section`
    width: 100%;
    min-height: 100vh;
    display: flex;
    flex-direction: column;
`

const Main = styled.main`
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;

    @media screen and (orientation: portrait) {
        flex-direction: column;
    }
`

const Help = styled.div`
    font-size: 14px;
    font-weight: 300;
    color: #c0c0c0;
    text-align: center;
    padding: 10px 0;
`

const Title = styled.div`
    font-size: 12vmin;
    color: #29b6f6;
    user-select: none;
    flex: 1 0 0;
    font-weight: 100;

    @media screen and (orientation: portrait) {
        margin-top: 10px;
    }
    @media screen and (orientation: landscape) {
        writing-mode: vertical-lr;
        align-self: flex-end;
        margin: 20px 0;
    }
`

const Tools = styled.div`
    user-select: none;
    flex: 1 0 0;
    display: flex;

    @media screen and (orientation: portrait) {
        align-items: flex-end;
        padding-bottom: 20px;
    }
    @media screen and (orientation: landscape) {
        flex-direction: column;
        align-items: flex-end;
        padding-right: 20px;
    }
`

const Canvas = styled.div`
    width: 80vmin;
    height: 80vmin;
    position: relative;
`

const ColorBtn = styled.div<{ color: Color; selected: boolean }>`
    width: 8vmin;
    height: 8vmin;
    border-radius: 50%;
    background-color: ${(props) => props.color};
    box-shadow: ${(props) => (props.selected ? `inset 0 0 0px 3px ${props.color}, inset 0 0 0px 6px white;` : 'none')};
    margin: 1vmin;
    cursor: pointer;
`
