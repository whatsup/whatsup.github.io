import styles from './ITEM.scss'
import { tmp, Fractal } from '@fract/core'
import { Loader } from 'loadable/loader'
import { Api } from 'loadable/api'
import { Icons } from './icons'
import { FractalJSX } from '@fract/jsx'

export class Item extends Fractal<JSX.Element> {
    constructor(readonly id: number) {
        super()
    }

    async *collector() {
        const { id } = this

        yield tmp(<ItemLoader key={id} />)

        const { name } = await Api.loadMenuItem(id)
        const Icon = Icons[id]

        while (true) {
            yield (
                <Container key={id}>
                    <IconWrapper>
                        <Icon />
                    </IconWrapper>
                    <Name>{name}</Name>
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

function Container({ children }: FractalJSX.Attributes) {
    return <div className={styles.container}>{children}</div>
}

function IconWrapper({ children }: FractalJSX.Attributes) {
    return <div className={styles.icon}>{children}</div>
}

function Name({ children }: FractalJSX.Attributes) {
    return <div className={styles.name}>{children}</div>
}
