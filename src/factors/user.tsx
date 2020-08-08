import React from 'react'
import styled from 'styled-components'
import { fraction, Fraction, fractal } from '@fract/core'
import { MODE, Mode } from './factors'

interface UserGuts {
    Name: Fraction<string>
    Age: Fraction<number>
}

export function newUser() {
    const Name = fraction('John')
    const Age = fraction(33)

    const guts: UserGuts = { Name, Age }

    return fractal<JSX.Element>(async function* _User(): AsyncGenerator<JSX.Element> {
        switch (yield* MODE) {
            case Mode.Json:
                yield* userAsJson(guts)
                break
            case Mode.View:
                yield* userAsView(guts)
                break
            case Mode.Edit:
                yield* userAsEdit(guts)
                break
        }
    })
}

async function* userAsJson({ Name, Age }: UserGuts): AsyncGenerator<JSX.Element> {
    while (true) {
        const data = {
            name: yield* Name,
            age: yield* Age,
        }

        yield <UserJson>{JSON.stringify(data, null, 4)}</UserJson>
    }
}

async function* userAsView({ Name, Age }: UserGuts): AsyncGenerator<JSX.Element> {
    while (true) {
        yield (
            <UserView>
                <Property>
                    <PropertyName>Name</PropertyName>
                    <PropertyValue>{yield* Name}</PropertyValue>
                </Property>
                <Property>
                    <PropertyName>Age</PropertyName>
                    <PropertyValue>{yield* Age}</PropertyValue>
                </Property>
            </UserView>
        )
    }
}

async function* userAsEdit({ Name, Age }: UserGuts): AsyncGenerator<JSX.Element> {
    const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => Name.use(e.target.value)
    const handleAgeChange = (e: React.ChangeEvent<HTMLInputElement>) => Age.use(parseInt(e.target.value) || 0)

    while (true) {
        yield (
            <UserEdit>
                <Property>
                    <PropertyName>Name</PropertyName>
                    <PropertyValue>
                        <NameInput onChange={handleNameChange} defaultValue={yield* Name} />
                    </PropertyValue>
                </Property>
                <Property>
                    <PropertyName>Age</PropertyName>
                    <PropertyValue>
                        <AgeInput onChange={handleAgeChange} defaultValue={yield* Age} />
                    </PropertyValue>
                </Property>
            </UserEdit>
        )
    }
}

const UserJson = styled.code`
    white-space: pre;
    font-weight: 400;
    font-family: monospace;
`

const UserView = styled.div`
    padding-top: 18px;
`

const Property = styled.div`
    display: flex;
    align-items: center;
    margin-bottom: 1px;
    min-height: 20px;
`

const PropertyName = styled.div`
    font-weight: 400;
    flex: 0 0 80px;
`

const PropertyValue = styled.div`
    flex: 0 0 80px;
    min-width: 80px;
`

const UserEdit = styled.div`
    padding-top: 18px;
`

const NameInput = styled.input.attrs({ type: 'text' })`
    font: inherit;
    width: 100%;
`
const AgeInput = styled.input.attrs({ type: 'text' })`
    font: inherit;
    width: 100%;
`
