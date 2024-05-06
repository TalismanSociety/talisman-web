import styled from '@emotion/styled'

const Pill = styled(({ percent, className }: { className?: string; percent?: number }) => (
  <div className={`${className ?? ''} progress-bar`}>
    <span style={{ width: `${percent ?? 0}%` }} />
  </div>
))`
  display: block;
  height: 1em;
  border-radius: 0.5em;
  position: relative;
  overflow: hidden;
  background: rgb(${({ theme }) => theme.foreground}, 0.1);
  color: rgb(${({ theme }) => theme.foreground});

  > span {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    height: 1em;
    background: rgb(${({ theme }) => theme.primary});
    transition: all 0.3s ease-out;
  }
`

export default Pill
