import { CreditCard, Menu, PieChart, Repeat, Zap } from '@talismn/web-icons'
import { useState } from 'react'
import { Link } from 'react-router-dom'

import { CurrencySelect } from '@/components/molecules/CurrencySelect'
import { WalletConnectionButton } from '@/components/molecules/WalletConnectionButton'
import { cn } from '@/util/cn'

import { SiteFooter } from './SiteFooter'
import { SiteLogo } from './SiteLogo'
import { SiteMobileNav } from './SiteMobileNav'
import { SiteNavItem } from './SiteNavItem'

export const SiteNav = ({ className, contentClassName }: { className?: string; contentClassName?: string }) => {
  const [mobileNavOpen, setMobileNavOpen] = useState(false)

  return (
    // z-50 keeps this above the fullscreen suspense loader,
    // so we can still navigate between pages while the current one is loading
    <header className={cn('relative z-50', className)}>
      <div
        className="pointer-events-none absolute bottom-0 left-0 right-0 top-0 z-0 opacity-5"
        style={{
          backgroundColor: 'hsla(50,78%,75%,1)',
          backgroundImage: `
              radial-gradient(at 31% 67%, hsla(178,35%,52%,1) 0px, transparent 50%),
              radial-gradient(at 69% 30%, hsla(253,45%,72%,1) 0px, transparent 50%),
              radial-gradient(at 61% 49%, hsla(237,80%,74%,1) 0px, transparent 50%),
              radial-gradient(at 27% 27%, hsla(100,48%,70%,1) 0px, transparent 50%),
              radial-gradient(at 70% 0%, hsla(39,77%,77%,1) 0px, transparent 50%)`,
          backgroundPosition: 'center',
          backgroundSize: '100% 400%',
        }}
      />
      <div className={cn('flex h-32 items-center justify-between gap-8', contentClassName)}>
        <Link className="flex-1 md:flex-initial" to="/portfolio">
          <SiteLogo responsive />
        </Link>
        <div className="hidden items-center gap-8 md:flex lg:gap-14">
          <SiteNavItem label="Portfolio" icon={<PieChart />} to="/portfolio" />
          <SiteNavItem label="Staking" icon={<Zap />} to="/staking" />
          <SiteNavItem label="Swap" icon={<Repeat />} to="/transport" />
          <SiteNavItem label="Buy/Sell" icon={<CreditCard />} to="https://checkout.banxa.com/" target="_blank" />
        </div>
        <div className="space-between flex items-center gap-3">
          <CurrencySelect className="hidden md:block" />
          <WalletConnectionButton />
        </div>
        <div className="flex flex-1 items-center justify-end gap-4 md:hidden">
          <CurrencySelect />
          <button className="block p-4" type="button" onClick={() => setMobileNavOpen(true)}>
            <Menu />
          </button>
        </div>
      </div>

      {/* Mobile Nav Drawer */}
      <SiteMobileNav
        open={mobileNavOpen}
        onRequestDismiss={() => setMobileNavOpen(false)}
        headerIcon={<SiteLogo />}
        footer={<SiteFooter />}
      >
        <Link to="/portfolio">
          <SiteMobileNav.Item label="Portfolio" icon={<PieChart />} />
        </Link>
        <Link to="/staking">
          <SiteMobileNav.Item label="Staking" icon={<Zap />} />
        </Link>
        <Link to="/transport">
          <SiteMobileNav.Item label="Swap" icon={<Repeat />} />
        </Link>
        <Link to="https://checkout.banxa.com/" target="_blank">
          <SiteMobileNav.Item label="Buy/Sell" icon={<CreditCard />} />
        </Link>
      </SiteMobileNav>
    </header>
  )
}
