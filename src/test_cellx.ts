import { cellx } from 'cellx'

function testMobx(layerCount) {
    let i = 0

    const start = {
        prop1: cellx(i++),
        prop2: cellx(i++),
        prop3: cellx(i++),
        prop4: cellx(i++),
    }

    let layer = start

    for (let i = 0; i < layerCount; i++) {
        layer = (({ prop1, prop2, prop3, prop4 }) => {
            return {
                prop1: cellx(() => prop2()),
                prop2: cellx(() => prop1() - prop3()),
                prop3: cellx(() => prop2() + prop4()),
                prop4: cellx(() => prop3()),
            }
        })(layer)
    }

    const end = cellx(() => {
        return {
            prop1: layer.prop1(),
            prop2: layer.prop2(),
            prop3: layer.prop3(),
            prop4: layer.prop4(),
        }
    })

    let data

    end.subscribe((...args) => {
        data = end()
        console.log(args)
    })

    const run = () => {
        const now = performance.now()

        start.prop1(i++)
        start.prop2(i++)
        start.prop3(i++)
        start.prop4(i++)

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

testMobx(10)(10)
