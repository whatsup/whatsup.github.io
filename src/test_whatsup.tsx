import { conse, cause, transaction, whatsUp } from 'whatsup'

function testWhatsUp(layerCount) {
    let i = 0

    const start = {
        prop1: conse(i++),
        prop2: conse(i++),
        prop3: conse(i++),
        prop4: conse(i++),
    }

    let layer: any = start

    for (let i = 0; i < layerCount; i++) {
        layer = (({ prop1, prop2, prop3, prop4 }) => {
            return {
                prop1: cause(function* () {
                    while (true) yield yield* prop2
                }),
                prop2: cause(function* () {
                    while (true) yield (yield* prop1) - (yield* prop3)
                }),
                prop3: cause(function* () {
                    while (true) yield (yield* prop2) + (yield* prop4)
                }),
                prop4: cause(function* () {
                    while (true) yield yield* prop3
                }),
            }
        })(layer)
    }

    const end = cause(function* () {
        while (true) {
            yield {
                prop1: yield* layer.prop1,
                prop2: yield* layer.prop2,
                prop3: yield* layer.prop3,
                prop4: yield* layer.prop4,
            }
        }
    })

    let data

    whatsUp(end, (d) => (data = d))

    const run = () => {
        const now = performance.now()

        transaction(() => {
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

testWhatsUp(1000)(1000)
