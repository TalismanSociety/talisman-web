import styled from 'styled-components'

const Info = styled(
  ({
    title,
    subtitle,
    graphic,
    className,
    ...rest
  }) => 
    <div
      className={`info ${className}`}
      {...rest}
      >
      {graphic && 
        <span 
          className="graphic"
          >
          {graphic}
        </span>
      }
      <span 
        className="text"
        >
        {!!title && 
          <span 
            className="title"
            >
            {title}
          </span>
        }
        {!!subtitle && 
          <span 
            className="subtitle"
            >
            {subtitle}
          </span>
        }
      </span>
      
    </div>
  )
  `
    display: flex;
    justify-content: space-between;
    align-items: center;
    text-align: inherit;

    .graphic{
      margin-right: 0.5em;
    }

    .text{
      >*{
        display: block;
        line-height: 1.3em;
      }

      .title{
        font-weight: bold;
      }

      .subtitle{
        font-size: var(--font-size-small);
        color: var(--color-mid);
      }
    }
  `

export default Info