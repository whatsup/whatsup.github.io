import { observable, computed, autorun, runInAction } from 'mobx'

function testMobx(layerCount) {
    let i = 0

    const start = {
        prop1: observable(i++),
        prop2: observable(i++),
        prop3: observable(i++),
        prop4: observable(i++),
    }

    let layer = start

    for (let i = 0; i < layerCount; i++) {
        layer = (({ prop1, prop2, prop3, prop4 }) => {
            return {
                prop1: computed(() => prop2.get()),
                prop2: computed(() => prop1.get() - prop3.get()),
                prop3: computed(() => prop2.get() + prop4.get()),
                prop4: computed(() => prop3.get()),
            }
        })(layer)
    }

    const end = computed(() => {
        return {
            prop1: layer.prop1.get(),
            prop2: layer.prop2.get(),
            prop3: layer.prop3.get(),
            prop4: layer.prop4.get(),
        }
    })

    let data

    autorun(() => (data = end.get()))

    const run = () => {
        const now = performance.now()

        runInAction(() => {
            start.prop1.set(i++)
            start.prop2.set(i++)
            start.prop3.set(i++)
            start.prop4.set(i++)
        })

        return performance.now() - now
    }

    return (count) => {
        console.log('Before', data)

        let acc = 0

        for (let i = 0; i < count; i++) {
            acc += run()
        }

        const time = acc / count

        console.log('After', data)
        console.log('Time', time)
    }
}

testMobx(1000)(100)
