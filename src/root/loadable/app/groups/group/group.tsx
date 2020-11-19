import styles from './group.scss'
import { Fractal, tmp } from '@fract/core'
import { Loader } from 'loadable/loader'
import { Api } from 'loadable/api'
import { FractalJSX } from '@fract/jsx'

export class Group extends Fractal<JSX.Element> {
    constructor(readonly id: number) {
        super()
    }

    async *collector() {
        const { id } = this

        yield tmp(<GroupLoader key={id} />)

        const { name, image } = await Api.loadGroup(id)

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

function Container({ children }: FractalJSX.Attributes) {
    return <div className={styles.group}>{children}</div>
}

export type GroupImgProps = FractalJSX.Attributes & { src: string }

function GroupImg({ src }: GroupImgProps) {
    return <img className={styles.img} src={src} />
}

function GroupImgLoader() {
    return <Loader className={styles.imgLoader} w="auto" h="auto" />
}

function GroupName({ children }: FractalJSX.Attributes) {
    return <div className={styles.name}>{children}</div>
}
