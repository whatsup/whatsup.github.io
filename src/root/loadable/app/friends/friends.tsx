import styles from './friends.scss'
import { tmp, list, Fractal, List } from '@fract/core'
import { FractalJSX } from '@fract/jsx'
import { Loader } from 'loadable/loader'
import { Api } from 'loadable/api'
import { Friend, FriendLoader } from './friend'

export class Friends extends Fractal<JSX.Element> {
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

function FriendsLoader() {
    return (
        <Container>
            <FriendsTitle>
                <Loader h={26} />
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

function Container({ children }: FractalJSX.Attributes) {
    return <div className={styles.container}>{children}</div>
}

function FriendsTitle({ children }: FractalJSX.Attributes) {
    return <div className={styles.title}>{children}</div>
}
