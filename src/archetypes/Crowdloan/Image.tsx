import { useState, useEffect } from 'react'
import { Image as Img } from '@components'
import { useCrowdloan } from '@libs/talisman'

const images = require.context('../../assets/teams', true);

const Image = 
  ({
    id,
    thumb,
    icon,
    className
  }) => {
    const { assets, name } = useCrowdloan(id)
    const [image, setImage] = useState(null)

    useEffect(() => {
      try {
        const type = !!thumb
          ? 'thumb'
          : !!icon
            ? 'icon'
            : 'poster'

        if(!!assets[type]){
          const _image = (images(`./${assets[type]}`))?.default
          _image && setImage(_image)
        }
      } catch {}
    }, [assets]) // eslint-disable-line


    return <Img 
      src={image} 
      alt={`${name} thumb`}
      className={`crowdloan-image ${className}`}
    />
  }

export default Image