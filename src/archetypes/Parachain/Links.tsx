import { ReactComponent as DiscordIcon } from '@assets/icons/discord.svg'
import { ReactComponent as ElementIcon } from '@assets/icons/element.svg'
import { ReactComponent as GithubIcon } from '@assets/icons/github.svg'
import { ReactComponent as LinkedinIcon } from '@assets/icons/linkedin.svg'
import { ReactComponent as MediumIcon } from '@assets/icons/medium.svg'
import { ReactComponent as WebsiteIcon } from '@assets/icons/monitor.svg'
import { ReactComponent as RedditIcon } from '@assets/icons/reddit.svg'
import { ReactComponent as TelegramIcon } from '@assets/icons/send.svg'
import { ReactComponent as TwitterIcon } from '@assets/icons/twitter.svg'
import { ReactComponent as YoutubeIcon } from '@assets/icons/youtube.svg'
import { Pill } from '@components'
import { useParachainById } from '@libs/talisman'
import styled from 'styled-components'

const Icon = ({ type }) => {
  switch (type.toLowerCase()) {
    case 'website':
      return <WebsiteIcon />
    case 'twitter':
      return <TwitterIcon />
    case 'telegram':
      return <TelegramIcon />
    case 'github':
      return <GithubIcon />
    case 'medium':
      return <MediumIcon />
    case 'discord':
      return <DiscordIcon />
    case 'reddit':
      return <RedditIcon />
    case 'element':
      return <ElementIcon />
    case 'linkedin':
      return <LinkedinIcon />
    case 'youtube':
      return <YoutubeIcon />
    default:
      break
  }

  return type
}

const Links = styled(({ id, className }) => {
  const {
    parachain: { links = {} },
  } = useParachainById(id)

  return (
    <div className={`crowdloan-links ${className}`}>
      {Object.keys(links).map(name => (
        <a href={links[name]} target="_blank" rel="noreferrer">
          <Pill primary onClick>
            <Icon type={name} />
          </Pill>
        </a>
      ))}
    </div>
  )
})`
  display: flex;
  align-items: center;

  > a {
    display: block;
    & + a {
      margin-left: 0.2em;
    }
  }
`

export default Links
