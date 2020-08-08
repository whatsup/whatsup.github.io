import React from 'react'
import styled from 'styled-components'
import { fractal, tmp } from '@fract/core'
import { API } from './factors'
import { flatten } from './utils'
import { Loader } from './loader'

export const Friends = fractal(async function* _Groups() {
    yield tmp(<FriendsLoader />)

    const api = yield* API
    const FriendList = (await api.loadFriendIds()).map((id) => newFriend(id))

    while (true) {
        yield (
            <Container>
                <FriendsTitle>My friends</FriendsTitle>
                {yield* flatten(FriendList)}
            </Container>
        )
    }
})

function newFriend(id: number) {
    return fractal(async function* _Friend() {
        yield tmp(<FriendLoader key={id} />)

        const api = yield* API
        const { name, job, avatar } = await api.loadFriend(id)

        while (true) {
            yield (
                <Friend key={id}>
                    <FriendAvatar src={avatar} />
                    <FriendName>{name}</FriendName>
                    <FriendJob>{job}</FriendJob>
                </Friend>
            )
        }
    })
}

function FriendsLoader() {
    return (
        <Container>
            <FriendsTitle>
                <Loader h={28} />
            </FriendsTitle>
            <FriendLoader />
            <FriendLoader />
            <FriendLoader />
            <FriendLoader />
            <FriendLoader />
            <FriendLoader />
        </Container>
    )
}

function FriendLoader() {
    return (
        <Friend>
            <FriendAvatarLoader />
            <FriendName>
                <Loader h={16} />
            </FriendName>
            <FriendJob>
                <Loader h={10} w="40%" />
            </FriendJob>
        </Friend>
    )
}

const Container = styled.div`
    padding-left: 40px;
    grid-column: 4/5;
    grid-row: 3/4;
`
const FriendsTitle = styled.div`
    font-size: 23px;
    font-weight: 500;
    color: #363636;
`
const Friend = styled.div`
    display: grid;
    grid-template-columns: 50px 1fr;
    grid-template-rows: 25px 25px;
    grid-column-gap: 20px;
    margin-top: 30px;
`
const FriendAvatar = styled.img.attrs({ alt: '' })`
    width: 100%;
    grid-column: 1/2;
    grid-row: 1/3;
    border-radius: 50%;
`
const FriendAvatarLoader = styled(Loader)`
    width: auto;
    height: auto;
    grid-column: 1/2;
    grid-row: 1/3;
    background-color: #a5a5a5;
    border-radius: 50%;
`
const FriendName = styled.div`
    grid-column: 2/3;
    grid-row: 1/2;
    font-weight: 500;
    padding-top: 7px;
`
const FriendJob = styled.div`
    grid-column: 2/3;
    grid-row: 2/3;
    font-size: 12px;
    padding-top: 4px;
`
