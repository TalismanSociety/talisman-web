import { Text } from '@talismn/ui'

// const filtersState = selector({
//   key: 'History/Filters',
//   get: async () =>
//     await request(
//       import.meta.env.REACT_APP_EX_HISTORY_INDEXER,
//       graphql(`
//         query filters {
//           modules
//           chains {
//             genesisHash
//             name
//             logo
//           }
//         }
//       `)
//     ),
// })

// const LabelledInput = (props: PropsWithChildren & { label?: ReactNode }) => (
//   <Text.BodySmall as="label" css={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
//     <div>{props.label ?? <wbr />}</div>
//     {props.children}
//   </Text.BodySmall>
// )

// const History = () => {
//   const selectedAccounts = useRecoilValue(selectedAccountsState)
//   const { chains, modules } = useRecoilValue(filtersState)

//   const [search, setSearch] = useState('')
//   const [chain, setChain] = useState<string>()
//   const [module, setModule] = useState<string>()
//   const [fromDate, setFromDate] = useState<Date>()
//   const [toDate, setToDate] = useState<Date>()
//   const [dateOrder, setDateOrder] = useState<'asc' | 'desc'>('desc')

//   const searchAddress = useMemo(
//     () => tryParseSubstrateOrEthereumAddress(search, { acceptSubstratePublicKey: false }),
//     [search]
//   )
//   const searchAddressOrHash = useMemo(
//     () =>
//       searchAddress !== undefined
//         ? { accounts: [{ address: searchAddress }] }
//         : isHex(search)
//         ? { hash: search }
//         : { accounts: selectedAccounts },
//     [search, searchAddress, selectedAccounts]
//   )
//   const searchValidationError = useMemo(() => {
//     if (search !== '' && searchAddress === undefined && !isHex(search)) {
//       return 'Must be valid address or hash'
//     }

//     return undefined
//   }, [search, searchAddress])

//   const today = useMemo(() => new Date(), [])

//   return (
//     <section>
//       <TitlePortal>Transaction history</TitlePortal>
//       <div css={{ marginBottom: '1.6rem' }}>
//         <header
//           css={{
//             display: 'flex',
//             justifyContent: 'flex-end',
//             marginBottom: '2.4rem',
//           }}
//         ></header>
//         <div
//           css={{
//             display: 'flex',
//             justifyContent: 'space-between',
//             alignItems: 'flex-start',
//             flexWrap: 'wrap',
//             gap: '0.8rem',
//           }}
//         >
//           <LabelledInput>
//             <SearchBar
//               placeholder="Paste account address or TX hash"
//               value={search}
//               onChangeText={setSearch}
//               leadingSupportingText={<TextInput.ErrorLabel>{searchValidationError}</TextInput.ErrorLabel>}
//             />
//           </LabelledInput>
//           <div css={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '0.8rem' }}>
//             <LabelledInput label="Chain">
//               <Select
//                 placeholder={
//                   <>
//                     <Globe size="1em" css={{ verticalAlign: '-0.1em' }} /> Chain
//                   </>
//                 }
//                 value={chain}
//                 onChange={setChain}
//                 clearRequired
//                 detached
//               >
//                 {chains.map(x => (
//                   <Select.Option
//                     key={x.genesisHash}
//                     value={x.genesisHash}
//                     leadingIcon={
//                       <img
//                         alt={x.name ?? undefined}
//                         src={x.logo ?? undefined}
//                         css={{ width: '1.6rem', height: '1.6rem' }}
//                       />
//                     }
//                     headlineContent={x.name}
//                   />
//                 ))}
//               </Select>
//             </LabelledInput>
//             <LabelledInput label="Module">
//               <Select
//                 placeholder={
//                   <>
//                     <Codepen size="1em" css={{ verticalAlign: '-0.1em' }} /> Module
//                   </>
//                 }
//                 value={module}
//                 onChange={setModule}
//                 clearRequired
//                 detached
//               >
//                 {modules.map(x => (
//                   <Select.Option key={x} value={x} headlineContent={x} />
//                 ))}
//               </Select>
//             </LabelledInput>
//             <div css={{ display: 'flex', alignItems: 'center', gap: '0.8rem', flexWrap: 'wrap' }}>
//               <LabelledInput label="From date">
//                 <DateInput
//                   value={fromDate}
//                   max={toDate ?? today}
//                   onChangeDate={x => setFromDate(Maybe.of(x).mapOrUndefined(startOfDay))}
//                   css={{ padding: '1.1rem' }}
//                 />
//               </LabelledInput>
//               <LabelledInput label="To date">
//                 <DateInput
//                   value={toDate}
//                   max={today}
//                   onChangeDate={x => setToDate(Maybe.of(x).mapOrUndefined(endOfDay))}
//                   css={{ padding: '1.1rem' }}
//                 />
//               </LabelledInput>
//             </div>
//             <div>
//               <LabelledInput label="Order by">
//                 <Select value={dateOrder} onChange={setDateOrder}>
//                   <Select.Option value="desc" headlineContent="Newest" />
//                   <Select.Option value="asc" headlineContent="Oldest" />
//                 </Select>
//               </LabelledInput>
//             </div>
//           </div>
//         </div>
//       </div>
//       {searchValidationError === undefined && (
//         <HistoryWidget
//           {...searchAddressOrHash}
//           chain={chain}
//           module={module}
//           timestampGte={fromDate}
//           timestampLte={toDate}
//           timestampOrder={dateOrder}
//           withExportFloatingActionButton
//         />
//       )}
//     </section>
//   )
// }

// export default () => (
//   <ErrorBoundary>
//     <Suspense
//       fallback={
//         <div css={{ display: 'flex', justifyContent: 'center' }}>
//           <TalismanHandLoader />
//         </div>
//       }
//     >
//       <History />
//     </Suspense>
//   </ErrorBoundary>
// )

export default () => (
  <section className="flex min-h-[50vh] flex-col items-center justify-center gap-4">
    <Text.H3>Transaction history is deprecated due to an increase in infrastructure cost</Text.H3>
    <Text.BodyLarge>
      To view your transaction history, we recommend{' '}
      <Text.Noop.A href="https://www.subscan.io/" target="_blank" rel="noreferrer noopener">
        Subscan
      </Text.Noop.A>{' '}
      and{' '}
      <Text.Noop.A href="https://etherscan.io/" target="_blank" rel="noreferrer noopener">
        Etherscan
      </Text.Noop.A>
      .
    </Text.BodyLarge>
  </section>
)
