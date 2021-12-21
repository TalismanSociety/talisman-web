import { DISCORD_JOIN_URL, TALISMAN_TWITTER_URL } from '@util/links'

import { Section } from './Section'

export const BenefitsInfo = () => {
  return (
    <Section>
      <h2>Benefits</h2>
      <p>
        Keys have been seen in various locations, but never for very long. The best places to currently find them are:
      </p>
      <ul>
        <li>
          The Talisman{' '}
          <a href={DISCORD_JOIN_URL} target="_blank" rel="noopener noreferrer">
            Discord server
          </a>
        </li>
        <li>Attending community calls and events</li>
        <li>
          Keeping an eye out for giveaways on{' '}
          <a href={TALISMAN_TWITTER_URL} target="_blank" rel="noopener noreferrer">
            Twitter
          </a>
        </li>
        <li>By arranging to review, publish or produce media about Talisman</li>
      </ul>
    </Section>
  )
}
