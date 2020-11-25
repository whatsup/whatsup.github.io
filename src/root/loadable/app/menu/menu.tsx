import styles from './menu.scss'
import { list, Fractal, List, Context } from '@fract/core'
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

    *stream(ctx: Context) {
        this.loadMenuItemList().then(() => ctx.update())

        yield <MenuLoader />

        while (true) {
            yield <Container>{yield* this.list.spread()}</Container>
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
