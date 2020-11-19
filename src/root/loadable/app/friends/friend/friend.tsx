import styles from './friend.scss'
import { tmp, Fractal } from '@fract/core'
import { Loader } from 'loadable/loader'
import { Api } from 'loadable/api'

export class Friend extends Fractal<JSX.Element> {
    constructor(readonly id: number) {
        super()
    }

    async *collector() {
        const { id } = this

        yield tmp(<FriendLoader key={id} />)

        const { name, job, avatar } = await Api.loadFriend(id)

        while (true) {
            yield (
                <Container key={id}>
                    <FriendAvatar src={avatar} />
                    <FriendName>{name}</FriendName>
                    <FriendJob>{job}</FriendJob>
                </Container>
            )
        }
    }
}

export function FriendLoader() {
    return (
        <Container>
            <FriendAvatarLoader />
            <FriendName>
                <Loader h={16} />
            </FriendName>
            <FriendJob>
                <Loader h={10} w="40%" />
            </FriendJob>
        </Container>
    )
}

type Props = { children: any }
type AvatarProps = { src: string }

function Container({ children }: Props) {
    return <div className={styles.container}>{children}</div>
}

function FriendAvatar(props: AvatarProps) {
    return <img className={styles.avatar} src={props.src} />
}

function FriendName({ children }: Props) {
    return <div className={styles.name}>{children}</div>
}

function FriendJob({ children }: Props) {
    return <div className={styles.job}>{children}</div>
}

function FriendAvatarLoader() {
    return <Loader r="50%" w="auto" h="auto" className={styles.avatarLoader} />
}
