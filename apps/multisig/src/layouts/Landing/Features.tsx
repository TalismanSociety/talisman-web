import FeatureIcon from '@components/FeatureIcon'
import { css } from '@emotion/css'
import { device } from '@util/breakpoints'
import { ReactNode } from 'react'

const Feature = ({ primary, subtitle, icon }: { primary: string; subtitle: string; icon: ReactNode }) => (
  <div
    className={css`
      display: grid;
      grid-template-rows: 80px 68px 1fr;
      gap: 24px;
      justify-items: center;
      text-align: center;
      max-width: 334px;
      line-height: 140%;
      padding: 24px 32px;
      @media ${device.lg} {
        max-width: 366px;
        padding: 24px 48px;
      }
    `}
  >
    {icon}
    <p
      className={css`
        color: var(--color-offWhite);
        font-size: 24px;
        align-self: center;
      `}
    >
      {primary}
    </p>
    <p
      className={css`
        font-size: 16px;
        line-height: 140%;
      `}
    >
      {subtitle}
    </p>
  </div>
)

const Features = () => (
  <section
    className={css`
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      justify-items: center;
      max-width: 1000px;
      @media ${device.lg} {
        gap: 31px;
        max-width: 1160px;
      }
    `}
  >
    <Feature
      primary="A multi-sig wallet for a multi-chain future"
      subtitle="The most secure way to manage your assets"
      icon={<FeatureIcon />}
    />
    <Feature
      primary="Manage your on-chain organisation"
      subtitle="Create transactions, manage approvals and much more"
      icon={<FeatureIcon />}
    />
    <Feature
      primary="Send to multiple recipients at once"
      subtitle="A simple way to pay your team and contributors"
      icon={<FeatureIcon />}
    />
  </section>
)

export default Features