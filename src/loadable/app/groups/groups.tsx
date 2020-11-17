import styles from './groups.scss'
import { fractal, tmp, list } from '@fract/core'
import { API } from '../../factors'
import { Loader } from '../../loader'

export const Groups = fractal(async function* _Groups(ctx) {
    yield tmp(<GroupsLoader />)

    const api = ctx.get(API)!
    const GroupList = list((await api.loadGroupIds()).map((id) => newGroup(id)))

    while (true) {
        console.log(yield* GroupList)
        yield <Container>{yield* GroupList}</Container>
    }
})

function newGroup(id: number) {
    return fractal(async function* _Group(ctx) {
        yield tmp(<GroupLoader key={id} />)

        const api = ctx.get(API)!
        const { name, image } = await api.loadGroup(id)

        while (true) {
            yield (
                <Group key={id}>
                    <GroupImg src={image} />
                    <GroupName>{name}</GroupName>
                </Group>
            )
        }
    })
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
        <Group>
            <GroupImgLoader />
            <GroupName>
                <Loader />
            </GroupName>
        </Group>
    )
}

type Props = { children: any }
type GroupImgProps = { src: string }

function Container(props: Props) {
    return <div className={styles.container}>{props.children}</div>
}

function Group(props: Props) {
    return <div className={styles.group}>{props.children}</div>
}

function GroupImg(props: GroupImgProps) {
    return <img className={styles.groupImg} src={props.src} />
}

function GroupImgLoader() {
    return <Loader className={styles.groupImgLoader} w="auto" h="auto" />
}

function GroupName(props: Props) {
    return <div className={styles.groupName}>{props.children}</div>
}
