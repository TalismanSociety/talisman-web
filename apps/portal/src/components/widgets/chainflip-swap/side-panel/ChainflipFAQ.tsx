import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { Link } from 'react-router-dom'

export const ChainFlipFAQ: React.FC = () => {
  return (
    <div>
      <Accordion type="single" collapsible>
        <AccordionItem value="how-work">
          <AccordionTrigger>
            <p>How does the swap work?</p>
          </AccordionTrigger>
          <AccordionContent>
            <p className="text-[14px] text-gray-400 leading-[18px]">
              Chainflip is a decentralized exchange that uses a consensus-driven software and a network of Validator
              nodes to manage private keys and execute trades. It utilizes Multi Party Computation (MPC) to govern
              high-threshold multi-signature wallets, ensuring a supermajority is required to function.
              <br />
              <br /> The State Chain defines the AMM and accounting rules, while the Validator Software manages shares
              of the multisig wallets. In essence, Validators operate a virtual AMM system for swapping liquid assets.
            </p>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="what-much">
          <AccordionTrigger>
            <p>What is included in the fees?</p>
          </AccordionTrigger>
          <AccordionContent className="gap-[4px] grid">
            <div className="flex items-center justify-between [&>p]:text-[14px]">
              <p className="text-gray-400">Deposit Gas Fee</p>
              <p>Varies by chain</p>
            </div>
            <div className="flex items-center justify-between [&>p]:text-[14px]">
              <p className="text-gray-400">Liquidity Fee</p>
              <p>20%</p>
            </div>
            <div className="flex items-center justify-between [&>p]:text-[14px]">
              <p className="text-gray-400">Network Fee</p>
              <p>10%</p>
            </div>
            <div className="flex items-center justify-between [&>p]:text-[14px]">
              <p className="text-gray-400">Broadcast Fee</p>
              <p>Varies by chain</p>
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="how-long">
          <AccordionTrigger>
            <p>How long does the swap take?</p>
          </AccordionTrigger>
          <AccordionContent>
            <p className="text-[14px] text-gray-400 leading-[18px]">
              During a swap, the transactions into and out of Chainflip are on-chain, so the time depends on the speed
              of the blockchains involved.
              <br />
              <br />
              Typically, the new asset should reach the user's wallet within 5 minutes. This is significantly faster
              than existing bridges and faster than the average centralised exchange.
            </p>
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      <p className="mt-[16px] text-[12px] text-gray-400">
        Still need help? Reach out to us in our{' '}
        <Link className="text-primary" target="_blank" to="https://discord.gg/talisman">
          Discord Channel
        </Link>
        .
      </p>
    </div>
  )
}
