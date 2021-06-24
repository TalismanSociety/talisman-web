import styled from 'styled-components'

const Image = styled(
  ({
    src,
    alt,
    className,
  }) => 
    <div 
      className={`image ${className}`}
      >
      <img 
        src={src||''}
        alt={alt}
      />
    </div>
  )
  `
    background-image: url(${({src}) => src});
    background-size: cover;
    background-repeat: no-repeat;

    img{
      opacity: 0;
    }
  `
  

export default Image