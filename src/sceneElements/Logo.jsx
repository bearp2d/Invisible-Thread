import React from 'react'
import SVGLoader from 'three/examples/jsm/loaders/SVGLoader'
import logo from '../images/thisSVG.svg'

let Logo = () => {
let loaders = new SVGLoader.SVGLoader();
loaders.load(logo)

    return <div>
    </div>
}

export default Logo;