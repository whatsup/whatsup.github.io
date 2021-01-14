import styles from './friend.scss'
import { Fractal, Context } from 'whatsup'
import { WhatsJSX } from '@whatsup-js/jsx'
import { Loader } from 'loadable/loader'
import { Api } from 'loadable/api'

export class Friend extends Fractal<JSX.Element> {
    constructor(readonly id: number) {
        super()
    }

    *whatsUp(ctx: Context) {
        const { id } = this
        const deferredFriend = ctx.defer(() => Api.loadFriend(id))

        yield <FriendLoader key={id} />

        const { avatar, name, job } = deferredFriend.value!

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

function Container({ children }: WhatsJSX.Attributes) {
    return <div className={styles.container}>{children}</div>
}

type AvatarProps = WhatsJSX.Attributes & { src: string }

function FriendAvatar({ src }: AvatarProps) {
    return <img className={styles.avatar} src={src} />
}

function FriendName({ children }: WhatsJSX.Attributes) {
    return <div className={styles.name}>{children}</div>
}

function FriendJob({ children }: WhatsJSX.Attributes) {
    return <div className={styles.job}>{children}</div>
}

function FriendAvatarLoader() {
    return <Loader r="50%" w="auto" h="auto" className={styles.avatarLoader} />
}
