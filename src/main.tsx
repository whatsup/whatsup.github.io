import React from 'react'
import styled from 'styled-components'
import { fractal } from '@fract/core'
import { Pathname, redirect } from '@fract/browser-pathname'

enum Route {
    Todos = '/todos',
    Antistress = '/antistress',
    Loadable = '/loadable',
    Factors = '/factors',
}

export const Main = fractal(async function* _Main() {
    const [{ Todos }, { Antistress }, { Loadable }, { Factors }] = await Promise.all([
        import('./todos'),
        import('./antistress'),
        import('./loadable'),
        import('./factors'),
    ])

    while (true) {
        switch (yield* Pathname) {
            case Route.Todos:
                yield Todos
                continue
            case Route.Antistress:
                yield Antistress
                continue
            case Route.Loadable:
                yield Loadable
                continue
            case Route.Factors:
                yield Factors
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
