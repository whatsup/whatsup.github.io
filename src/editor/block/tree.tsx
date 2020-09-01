import React from 'react'
import styled, { css } from 'styled-components'
import { Fraction, factor, exec, fraction, fractal } from '@fract/core'
import { EDITABLE, CHANGE_EDITABLE } from '../factors'
import { Block } from './block'
import { flatten } from '../utils'
import _CreateIcon from './icons/create.svg'
import _CreateSiblingIcon from './icons/create_sibling.svg'
import _RemoveIcon from './icons/remove.svg'
import _ArrowIcon from './icons/arrow.svg'

const ADD_SIBLING = factor<(After: Block) => void>()
const REMOVE = factor<(Target: Block) => void>()

interface Params {
    key: string
    Self: Block
    TagName: Fraction<string>
    Children: Fraction<Block[]>
}

export async function* Tree({ key, Self, TagName, Children }: Params) {
    const { newBlock } = await import('./block')
    const addSiblingFactor = yield* ADD_SIBLING
    const removeFactor = yield* REMOVE
    const changeEditableFactor = yield* CHANGE_EDITABLE
    const isRoot = !addSiblingFactor && !removeFactor
    const Collapsed = fraction(!isRoot)

    const IsEditable = fractal(async function* _Focused() {
        while (true) {
            yield (yield* yield* EDITABLE).Target === Self
        }
    })

    yield* ADD_SIBLING((After: Block) => {
        exec(async function* () {
            const children = yield* Children
            const index = children.indexOf(After)
            const begin = children.slice(0, index + 1)
            const tail = children.slice(index + 1)
            const Child = newBlock()
            Children.use([...begin, Child, ...tail])
        })
    })

    yield* REMOVE((Target: Block) => {
        exec(async function* () {
            const children = yield* Children
            Children.use(children.filter((Child) => Child !== Target))
        })
    })

    const add = (e: React.MouseEvent) => {
        e.stopPropagation()
        exec(async function* () {
            const children = yield* Children
            const Child = newBlock()
            Children.use(children.concat(Child))
            Collapsed.use(false)
        })
    }

    const addSibling = (e: React.MouseEvent) => {
        e.stopPropagation()
        addSiblingFactor(Self)
    }

    const remove = (e: React.MouseEvent) => {
        e.stopPropagation()
        removeFactor(Self)
    }

    const toggleCollapsed = (e: React.MouseEvent) => {
        exec(async function* () {
            e.stopPropagation()
            Collapsed.use(!(yield* Collapsed))
        })
    }

    const changeEditable = () => {
        changeEditableFactor(Self)
    }

    while (true) {
        const isEditable = yield* IsEditable
        const tagName = yield* TagName
        const collapsed = yield* Collapsed
        const children = yield* flatten(Children)

        yield (
            <_Tree key={key}>
                <_Block onClick={changeEditable} editable={isEditable}>
                    <_Collapser onClick={toggleCollapsed} collapsed={collapsed} visible={!!children.length}>
                        <_ArrowIcon />
                    </_Collapser>
                    <_Tag>{tagName}</_Tag>
                    <_Button onClick={add} visible>
                        <_CreateIcon />
                    </_Button>
                    <_Button onClick={addSibling} visible={!!addSiblingFactor}>
                        <_CreateSiblingIcon />
                    </_Button>
                    <_Button onClick={remove} visible={!!removeFactor}>
                        <_RemoveIcon />
                    </_Button>
                </_Block>
                <_Children visible={!collapsed}>{children}</_Children>
            </_Tree>
        )
    }
}

const _Tree = styled.div``
const _Block = styled.div<{ editable: boolean }>`
    height: 24px;
    display: flex;
    align-items: center;
    padding-left: 18px;
    user-select: none;
    cursor: pointer;
    margin-bottom: 1px;
    background-clip: content-box;
    background-color: ${(p) => (p.editable ? '#37474f' : 'unset')};

    :hover {
        background-color: #37474f;
        ${() => _Button} {
            opacity: 1;
            transition: opacity 0.3s 0.1s ease;
        }
    }
`
const _Collapser = styled.div<{ collapsed: boolean; visible: boolean }>`
    flex: 0 0 16px;
    height: 16px;
    fill: #90a4ae;
    margin-left: -18px;
    opacity: ${(p) => (p.visible ? 1 : 0)};

    ${(p) =>
        !p.collapsed &&
        css`
            transform: rotate(90deg);
        `};
`
const _Tag = styled.div`
    flex: 1;
    color: #eceff1;
    margin-left: 5px;
`
const _Button = styled.div<{ visible: boolean }>`
    flex: 0 0 24px;
    display: ${(p) => (p.visible ? 'flex' : 'none')};
    align-self: stretch;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    opacity: 0;
    fill: #90a4ae;

    :hover {
        fill: #eceff1;
        background-color: #324249;
    }

    > svg {
        width: 16px;
        height: 16px;
    }
`
const _Children = styled.div<{ visible: boolean }>`
    padding-left: 16px;
    display: ${(p) => (p.visible ? 'block' : 'none')};
`
