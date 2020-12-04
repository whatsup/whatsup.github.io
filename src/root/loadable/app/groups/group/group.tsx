import styles from './group.scss'
import { Fractal, Context } from '@fract/core'
import { Loader } from 'loadable/loader'
import { Api } from 'loadable/api'
import { FractalJSX } from '@fract/jsx'

export class Group extends Fractal<JSX.Element> {
    constructor(readonly id: number) {
        super()
    }

    *stream(ctx: Context) {
        const { id } = this
        let groupName: string
        let groupImage: string

        Api.loadGroup(id).then((group) => {
            groupName = group.name
            groupImage = group.image
            ctx.update()
        })

        yield <GroupLoader key={id} />

        while (true) {
            yield (
                <Container key={id}>
                    <GroupImg src={groupImage!} />
                    <GroupName>{groupName!}</GroupName>
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
