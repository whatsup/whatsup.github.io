import React from 'react'
import styled, { css } from 'styled-components'
import { Fractal, fractal } from '@fract/core'
import { FilterMode } from './const'
import { FILTER, CHANGE_FILTER } from './factors'
import { CountersData } from './counters'

export function newFooter(Counters: Fractal<CountersData>, removeCompleted: () => any) {
    return fractal(async function* _Footer() {
        const AllFilter = newFilter('All', FilterMode.All)
        const ActiveFilter = newFilter('Active', FilterMode.Active)
        const CompletedFilter = newFilter('Completed', FilterMode.Completed)

        while (true) {
            const { active, completed } = yield* Counters

            yield (
                <Container>
                    <Flex>
                        <Left visible={!!active}>{active} items left</Left>
                        <Filters>
                            {yield* AllFilter}
                            {yield* ActiveFilter}
                            {yield* CompletedFilter}
                        </Filters>
                        <Clear onClick={removeCompleted} visible={!!completed}>
                            Clear completed
                        </Clear>
                    </Flex>
                    <Help>Double click to edit a todo</Help>
                </Container>
            )
        }
    })
}

function newFilter(name: string, mode: FilterMode) {
    return fractal(async function* _Filter() {
        while (true) {
            const filter = yield* yield* FILTER
            const change = yield* CHANGE_FILTER

            yield (
                <FilterBtn onClick={() => change(mode)} active={filter === mode}>
                    {name}
                </FilterBtn>
            )
        }
    })
}

const Container = styled.footer`
    user-select: none;
`

const Flex = styled.footer`
    min-height: 50px;
    padding: 10px;
    display: flex;
    align-items: center;

    @media (max-width: 500px) {
        flex-wrap: wrap;
    }
`

const Help = styled.div`
    font-size: 12px;
    font-weight: 300;
    color: #e0e0e0;
    text-align: center;
    padding: 5px 0;
`

const Left = styled.span<{ visible: boolean }>`
    flex: 1 0 100px;
    margin-top: 2px;
    visibility: ${(props) => (props.visible ? 'visible' : 'hidden')};
`

const Clear = styled.a<{ visible: boolean }>`
    flex: 1 0 100px;
    text-align: right;
    margin-top: 2px;
    visibility: ${(props) => (props.visible ? 'visible' : 'hidden')};
    transition: color 0.1s ease;

    :hover {
        color: #0288d1;
        cursor: pointer;
    }
`

const Filters = styled.ul`
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;

    @media (max-width: 500px) {
        order: 1;
        flex: 0 0 100%;
        margin-top: 10px;
    }
`

const FilterBtn = styled.li<{ active: boolean }>`
    cursor: pointer;
    font-size: 16px;
    padding: 2px 7px;
    border-radius: 3px;
    border-width: 1px;
    border-style: solid;
    transition: border-color 0.3s ease;

    :not(:last-child) {
        margin-right: 20px;
    }

    ${(props) =>
        props.active
            ? css`
                  border-color: #29b6f6;
              `
            : css`
                  border-color: transparent;
                  :hover {
                      border-color: #4fc3f7;
                  }
              `}
`
