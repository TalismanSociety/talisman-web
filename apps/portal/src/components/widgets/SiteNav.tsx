import { IconButton } from '@talismn/ui/atoms/IconButton'
import { NavigationBar } from '@talismn/ui/organisms/NavigationBar'
import { NavigationDrawer } from '@talismn/ui/organisms/NavigationDrawer'
import { NavigationRail } from '@talismn/ui/organisms/NavigationRail'
import { TopAppBar } from '@talismn/ui/organisms/TopAppBar'
import {
  Compass,
  CreditCard,
  FileText,
  MoreHorizontal,
  PieChart,
  Repeat,
  Star,
  TalismanHand,
  Zap,
} from '@talismn/web-icons'
import { Link } from 'react-router-dom'

import Discord from '@/assets/icons/discord-header.svg?react'
import GitHub from '@/assets/icons/github-header.svg?react'
import Medium from '@/assets/icons/medium-header.svg?react'
import Twitter from '@/assets/icons/twitter-header.svg?react'
import { WalletConnectionButton } from '@/components/molecules/WalletConnectionButton'

export const SiteNavTopBar = ({ openDrawer }: { openDrawer: () => void }) => (
  <TopAppBar
    navigationIcon={
      <IconButton as={Link} to="/">
        <TalismanHand />
      </IconButton>
    }
    title={<WalletConnectionButton />}
    actions={
      <TopAppBar.Actions>
        <IconButton onClick={openDrawer}>
          <MoreHorizontal />
        </IconButton>
      </TopAppBar.Actions>
    }
  />
)

export const SiteNavSidebar = () => (
  <NavigationRail
    header={
      <IconButton as={Link} to="/" size="4rem">
        <TalismanHand size="4rem" />
      </IconButton>
    }
  >
    <Link to="/portfolio">
      <NavigationRail.Item label="Portfolio" icon={<PieChart />} />
    </Link>
    <Link to="/staking">
      <NavigationRail.Item label="Staking" icon={<Zap />} />
    </Link>
    <Link to="/transport/swap">
      <NavigationRail.Item label="Swap" icon={<Repeat />} />
    </Link>
    <Link to="/explore">
      <NavigationRail.Item label="Explore" icon={<Compass />} />
    </Link>
    <Link to="/crowdloans/participated">
      <NavigationRail.Item label="Crowdloans" icon={<Star />} />
    </Link>
    <Link to="https://checkout.banxa.com/" target="_blank">
      <NavigationRail.Item label="Buy" icon={<CreditCard />} />
    </Link>
    <Link to="/history">
      <NavigationRail.Item label="History" icon={<FileText />} />
    </Link>
  </NavigationRail>
)

export const SiteNavBottomBar = () => (
  <NavigationBar>
    <Link to="/portfolio">
      <NavigationBar.Item label="Portfolio" icon={<PieChart />} />
    </Link>
    <Link to="/staking">
      <NavigationBar.Item label="Staking" icon={<Zap />} />
    </Link>
    <Link to="/transport/swap">
      <NavigationBar.Item label="Swap" icon={<Repeat />} />
    </Link>
    <Link to="/crowdloans/participated">
      <NavigationBar.Item label="Crowdloans" icon={<Star />} />
    </Link>
    <Link to="/history">
      <NavigationBar.Item label="History" icon={<FileText />} />
    </Link>
  </NavigationBar>
)

export const SiteNavDrawer = ({ isOpen, close }: { isOpen: boolean; close: () => void }) => (
  <NavigationDrawer
    open={isOpen}
    onRequestDismiss={close}
    headerIcon={<TalismanHand />}
    footer={
      <NavigationDrawer.Footer>
        <Link to="https://discord.gg/talisman" target="_blank">
          <NavigationDrawer.Footer.Icon>
            <Discord width="2.4rem" height="2.4rem" />
          </NavigationDrawer.Footer.Icon>
        </Link>
        <Link to="https://github.com/TalismanSociety/talisman-web" target="_blank">
          <NavigationDrawer.Footer.Icon>
            <GitHub width="2.4rem" height="2.4rem" />
          </NavigationDrawer.Footer.Icon>
        </Link>
        <Link to="https://twitter.com/wearetalisman" target="_blank">
          <NavigationDrawer.Footer.Icon>
            <Twitter width="2.4rem" height="2.4rem" />
          </NavigationDrawer.Footer.Icon>
        </Link>
        <Link to="https://medium.com/we-are-talisman" target="_blank">
          <NavigationDrawer.Footer.Icon>
            <Medium width="2.4rem" height="2.4rem" />
          </NavigationDrawer.Footer.Icon>
        </Link>
        <NavigationDrawer.Footer.A
          href="https://docs.talisman.xyz/talisman/legal-and-security/terms-of-use"
          target="_blank"
        >
          Terms
        </NavigationDrawer.Footer.A>
        <NavigationDrawer.Footer.A
          href="https://docs.talisman.xyz/talisman/legal-and-security/privacy-policy"
          target="_blank"
        >
          Privacy
        </NavigationDrawer.Footer.A>
      </NavigationDrawer.Footer>
    }
  >
    <Link to="/portfolio">
      <NavigationDrawer.Item label="Portfolio" icon={<PieChart />} />
    </Link>
    <Link to="/staking">
      <NavigationDrawer.Item label="Staking" icon={<Zap />} />
    </Link>
    <Link to="/transport">
      <NavigationDrawer.Item label="Swap" icon={<Repeat />} />
    </Link>
    <Link to="/crowdloans/participated">
      <NavigationDrawer.Item label="Crowdloans" icon={<Star />} />
    </Link>
    <Link to="/explore">
      <NavigationDrawer.Item label="Explore" icon={<Compass />} />
    </Link>
    <Link to="https://checkout.banxa.com/" target="_blank">
      <NavigationDrawer.Item label="Buy crypto" icon={<CreditCard />} />
    </Link>
    <Link to="/history" target="_blank">
      <NavigationDrawer.Item label="History" icon={<FileText />} />
    </Link>
  </NavigationDrawer>
)
