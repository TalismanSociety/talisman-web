import StakeProvidersTable from './components/StakeProvidersTable'
import useProvidersData from './hooks/useProvidersData'

export const StakeProviders = () => {
  const dataQuery = useProvidersData()

  return <StakeProvidersTable dataQuery={dataQuery} />
}
