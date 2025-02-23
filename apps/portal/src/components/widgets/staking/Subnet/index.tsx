import { Chart } from './Chart'

// import { SubnetBarChart } from './SubnetBarChart'
// import { SubnetChart } from './SubnetChart'

const prices: [number, number][] = Array.from({ length: 10 }, (_, i) => {
  // Create a timestamp starting from the current Unix timestamp (in seconds)
  const timestamp = Math.floor(Date.now() / 1000) + i * 86400 // each subsequent day
  // Generate a random price between 10 and 100
  const price = Math.random() * 90 + 10
  return [timestamp, price]
})

export const Subnet = () => {
  return (
    <div>
      {/* <SubnetBarChart />
      <SubnetChart /> */}
      <Chart
        prices={prices}
        timespan={'D'}
        variant={'large'}
        onHoverValueChange={() => console.log('set hoverred value')}
      />
    </div>
  )
}
