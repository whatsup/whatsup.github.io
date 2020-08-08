import React from 'react'
import styled from 'styled-components'
import { fractal } from '@fract/core'
import { MODE, Mode } from './factors'

export const App = fractal(async function* _App() {
    const { newUser } = await import('./user')
    const User = newUser()

    const Json = fractal(async function* _Json() {
        yield* MODE(Mode.Json)
        return User
    })

    const View = fractal(async function* _View() {
        yield* MODE(Mode.View)
        return User
    })

    const Edit = fractal(async function* _Edit() {
        yield* MODE(Mode.Edit)
        return User
    })

    while (true) {
        yield (
            <Container>
                <Title>Factors of work</Title>
                <Flex>
                    <Box>
                        <SubTitle>User as Edit</SubTitle>
                        {yield* Edit}
                    </Box>
                    <Box>
                        <SubTitle>User as View</SubTitle>
                        {yield* View}
                    </Box>
                    <Box>
                        <SubTitle>User as Json</SubTitle>
                        {yield* Json}
                    </Box>
                </Flex>
            </Container>
        )
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

const SubTitle = styled.div`
    font-size: 16px;
    font-weight: 400;
    margin-bottom: 20px;
    color: #42a5f5;
`

const Box = styled.div`
    min-height: 150px;
    min-width: 200px;

    @media screen and (orientation: landscape) {
        :not(:first-child) {
            margin-left: 70px;
        }
    }

    @media screen and (orientation: portrait) {
        min-width: 250px;
    }
`
