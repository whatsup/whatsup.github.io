import styles from './menu.scss'
import { tmp, list, Fractal, List } from '@fract/core'
import { Api } from 'loadable/api'
import { Item, ItemLoader } from './item'
import { FractalJSX } from '@fract/jsx'

export class Menu extends Fractal<JSX.Element> {
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

function Container({ children }: FractalJSX.Attributes) {
    return <div className={styles.container}>{children}</div>
}
