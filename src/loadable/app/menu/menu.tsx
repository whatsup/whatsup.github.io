import styles from './menu.scss'
import { fractal, tmp, list } from '@fract/core'
import { API } from '../../factors'
// import ContactsIcon from './icons/contacts.svg'
// import CardsIcon from './icons/cards.svg'
// import TrendsIcon from './icons/trends.svg'
// import TagsIcon from './icons/tags.svg'
// import SettingsIcon from './icons/settings.svg'
// import FilesIcon from './icons/files.svg'
import { Loader } from '../../loader'

const Icons = [ContactsIcon, CardsIcon, TrendsIcon, TagsIcon, SettingsIcon, FilesIcon]

export const Menu = fractal(async function* _Menu(ctx) {
    yield tmp(<MenuLoader />)

    const api = ctx.get(API)!
    const Items = list((await api.loadMenuIds()).map((id) => newMenuItem(id)))

    while (true) {
        yield <Container>{yield* Items}</Container>
    }
})

function newMenuItem(id: number) {
    return fractal(async function* _MenuItem(ctx) {
        yield tmp(<MenuItemLoader key={id} />)

        const api = ctx.get(API)!
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

type Props = { children: string | JSX.Element | JSX.Element[] }

function MenuItemIconLoader() {
    return <Loader w={26} h={26} r="50%" className={styles.menuItemIconLoader} />
}

function Container(props: Props) {
    return <div className={styles.container}>{props.children}</div>
}

function MenuItem(props: Props) {
    return <div className={styles.menuItem}>{props.children}</div>
}

function MenuItemIcon(props: Props) {
    return <div className={styles.menuItemIcon}>{props.children}</div>
}

function MenuItemName(props: Props) {
    return <div className={styles.menuItemName}>{props.children}</div>
}

function ContactsIcon() {
    return (
        <svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">
            <path d="M6 0v32h24v-32h-24zM18 8.010c2.203 0 3.99 1.786 3.99 3.99s-1.786 3.99-3.99 3.99-3.99-1.786-3.99-3.99 1.786-3.99 3.99-3.99v0zM24 24h-12v-2c0-2.209 1.791-4 4-4v0h4c2.209 0 4 1.791 4 4v2z"></path>
            <path d="M2 2h3v6h-3v-6z"></path>
            <path d="M2 10h3v6h-3v-6z"></path>
            <path d="M2 18h3v6h-3v-6z"></path>
            <path d="M2 26h3v6h-3v-6z"></path>
        </svg>
    )
}

function CardsIcon() {
    return (
        <svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">
            <path d="M29 4h-26c-1.65 0-3 1.35-3 3v18c0 1.65 1.35 3 3 3h26c1.65 0 3-1.35 3-3v-18c0-1.65-1.35-3-3-3zM3 6h26c0.542 0 1 0.458 1 1v3h-28v-3c0-0.542 0.458-1 1-1zM29 26h-26c-0.542 0-1-0.458-1-1v-9h28v9c0 0.542-0.458 1-1 1zM4 20h2v4h-2zM8 20h2v4h-2zM12 20h2v4h-2z"></path>
        </svg>
    )
}

function TrendsIcon() {
    return (
        <svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">
            <path d="M4 28h28v4h-32v-32h4zM9 26c-1.657 0-3-1.343-3-3s1.343-3 3-3c0.088 0 0.176 0.005 0.262 0.012l3.225-5.375c-0.307-0.471-0.487-1.033-0.487-1.638 0-1.657 1.343-3 3-3s3 1.343 3 3c0 0.604-0.179 1.167-0.487 1.638l3.225 5.375c0.086-0.007 0.174-0.012 0.262-0.012 0.067 0 0.133 0.003 0.198 0.007l5.324-9.316c-0.329-0.482-0.522-1.064-0.522-1.691 0-1.657 1.343-3 3-3s3 1.343 3 3c0 1.657-1.343 3-3 3-0.067 0-0.133-0.003-0.198-0.007l-5.324 9.316c0.329 0.481 0.522 1.064 0.522 1.691 0 1.657-1.343 3-3 3s-3-1.343-3-3c0-0.604 0.179-1.167 0.487-1.638l-3.225-5.375c-0.086 0.007-0.174 0.012-0.262 0.012s-0.176-0.005-0.262-0.012l-3.225 5.375c0.307 0.471 0.487 1.033 0.487 1.637 0 1.657-1.343 3-3 3z"></path>
        </svg>
    )
}

function TagsIcon() {
    return (
        <svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">
            <path d="M30.5 0h-12c-0.825 0-1.977 0.477-2.561 1.061l-14.879 14.879c-0.583 0.583-0.583 1.538 0 2.121l12.879 12.879c0.583 0.583 1.538 0.583 2.121 0l14.879-14.879c0.583-0.583 1.061-1.736 1.061-2.561v-12c0-0.825-0.675-1.5-1.5-1.5zM23 12c-1.657 0-3-1.343-3-3s1.343-3 3-3 3 1.343 3 3-1.343 3-3 3z"></path>
        </svg>
    )
}

function SettingsIcon() {
    return (
        <svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">
            <path d="M29.181 19.070c-1.679-2.908-0.669-6.634 2.255-8.328l-3.145-5.447c-0.898 0.527-1.943 0.829-3.058 0.829-3.361 0-6.085-2.742-6.085-6.125h-6.289c0.008 1.044-0.252 2.103-0.811 3.070-1.679 2.908-5.411 3.897-8.339 2.211l-3.144 5.447c0.905 0.515 1.689 1.268 2.246 2.234 1.676 2.903 0.672 6.623-2.241 8.319l3.145 5.447c0.895-0.522 1.935-0.82 3.044-0.82 3.35 0 6.067 2.725 6.084 6.092h6.289c-0.003-1.034 0.259-2.080 0.811-3.038 1.676-2.903 5.399-3.894 8.325-2.219l3.145-5.447c-0.899-0.515-1.678-1.266-2.232-2.226zM16 22.479c-3.578 0-6.479-2.901-6.479-6.479s2.901-6.479 6.479-6.479c3.578 0 6.479 2.901 6.479 6.479s-2.901 6.479-6.479 6.479z"></path>
        </svg>
    )
}

function FilesIcon() {
    return (
        <svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">
            <path d="M26 30l6-16h-26l-6 16zM4 12l-4 18v-26h9l4 4h13v4z"></path>
        </svg>
    )
}
