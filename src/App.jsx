
import { Route, Routes } from 'react-router-dom'
import FraudDashboard from './components/FraudDetections'
import Transactions from './components/Transactions'

const App = () => {
  return (
    <div>
      <Routes>
        <Route path='/' element={<FraudDashboard/>}/>
        <Route path="/Transactions" element={<Transactions/>}/>
      </Routes>
    </div>
  )
}

export default App