import { Check, Copy } from '@talismn/icons'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '../../../components/ui/accordion'
import { useEffect, useState } from 'react'

type Props = {
  name: React.ReactNode
  icon: React.ReactNode
  extraTriggerContent?: React.ReactNode
  hash?: string
  calldata?: string
  expandedByDefault?: boolean
}

const CopyPasteBox: React.FC<{ content: string; label: string }> = ({ content, label }) => {
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    if (copied) {
      setTimeout(() => {
        setCopied(false)
      }, 2000)
    }
  }, [copied])

  const handleCopy = () => {
    if (copied) return
    navigator.clipboard.writeText(content)
    setCopied(true)
  }
  return (
    <div className="flex flex-col gap-[16]">
      <p className="ml-[8px] mb-[8px]">{label}</p>
      <div className="p-[16px] gap-[16px] flex items-center w-full overflow-hidden justify-between bg-gray-800 rounded-[16px]">
        <p className="whitespace-normal break-words line-clamp-2 text-[14px]" style={{ wordBreak: 'break-all' }}>
          {content}
        </p>
        {copied ? (
          <div className="text-green-500">
            <Check size={20} className="min-w-[20px]" />
          </div>
        ) : (
          <div className="hover:text-offWhite cursor-pointer" onClick={handleCopy}>
            <Copy size={20} className="min-w-[20px]" />
          </div>
        )}
      </div>
    </div>
  )
}

export const TransactionDetailsAccordion: React.FC<React.PropsWithChildren<Props>> = ({
  children,
  name,
  icon,
  extraTriggerContent,
  hash,
  calldata,
  expandedByDefault,
}) => {
  return (
    <div className="px-[16px] bg-gray-600 rounded-[16px] max-w-[100%]">
      <Accordion type="single" collapsible className="max-w-[100%]" defaultValue={expandedByDefault ? '1' : undefined}>
        <AccordionItem value="1" className="!border-b-0">
          <AccordionTrigger className="!py-[16px]">
            <div className="flex items-center justify-between w-full pr-[8px]">
              <div className="flex gap-[8px] items-center">
                <p className="text-offWhite">{name}</p>
                <div className="text-primary">{icon}</div>
              </div>
              {extraTriggerContent}
            </div>
          </AccordionTrigger>
          <AccordionContent>
            {children}
            {(calldata !== undefined || hash !== undefined) && (
              <div className="border-t border-gray-500 pt-[16px] mt-[16px] max-w-[100%] overflow-hidden flex flex-col gap-[16px]">
                {calldata !== undefined && <CopyPasteBox label="Multisig call data" content={calldata} />}
                {hash !== undefined && <CopyPasteBox label="Call hash" content={hash} />}
              </div>
            )}
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  )
}
