import React from 'react'
import styled from 'styled-components'
import { fractal } from '@fract/core'
import { Api } from './api'
import { API } from './factors'

export const App = fractal(async function* _Loadable() {
    const [{ Menu }, { Groups }, { Friends }] = await Promise.all([
        import('./menu'),
        import('./groups'),
        import('./friends'),
    ])

    yield* API(new Api())

    while (true) {
        yield (
            <Container>
                <Logo>Loadable</Logo>
                {yield* Menu}
                <Title>Fractal sets</Title>
                {yield* Groups}
                {yield* Friends}
            </Container>
        )
    }
})

const Container = styled.section`
    width: 100%;
    min-height: 100vh;
    display: grid;
    grid-template-columns: 1fr minmax(min-content, 230px) minmax(min-content, 660px) minmax(min-content, 230px) 1fr;
    grid-template-rows: 90px 50px 1fr;
    grid-column-gap: 30px;
`

const Logo = styled.div`
    color: #039be5;
    font-weight: 300;
    font-size: 34px;
    grid-column: 2/3;
    grid-row: 1/2;
    display: flex;
    align-items: center;
    padding-left: 40px;
`

const Title = styled.div`
    font-size: 23px;
    font-weight: 500;
    color: #363636;
    grid-column: 3/4;
    grid-row: 2/3;
`
