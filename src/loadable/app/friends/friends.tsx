import styles from './friends.scss'
import { fractal, tmp, list } from '@fract/core'
import { API } from '../../factors'
import { Loader } from '../../loader'

export const Friends = fractal(async function* _Groups(ctx) {
    yield tmp(<FriendsLoader />)

    const api = ctx.get(API)!
    const FriendList = list((await api.loadFriendIds()).map((id) => newFriend(id)))

    while (true) {
        yield (
            <Container>
                <FriendsTitle>My friends</FriendsTitle>
                {yield* FriendList}
            </Container>
        )
    }
})

function newFriend(id: number) {
    return fractal(async function* _Friend(ctx) {
        yield tmp(<FriendLoader key={id} />)

        const api = ctx.get(API)!
        const { name, job, avatar } = await api.loadFriend(id)

        while (true) {
            yield (
                <Friend key={id}>
                    <FriendAvatar src={avatar} />
                    <FriendName>{name}</FriendName>
                    <FriendJob>{job}</FriendJob>
                </Friend>
            )
        }
    })
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
        <Friend>
            <FriendAvatarLoader />
            <FriendName>
                <Loader h={16} />
            </FriendName>
            <FriendJob>
                <Loader h={10} w="40%" />
            </FriendJob>
        </Friend>
    )
}

type Props = { children: string | JSX.Element | JSX.Element[] }
type AvatarProps = { src: string }

function Container(props: Props) {
    return <div className={styles.container}>{props.children}</div>
}

function FriendsTitle(props: Props) {
    return <div className={styles.friendsTitle}>{props.children}</div>
}

function Friend(props: Props) {
    return <div className={styles.friend}>{props.children}</div>
}

function FriendAvatar(props: AvatarProps) {
    return <img className={styles.friendAvatar} src={props.src} />
}

function FriendName(props: Props) {
    return <div className={styles.friendName}>{props.children}</div>
}

function FriendJob(props: Props) {
    return <div className={styles.friendJob}>{props.children}</div>
}

function FriendAvatarLoader() {
    return <Loader r="50%" w="auto" h="auto" className={styles.friendAvatarLoader} />
}
