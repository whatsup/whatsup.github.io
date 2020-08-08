import React from 'react'
import styled from 'styled-components'
import { fractal, tmp } from '@fract/core'
import { API } from './factors'
import { flatten } from './utils'
import ContactsIcon from './icons/contacts.svg'
import CardsIcon from './icons/cards.svg'
import TrendsIcon from './icons/trends.svg'
import TagsIcon from './icons/tags.svg'
import SettingsIcon from './icons/settings.svg'
import FilesIcon from './icons/files.svg'
import { Loader } from './loader'

const Icons = [ContactsIcon, CardsIcon, TrendsIcon, TagsIcon, SettingsIcon, FilesIcon]

export const Menu = fractal(async function* _Menu() {
    yield tmp(<MenuLoader />)

    const api = yield* API
    const Items = (await api.loadMenuIds()).map((id) => newMenuItem(id))

    while (true) {
        yield <Container>{yield* flatten(Items)}</Container>
    }
})

function newMenuItem(id: number) {
    return fractal(async function* _MenuItem() {
        yield tmp(<MenuItemLoader key={id} />)

        const api = yield* API
        const { name } = await api.loadMenuItem(id)
        const Icon = Icons[id]

        while (true) {
            yield (
                <MenuItem key={id}>
                    <MenuItemIcon>
                        <Icon />
                    </MenuItemIcon>
                    <MenuItemName>{name}</MenuItemName>
                </MenuItem>
            )
        }
    })
}

function MenuLoader() {
    return (
        <Container>
            <MenuItemLoader />
            <MenuItemLoader />
            <MenuItemLoader />
            <MenuItemLoader />
            <MenuItemLoader />
            <MenuItemLoader />
        </Container>
    )
}

function MenuItemLoader() {
    return (
        <MenuItem>
            <MenuItemIcon>
                <MenuItemIconLoader />
            </MenuItemIcon>
            <MenuItemName>
                <Loader h={16} w="50%" />
            </MenuItemName>
        </MenuItem>
    )
}

const MenuItemIconLoader = styled(Loader)`
    width: 26px;
    height: 26px;
    margin: -3px;
    background-color: #a5a5a5;
    border-radius: 50%;
`

const Container = styled.div`
    font-weight: 300;
    grid-column: 2/3;
    grid-row: 3/4;
    padding-left: 40px;
`

const MenuItem = styled.div`
    display: flex;
    align-items: center;
    height: 20px;
    margin-bottom: 30px;
`

const MenuItemIcon = styled.div`
    width: 20px;
    height: 20px;
    fill: #b0bec5;
`

const MenuItemName = styled.div`
    margin-left: 25px;
    color: #363636;
    font-weight: 300;
    font-size: 16px;
    flex: 1;
`
