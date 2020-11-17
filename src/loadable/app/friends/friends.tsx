import styles from './friends.scss'
import { tmp, list, Emitter, List } from '@fract/core'
import { Loader } from '../../loader'
import { Api } from '../../api'

export class Friends extends Emitter<JSX.Element> {
    list!: List<Friend>

    async loadFriendList() {
        if (!this.list) {
            this.list = list((await Api.loadFriendIds()).map((id) => new Friend(id)))
        }
    }

    async *collector() {
        yield tmp(<FriendsLoader />)

        await this.loadFriendList()

        while (true) {
            yield (
                <Container>
                    <FriendsTitle>My friends</FriendsTitle>
                    {yield* this.list}
                </Container>
            )
        }
    }
}

export class Friend extends Emitter<JSX.Element> {
    constructor(readonly id: number) {
        super()
    }

    async *collector() {
        const { id } = this

        yield tmp(<FriendLoader key={id} />)

        const { name, job, avatar } = await Api.loadFriend(id)

        while (true) {
            yield (
                <FriendComponent key={id}>
                    <FriendAvatar src={avatar} />
                    <FriendName>{name}</FriendName>
                    <FriendJob>{job}</FriendJob>
                </FriendComponent>
            )
        }
    }
}

function FriendsLoader() {
    return (
        <Container>
            <FriendsTitle>
                <Loader h={28} />
            </FriendsTitle>
            <FriendLoader />
            <FriendLoader />
            <FriendLoader />
            <FriendLoader />
            <FriendLoader />
            <FriendLoader />
        </Container>
    )
}

function FriendLoader() {
    return (
        <FriendComponent>
            <FriendAvatarLoader />
            <FriendName>
                <Loader h={16} />
            </FriendName>
            <FriendJob>
                <Loader h={10} w="40%" />
            </FriendJob>
        </FriendComponent>
    )
}

type Props = { children: any }
type AvatarProps = { src: string }

function Container({ children }: Props) {
    return <div className={styles.container}>{children}</div>
}

function FriendsTitle({ children }: Props) {
    return <div className={styles.friendsTitle}>{children}</div>
}

function FriendComponent({ children }: Props) {
    return <div className={styles.friend}>{children}</div>
}

function FriendAvatar(props: AvatarProps) {
    return <img className={styles.friendAvatar} src={props.src} />
}

function FriendName({ children }: Props) {
    return <div className={styles.friendName}>{children}</div>
}

function FriendJob({ children }: Props) {
    return <div className={styles.friendJob}>{children}</div>
}

function FriendAvatarLoader() {
    return <Loader r="50%" w="auto" h="auto" className={styles.friendAvatarLoader} />
}
