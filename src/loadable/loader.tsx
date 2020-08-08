import styled, { keyframes } from 'styled-components'
import React from 'react'

interface LoaderProps {
    w?: number | string
    h?: number | string
    r?: number | string
    dark?: boolean
}

export function Loader(props: LoaderProps) {
    const { w = '80%', h = 20, r = 20, dark = false, ...other } = props
    const width = numToPx(w)
    const height = numToPx(h)
    const radius = numToPx(r)

    return <Container width={width} height={height} radius={radius} dark={dark} {...other} />
}

function numToPx(prop: number | string) {
    return typeof prop === 'number' ? prop + 'px' : prop
}

const animation = keyframes` 
    0%{
        background-position-x: 0%;
    }
    100%{
        background-position-x: -200%;
    }
`

const Container = styled.div<{ width: string; height: string; radius: string; dark: boolean }>`
    height: ${(p) => p.height};
    width: ${(p) => p.width};
    border-radius: ${(p) => p.radius};
    animation-name: ${animation};
    animation-fill-mode: forwards;
    animation-iteration-count: infinite;
    animation-timing-function: linear;
    animation-duration: 3s;
    background-image: linear-gradient(
        to right,
        transparent 0,
        transparent 40%,
        rgba(255, 255, 255, 0.2) 50%,
        transparent 60%,
        transparent 100%
    );
    background-color: #e0e0e0;
    background-size: 300% 100%;
`
