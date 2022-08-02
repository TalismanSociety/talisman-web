import { Button, Panel } from '@archetypes/XCM'
import { PanelSection } from '@components'
import ExtensionStatusGate from '@components/ExtensionStatusGate'
import { device } from '@util/breakpoints'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components'

const ExtensionUnavailable = styled(props => {
  const { t } = useTranslation()
  return (
    <PanelSection comingSoon {...props}>
      <p>{t('extensionUnavailable.subtitle')}</p>
      <p>{t('extensionUnavailable.text')}</p>
    </PanelSection>
  )
})`
  text-align: center;
  > *:not(:last-child) {
    margin-bottom: 2rem;
  }
  > *:last-child {
    margin-bottom: 0;
  }
  > h2 {
    color: var(--color-text);
    font-weight: 600;
    font-size: 1.8rem;
  }
  p {
    color: #999;
    font-size: 1.6rem;
  }
`

const XCMBridge = styled(({ className }: any) => {
  
  return (
    <section className={className}>
      <h1>XCM Bridge</h1>
      <ExtensionStatusGate unavailable={<ExtensionUnavailable />}>
        <article>
          {/* Rename this monstrosity */}
          <Panel /> 
          <Button 
            title={'Transfer'} 
            onClick={""} 
            disabled={false} 
          />
        </article>
      </ExtensionStatusGate>
    </section>
  )

})`
  color: var(--color-text);
  width: 100%;
  max-width: 1280px;
  margin: 3rem auto;
  height: 100%;

  @media ${device.xl} {
    margin: 6rem auto;
  }



  article {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: calc(100% - 15rem);
    gap: 1.5em;
  }

  padding: 0 2.4rem;
`

export default XCMBridge