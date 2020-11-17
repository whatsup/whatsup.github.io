import styles from './group.scss'
import { Emitter, tmp } from '@fract/core'
import { Loader } from 'loadable/loader'
import { Api } from 'loadable/api'

export class Group extends Emitter<JSX.Element> {
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

type Props = { children: any }
type GroupImgProps = { src: string }

function Container({ children }: Props) {
    return <div className={styles.group}>{children}</div>
}

function GroupImg(props: GroupImgProps) {
    return <img className={styles.img} src={props.src} />
}

function GroupImgLoader() {
    return <Loader className={styles.imgLoader} w="auto" h="auto" />
}

function GroupName({ children }: Props) {
    return <div className={styles.name}>{children}</div>
}
