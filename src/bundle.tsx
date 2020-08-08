import React from 'react'
import { render } from 'react-dom'
import { createGlobalStyle } from 'styled-components'
import { Reset } from 'styled-reset'
import { Alive } from '@fract/react-alive'
import { Main } from './main'

const Global = createGlobalStyle`
    body {
        font: 14px 'Helvetica Neue', Helvetica, Arial, sans-serif;
        font-weight: 300;
        color: #4d4d4d;
        min-height: 100vh;
    }

    section, header, main, nav, footer, div, span, input, button, a, ul, li {
        box-sizing: border-box;
    }
`

render(
    <>
        <Reset />
        <Global />
        <Alive target={Main} />
    </>,
    document.getElementById('app')
)
