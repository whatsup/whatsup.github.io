export const Api = new (class Api {
    async loadMenuIds() {
        await rndDelay()
        return [...Array(STORE.menu.length).keys()]
    }
    async loadGroupIds() {
        await rndDelay()
        return [...Array(STORE.groups.length).keys()]
    }
    async loadFriendIds() {
        await rndDelay()
        return [...Array(STORE.friends.length).keys()]
    }
    async loadMenuItem(id: number) {
        await rndDelay()
        return STORE.menu[id]
    }
    async loadGroup(id: number) {
        await rndDelay()
        const data = STORE.groups[id]
        await preloadImg(data.image)
        return data
    }
    async loadFriend(id: number) {
        await rndDelay()
        const data = STORE.friends[id]
        await preloadImg(data.avatar)
        return data
    }
})()

function preloadImg(url: string) {
    return new Promise((r) => {
        const img = new Image()
        img.onload = r
        img.src = url
    })
}

function rndDelay() {
    return new Promise((r) => setTimeout(r, 500 + Math.random() * 300))
}

const STORE = {
    menu: [
        { name: 'Contacts' },
        { name: 'Cards' },
        { name: 'Trends' },
        { name: 'Tags' },
        { name: 'Settings' },
        { name: 'Files' },
    ],
    groups: [
        { name: 'Mandelbrot', image: require('./images/groups/1.jpg').default },
        { name: 'Flower', image: require('./images/groups/2.jpg').default },
        { name: 'Spiral', image: require('./images/groups/3.jpg').default },
        { name: 'Tonnel', image: require('./images/groups/4.jpg').default },
        { name: 'Turbulence', image: require('./images/groups/5.jpg').default },
        { name: 'Other', image: require('./images/groups/6.jpg').default },
    ],
    friends: [
        { name: 'Mary Miller', job: 'Designer', avatar: require('./images/avatars/1.jpg').default },
        { name: 'Ellen Paul', job: 'Web Designer', avatar: require('./images/avatars/2.jpg').default },
        { name: 'Daniel Walters', job: 'Fractal Developer', avatar: require('./images/avatars/3.jpg').default },
        { name: 'William Hamilton', job: 'Contributor', avatar: require('./images/avatars/4.jpg').default },
        { name: 'Rebecca Cain', job: 'Product Manager', avatar: require('./images/avatars/5.jpg').default },
        { name: 'Frank Bates', job: 'Product Manager', avatar: require('./images/avatars/6.jpg').default },
    ],
}
