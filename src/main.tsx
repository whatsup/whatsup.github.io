import React from 'react'
import styled, { keyframes } from 'styled-components'
import { fractal, tmp } from '@fract/core'
import { Pathname, redirect } from '@fract/browser-pathname'

enum Route {
    Todos = '/todos',
    Antistress = '/antistress',
    Loadable = '/loadable',
    Factors = '/factors',
    Editor = '/editor',
}

export const Main = fractal(async function* _Main() {
    while (true) {
        yield tmp(<Loading />)

        switch (yield* Pathname) {
            case Route.Todos:
                const { Todos } = await import('./todos')
                yield Todos
                continue
            case Route.Antistress:
                const { Antistress } = await import('./antistress')
                yield Antistress
                continue
            case Route.Loadable:
                const { Loadable } = await import('./loadable')
                yield Loadable
                continue
            case Route.Factors:
                const { Factors } = await import('./factors')
                yield Factors
                continue
            case Route.Editor:
                const { Editor } = await import('./editor')
                yield Editor
                continue
            default:
                yield (
                    <Container>
                        <Title>Fractal examples</Title>
                        <Flex>
                            <TodosBtn onClick={() => redirect(Route.Todos)}>Todos</TodosBtn>
                            <AntistressBtn onClick={() => redirect(Route.Antistress)}>Antistress</AntistressBtn>
                            <LoadableBtn onClick={() => redirect(Route.Loadable)}>Loadable</LoadableBtn>
                            <FactorsBtn onClick={() => redirect(Route.Factors)}>Factors</FactorsBtn>
                        </Flex>
                    </Container>
                )
                continue
        }
    }
})

function Loading() {
    return (
        <Loader>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
        </Loader>
    )
}

const Container = styled.section`
    width: 100%;
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 30px 0;
`

const Title = styled.header`
    font-size: 60px;
    margin-bottom: 40px;
    color: #29b6f6;

    @media screen and (orientation: portrait) {
        font-size: 40px;
    }
`

const Flex = styled.div`
    display: flex;

    @media screen and (orientation: portrait) {
        flex-direction: column;
    }
    @media screen and (orientation: landscape) {
        padding-bottom: 100px;
    }
`

const Btn = styled.button`
    width: 200px;
    height: 200px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 20px;
    border: 0;
    outline: none;
    border-radius: 20px;
    box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.2), 0 25px 50px 0 rgba(0, 0, 0, 0.1);
    color: white;
    font-family: inherit;
    font-size: 30px;
    font-weight: 300;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;

    @media screen and (orientation: portrait) {
        width: 250px;
        height: 150px;
    }
`

const TodosBtn = styled(Btn)`
    background-color: #1e88e5;
`

const AntistressBtn = styled(Btn)`
    background-color: #f44336;
`

const LoadableBtn = styled(Btn)`
    background-color: #4caf50;
`

const FactorsBtn = styled(Btn)`
    background-color: #ff9800;
`

const loaderAnim1 = keyframes`
    0% {
      transform: scale(0);
    }
    100% {
      transform: scale(1);
    }
`

const loaderAnim2 = keyframes`
    0% {
      transform: translate(0, 0);
    }
    100% {
      transform: translate(24px, 0);
    }
`

const loaderAnim3 = keyframes`
    0% {
      transform: scale(1);
    }
    100% {
      transform: scale(0);
    }
`

const Loader = styled.div`
    display: inline-block;
    position: absolute;
    left: 50%;
    top: 50%;
    width: 80px;
    height: 80px;
    margin-left: -40px;
    margin-top: -40px;

    div {
        position: absolute;
        top: 33px;
        width: 13px;
        height: 13px;
        border-radius: 50%;
        background: #29b6f6;
        animation-timing-function: cubic-bezier(0, 1, 1, 0);

        :nth-child(1) {
            left: 8px;
            animation: ${loaderAnim1} 0.6s infinite;
        }
        :nth-child(2) {
            left: 8px;
            animation: ${loaderAnim2} 0.6s infinite;
        }
        :nth-child(3) {
            left: 32px;
            animation: ${loaderAnim2} 0.6s infinite;
        }
        :nth-child(4) {
            left: 56px;
            animation: ${loaderAnim3} 0.6s infinite;
        }
    }
`
