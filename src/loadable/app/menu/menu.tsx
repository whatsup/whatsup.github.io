import styles from './menu.scss'
import { tmp, list, Emitter, List } from '@fract/core'
import { Api } from 'loadable/api'
import { Item, ItemLoader } from './item'

export class Menu extends Emitter<JSX.Element> {
    list!: List<Item>

    async loadMenuItemList() {
        if (!this.list) {
            this.list = list((await Api.loadMenuIds()).map((id) => new Item(id)))
        }
    }

    async *collector() {
        yield tmp(<MenuLoader />)

        await this.loadMenuItemList()

        while (true) {
            yield <Container>{yield* this.list}</Container>
        }
    }
}

function MenuLoader() {
    return (
        <Container>
            <ItemLoader />
            <ItemLoader />
            <ItemLoader />
            <ItemLoader />
            <ItemLoader />
            <ItemLoader />
        </Container>
    )
}

type Props = { children: any }

function Container({ children }: Props) {
    return <div className={styles.container}>{children}</div>
}
