import React from 'react'
import styled from 'styled-components'
import { fractal, fraction } from '@fract/core'
import { BRANCH, Branch, EDITABLE, CHANGE_EDITABLE } from './factors'
import { STORE_KEY } from './const'
import { BlockData, Block } from './block'

const DEFAULT =
    '{"tag":"div","width":"auto","height":"auto","border":"none","borderRadius":"none","background":"unset","children":[{"tag":"div","width":"auto","height":"100px","border":"none","borderRadius":"none","background":"LightCyan","children":[]},{"tag":"div","width":"auto","height":"50px","border":"none","borderRadius":"40px","background":"LightGreen","children":[]},{"tag":"div","width":"auto","height":"400px","border":"none","borderRadius":"none","background":"Goldenrod","children":[{"tag":"div","width":"300px","height":"300px","border":"3px red solid","borderRadius":"50%","background":"MediumPurple","children":[]}]}]}'

export const Editor = fractal(async function* _HtmlEditor() {
    const { newBlock } = await import('./block')

    const data = JSON.parse(localStorage.getItem(STORE_KEY) || DEFAULT) as BlockData

    const Root = newBlock(data)
    const Editable = fraction({ Target: Root })

    yield* EDITABLE(Editable)
    yield* CHANGE_EDITABLE((Target: Block) => Editable.use({ Target }))

    const View = fractal(async function* _View() {
        yield* BRANCH(Branch.View)
        while (true) yield Root
    })

    const Style = fractal(async function* _Edit() {
        yield* BRANCH(Branch.Style)
        while (true) yield (yield* Editable).Target
    })

    const Tree = fractal(async function* _Edit() {
        yield* BRANCH(Branch.Tree)
        while (true) yield Root
    })

    yield* fractal(async function* _AutoSyncWithLocalStore() {
        yield* BRANCH(Branch.Data)

        while (true) {
            yield localStorage.setItem(STORE_KEY, JSON.stringify(yield* Root))
        }
    })

    while (true) {
        yield (
            <_Container>
                <_View>
                    <_ViewContent>{yield* View}</_ViewContent>{' '}
                </_View>
                <_Style>{yield* Style}</_Style>
                <_Tree>{yield* Tree}</_Tree>
            </_Container>
        )
    }
})

const _Container = styled.div`
    font: 14px 'SF Mono', Monaco, Menlo, Courier, monospace;
    display: grid;
    height: 100vh;
    background-color: #37474f;
    column-gap: 1px;
    row-gap: 1px;
    grid-template-columns: minmax(400px, 1fr) minmax(250px, 350px);
    grid-template-rows: 1fr 1fr;
    grid-template-areas:
        'view style'
        'view tree';
`
const _View = styled.div`
    grid-area: view;
    padding: 20px;
    background-color: #263238;
`
const _ViewContent = styled.div`
    overflow: scroll;
    width: 100%;
    height: 100%;
    --grad-color: #495962;
    background-image: linear-gradient(45deg, var(--grad-color) 25%, transparent 25%),
        linear-gradient(-45deg, var(--grad-color) 25%, transparent 25%),
        linear-gradient(45deg, transparent 75%, var(--grad-color) 75%),
        linear-gradient(-45deg, transparent 75%, var(--grad-color) 75%);
    background-size: 20px 20px;
    background-position: 0 0, 0 10px, 10px -10px, -10px 0px;
    background-color: #37474f;
`
const _Style = styled.div`
    grid-area: style;
    background-color: #263238;
    overflow: scroll;
`
const _Tree = styled.div`
    grid-area: tree;
    padding-left: 3px;
    padding-top: 2px;
    background-color: #263238;
    overflow: scroll;
`
