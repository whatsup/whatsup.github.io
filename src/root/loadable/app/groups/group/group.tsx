import styles from './group.scss'
import { Fractal, Context } from 'whatsup'
import { Loader } from 'loadable/loader'
import { Api } from 'loadable/api'
import { WhatsJSX } from '@whatsup/jsx'

export class Group extends Fractal<JSX.Element> {
    constructor(readonly id: number) {
        super()
    }

    *whatsUp(ctx: Context) {
        const { id } = this
        const deferredGroup = ctx.defer(() => Api.loadGroup(id))

        yield <GroupLoader key={id} />

        const { name, image } = deferredGroup.value!

        while (true) {
            yield (
                <Container key={id}>
                    <GroupImg src={image} />
                    <GroupName>{name}</GroupName>
                </Container>
            )
        }
    }
}

export function GroupLoader() {
    return (
        <Container>
            <GroupImgLoader />
            <GroupName>
                <Loader />
            </GroupName>
        </Container>
    )
}

function Container({ children }: WhatsJSX.Attributes) {
    return <div className={styles.group}>{children}</div>
}

export type GroupImgProps = WhatsJSX.Attributes & { src: string }

function GroupImg({ src }: GroupImgProps) {
    return <img className={styles.img} src={src} />
}

function GroupImgLoader() {
    return <Loader className={styles.imgLoader} w="auto" h="auto" />
}

function GroupName({ children }: WhatsJSX.Attributes) {
    return <div className={styles.name}>{children}</div>
}
