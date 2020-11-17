import styles from './loader.scss'

interface LoaderProps {
    w?: number | string
    h?: number | string
    r?: number | string
    dark?: boolean
    className?: string
}

export function Loader(props: LoaderProps) {
    const { w = '80%', h = 20, r = 20, dark = false, className = '', ...other } = props
    const width = numToPx(w)
    const height = numToPx(h)
    const borderRadius = numToPx(r)

    return <div className={styles.container} style={{ width, height, borderRadius }} /> // TODO: {...other}
}

function numToPx(prop: number | string) {
    return typeof prop === 'number' ? prop + 'px' : prop
}
