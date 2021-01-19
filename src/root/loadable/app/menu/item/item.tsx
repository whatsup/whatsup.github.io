import styles from './ITEM.scss'
import { Fractal, Context } from 'whatsup'
import { Loader } from 'loadable/loader'
import { Api } from 'loadable/api'
import { Icons } from './icons'
import { WhatsJSX } from '@whatsup/jsx'

export class Item extends Fractal<JSX.Element> {
    constructor(readonly id: number) {
        super()
    }

    *whatsUp(ctx: Context) {
        const { id } = this
        const Icon = Icons[id]
        const deferredItem = ctx.defer(() => Api.loadMenuItem(id))

        yield <ItemLoader key={id} />

        const { name } = deferredItem.value!

        while (true) {
            yield (
                <Container key={id}>
                    <IconWrapper>
                        <Icon />
                    </IconWrapper>
                    <Name>{name!}</Name>
                </Container>
            )
        }
    }
}

export function ItemLoader() {
    return (
        <Container>
            <IconWrapper>
                <IconLoader />
            </IconWrapper>
            <Name>
                <Loader h={16} w="50%" />
            </Name>
        </Container>
    )
}

function IconLoader() {
    return <Loader w={26} h={26} r="50%" className={styles.iconLoader} />
}

function Container({ children }: WhatsJSX.Attributes) {
    return <div className={styles.container}>{children}</div>
}

function IconWrapper({ children }: WhatsJSX.Attributes) {
    return <div className={styles.icon}>{children}</div>
}

function Name({ children }: WhatsJSX.Attributes) {
    return <div className={styles.name}>{children}</div>
}
