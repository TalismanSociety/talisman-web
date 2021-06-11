import { BrowserRouter as Router } from "react-router-dom";
import Layout from './layout'
import Routes from '@routes'
import TalismanProvider from '@libs/talisman'
import ThemeProvider from "./App.Theme"

const App:React.FC = () =>  
  <TalismanProvider>
    <Router> 
      <ThemeProvider>
        <Layout>
          <Routes/>
        </Layout>
      </ThemeProvider>
    </Router>
  </TalismanProvider>

export default App;