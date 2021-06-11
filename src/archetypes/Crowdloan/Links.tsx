import styled from 'styled-components'
import { Pill } from '@components'
import { useCrowdloanById } from '@libs/talisman'
import { ReactComponent as WebsiteIcon } from '@assets/icons/monitor.svg'
import { ReactComponent as TwitterIcon } from '@assets/icons/twitter.svg'
import { ReactComponent as TelegramIcon } from '@assets/icons/send.svg'
import { ReactComponent as GithubIcon } from '@assets/icons/github.svg'
import { ReactComponent as MediumIcon } from '@assets/icons/medium.svg'
import { ReactComponent as DiscordIcon } from '@assets/icons/discord.svg'

const Icon = ({type}) => {
  switch (type.toLowerCase()) {
    case 'website': return <WebsiteIcon/>
    case 'twitter': return <TwitterIcon/>
    case 'telegram': return <TelegramIcon/>
    case 'github': return <GithubIcon/>
    case 'medium': return <MediumIcon/>
    case 'discord': return <DiscordIcon/>
    default: break
  }

  return type
}

const Links = styled(
  ({
    id,
    className
  }) => {
    const { links={} } = useCrowdloanById(id)

    return <div 
      className={`crowdloan-links ${className}`}
      >
      {Object.keys(links).map(name => 
        <a 
          href={links[name]}
          target='_blank'
          rel="noreferrer"
          >
          <Pill
            primary
            onClick
            >
            <Icon type={name}/>
          </Pill>
        </a>
        
      )}
    </div>
  })
  `
    
    display: flex;
    align-items: center;

    >a {
      display: block;
      & + a{
        margin-left: 0.2em;
      }
    }
  `

export default Links