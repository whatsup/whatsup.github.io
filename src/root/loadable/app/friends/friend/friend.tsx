import styles from './friend.scss'
import { Fractal, Context } from '@fract/core'
import { FractalJSX } from '@fract/jsx'
import { Loader } from 'loadable/loader'
import { Api } from 'loadable/api'

export class Friend extends Fractal<JSX.Element> {
    constructor(readonly id: number) {
        super()
    }

    *stream(ctx: Context) {
        const { id } = this
        let friendAvatar: string
        let friendName: string
        let friendJob: string

        Api.loadFriend(id).then((friend) => {
            friendAvatar = friend.avatar
            friendName = friend.name
            friendJob = friend.job
            ctx.update()
        })

        yield <FriendLoader key={id} />

        while (true) {
            yield (
                <Container key={id}>
                    <FriendAvatar src={friendAvatar!} />
                    <FriendName>{friendName!}</FriendName>
                    <FriendJob>{friendJob!}</FriendJob>
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

function Container({ children }: FractalJSX.Attributes) {
    return <div className={styles.container}>{children}</div>
}

type AvatarProps = FractalJSX.Attributes & { src: string }

function FriendAvatar({ src }: AvatarProps) {
    return <img className={styles.avatar} src={src} />
}

function FriendName({ children }: FractalJSX.Attributes) {
    return <div className={styles.name}>{children}</div>
}

function FriendJob({ children }: FractalJSX.Attributes) {
    return <div className={styles.job}>{children}</div>
}

function FriendAvatarLoader() {
    return <Loader r="50%" w="auto" h="auto" className={styles.avatarLoader} />
}
