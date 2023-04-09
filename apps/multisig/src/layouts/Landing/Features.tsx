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
      max-width: 286px;
      line-height: 140%;
      margin-bottom: 50px;
      @media ${device.sm} {
        gap: 32px;
      }
      @media ${device.md} {
        margin: 0;
        max-width: 334px;
        padding: 24px 32px;
      }
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
      display: flex;
      flex-wrap: wrap;
      justify-content: center;
      max-width: 1000px;
      margin: 0 60px;
      @media ${device.md} {
        flex-wrap: nowrap;
      }
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
