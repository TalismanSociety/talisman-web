import styled from '@emotion/styled'

type ContentProps = {
  children: React.ReactNode,
  className: React.ReactNode,
}

const Content = styled(({ children, className }: ContentProps) => <main className={className}>{children}</main>)``

export default Content
