import styled from 'styled-components'

const Pill = styled(
  ({
    title,
    children,
    className,
    ...rest
  }) => 
    <span
      className={`stat ${className}`}
      {...rest}
      >
      {!!title && <span className="title">{title}</span>}
      <span className="value">{children}</span>
    </span>
  )
  `
    display: flex;
    justify-content: space-between;
    align-items: center;
    list-style: inherit;

    .title{
      
    }
  `

export default Pill