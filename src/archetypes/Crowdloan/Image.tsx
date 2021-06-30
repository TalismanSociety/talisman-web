import styled from 'styled-components'
import { useState, useEffect } from 'react'
import { Image as Img } from '@components'
import { useCrowdloanById } from '@libs/talisman'

const images = require.context('../../assets/parachains', true);

const Image = styled(
  ({
    id,
    thumb,
    icon,
    className
  }) => {
    const { assets, name } = useCrowdloanById(id)
    const [image, setImage] = useState()
    const [type, setType] = useState()

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
          setType(type)
        }
      } catch {}
    }, [assets]) // eslint-disable-line

    return <Img 
      src={image} 
      alt={`${name} thumb`}
      className={`crowdloan-image ${className}`}
      data-type={type}
    />
  })
  `
    &[data-type'icon']{
      width: 2rem;
      height: 2rem;
    }
  `

export default Image