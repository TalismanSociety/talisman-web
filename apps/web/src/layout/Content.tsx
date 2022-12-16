import styled from '@emotion/styled'

const Content = styled(
  ({ children, className }: React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>) => (
    <main className={className}>{children}</main>
  )
)``

export default Content
