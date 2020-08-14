import React from 'react'
import styled from 'styled-components'
import { fractal, tmp } from '@fract/core'
import { API } from './factors'
import { connect } from './utils'
import { Loader } from './loader'

export const Groups = fractal(async function* _Groups() {
    yield tmp(<GroupsLoader />)

    const api = yield* API
    const GroupList = (await api.loadGroupIds()).map((id) => newGroup(id))

    while (true) {
        yield <Container>{yield* connect(GroupList)}</Container>
    }
})

function newGroup(id: number) {
    return fractal(async function* _Group() {
        yield tmp(<GroupLoader key={id} />)

        const api = yield* API
        const { name, image } = await api.loadGroup(id)

        while (true) {
            yield (
                <Group key={id}>
                    <GroupImg src={image} />
                    <GroupName>{name}</GroupName>
                </Group>
            )
        }
    })
}

function GroupsLoader() {
    return (
        <Container>
            <GroupLoader />
            <GroupLoader />
            <GroupLoader />
            <GroupLoader />
            <GroupLoader />
            <GroupLoader />
        </Container>
    )
}

function GroupLoader() {
    return (
        <Group>
            <GroupImgLoader />
            <GroupName>
                <Loader />
            </GroupName>
        </Group>
    )
}

const Container = styled.div`
    grid-column: 3/4;
    grid-row: 3/4;
    display: grid;
    gap: 30px;
    grid-template-columns: repeat(auto-fill, 200px);
    grid-template-rows: repeat(auto-fill, 250px);
    grid-auto-columns: 200px;
    grid-auto-rows: 250px;
`

const Group = styled.div``

const GroupImg = styled.img.attrs({ alt: '' })`
    width: 100%;
    flex: 1;
    border-radius: 10px;
    box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.2), 0 25px 50px 0 rgba(0, 0, 0, 0.1);
`

const GroupImgLoader = styled(Loader)`
    width: auto;
    height: auto;
    flex: 1;
    padding-top: 100%;
    background-color: #a5a5a5;
    box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.2), 0 25px 50px 0 rgba(0, 0, 0, 0.1);
`

const GroupName = styled.div`
    flex: 0 0 50px;
    font-size: 16px;
    padding-top: 20px;
    font-weight: 400;
    color: #363636;
`
