import React from 'react'
import { Fraction } from '@fract/core'
import styled from 'styled-components'

interface Params {
    key: string
    Name: Fraction<string>
    TagName: Fraction<string>
}

export async function* NameAndTag({ key, Name, TagName }: Params) {
    while (true) {
        yield (
            <_Container key={key}>
                {yield* propertyEditor('Name', Name)}
                {yield* propertyTagEditor('TagName', TagName)}
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

async function* propertyTagEditor(name: string, Property: Fraction<string>) {
    const value = yield* Property
    const changeHandler = (e: React.ChangeEvent<HTMLSelectElement>) => Property.use(e.target.value)

    return (
        <_Property>
            <_Name>{name}</_Name>
            <_Select defaultValue={value} onChange={changeHandler}>
                {tagNamesList.map((tagName) => (
                    <option key={tagName} value={tagName}>
                        {tagName}
                    </option>
                ))}
            </_Select>
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

const _Select = styled.select`
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

const tagNamesList = [
    'a',
    'aside',
    'b',
    'button',
    'div',
    'footer',
    'form',
    'h1',
    'h2',
    'h3',
    'h4',
    'h5',
    'h6',
    'header',
    'img',
    'input',
    'main',
    'nav',
    'ol',
    'option',
    'p',
    'section',
    'select',
    'span',
    'textarea',
    'ul',
]
