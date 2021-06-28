import styled from 'styled-components'

const Poster = styled(
  ({
    title,
    subtitle,
    backgroundImage,
    children,
    className
  }) => 
    <section
      className={`${className} poster`}
      style={{backgroundImage: `url(${backgroundImage})`}}
      >
      <span 
        className="content"
        >
        <h1>{title}</h1>
        <h2>{subtitle}</h2>

        <div 
          className="children"
          >
          {children}
        </div>
      </span>
    </section>
  )
  `
    display: block;
    width: 100%;
    height: 40rem;
    background: rgba(0,0,0,0.1);
    position: relative;

    .content{
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      text-align: center;
    }
  `
  
export default Poster