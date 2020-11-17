import styles from './groups.scss'
import { tmp, list, Emitter, List } from '@fract/core'
import { Loader } from '../../loader'
import { Api } from '../../api'

export class Groups extends Emitter<JSX.Element> {
    list!: List<Group>

    async loadGroupList() {
        if (!this.list) {
            this.list = list((await Api.loadGroupIds()).map((id) => new Group(id)))
        }
    }

    async *collector() {
        yield tmp(<GroupsLoader />)

        await this.loadGroupList()

        while (true) {
            yield <Container>{yield* this.list}</Container>
        }
    }
}

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
                <GroupComponent key={id}>
                    <GroupImg src={image} />
                    <GroupName>{name}</GroupName>
                </GroupComponent>
            )
        }
    }
}

function GroupsLoader() {
    return (
        <Container>
            <GroupLoader />
            <GroupLoader />
            <GroupLoader />
            <GroupLoader />
            <GroupLoader />
            <GroupLoader />
        </Container>
    )
}

function GroupLoader() {
    return (
        <GroupComponent>
            <GroupImgLoader />
            <GroupName>
                <Loader />
            </GroupName>
        </GroupComponent>
    )
}

type Props = { children: any }
type GroupImgProps = { src: string }

function Container({ children }: Props) {
    return <div className={styles.container}>{children}</div>
}

function GroupComponent({ children }: Props) {
    return <div className={styles.group}>{children}</div>
}

function GroupImg(props: GroupImgProps) {
    return <img className={styles.groupImg} src={props.src} />
}

function GroupImgLoader() {
    return <Loader className={styles.groupImgLoader} w="auto" h="auto" />
}

function GroupName({ children }: Props) {
    return <div className={styles.groupName}>{children}</div>
}
