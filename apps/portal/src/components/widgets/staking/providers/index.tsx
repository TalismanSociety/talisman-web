import StakeProvidersTable from './components/StakeProvidersTable'
import useProvidersData from './hooks/useProvidersData'

const StakeProviders = () => {
  const dataQuery = useProvidersData()

  return <StakeProvidersTable dataQuery={dataQuery} />
}

export default StakeProviders
