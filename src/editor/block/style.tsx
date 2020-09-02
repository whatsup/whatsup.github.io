import React from 'react'
import { Fraction } from '@fract/core'
import styled from 'styled-components'

interface Params {
    key: string
    Width: Fraction<string>
    Height: Fraction<string>
    Border: Fraction<string>
    BorderRadius: Fraction<string>
    Background: Fraction<string>
}

export async function* Style({ key, Width, Height, Border, BorderRadius, Background }: Params) {
    while (true) {
        yield (
            <_Container key={key}>
                {yield* propertyEditor('Width', Width)}
                {yield* propertyEditor('Height', Height)}
                {yield* propertyEditor('Border', Border)}
                {yield* propertyEditor('BorderRadius', BorderRadius)}
                {yield* propertyEditor('Background', Background)}
            </_Container>
        )
    }
}

async function* propertyEditor(name: string, Property: Fraction<string>) {
    const value = yield* Property
    const changeHandler = (e: React.ChangeEvent<HTMLInputElement>) => Property.use(e.target.value)

    return (
        <_Property>
            <_Name>{name}</_Name>
            <_Input defaultValue={value} onChange={changeHandler} />
        </_Property>
    )
}

const _Container = styled.div``

const _Property = styled.div`
    display: flex;
    align-items: center;
    height: 36px;
    color: #90a4ae;
    font-size: 12px;
    padding: 12px;
`

const _Name = styled.div`
    flex: 1;
`

const _Input = styled.input.attrs({ type: 'text' })`
    height: 24px;
    margin: 0;
    border: none;
    outline: none;
    font-family: inherit;
    font-weight: inherit;
    -webkit-font-smoothing: antialiased;
    background-color: #212e33;
    border-radius: 3px;
    font-size: 12px;
    color: #eceff1;
    padding: 0 10px;
`
