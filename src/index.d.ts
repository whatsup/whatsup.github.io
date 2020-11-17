declare module '*.svg' {
    const content: React.FunctionComponent<React.SVGAttributes<SVGElement>>
    export default content
}

declare module '*.scss' {
    const classes: { [key: string]: string }
    export default classes
}
