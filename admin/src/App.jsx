import { useContext } from 'react'
import { Route, Routes, Navigate } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

import Navbar from './components/Navbar.jsx'
import Sidebar from './components/Sidebar.jsx'

import Login from './pages/Login.jsx'
import Dashboard from './pages/Admin/Dashboard.jsx'
import ControlMotoare from './pages/Admin/ControlMotoare.jsx'
import IstoricTelemetrie from './pages/Admin/IstoricTelemetrie.jsx'
import ConfigurarePanou from './pages/Admin/ConfigurarePanou.jsx'

import { SolarAdminContext } from './context/SolarAdminContext.jsx'

const App = () => {
  const { aToken } = useContext(SolarAdminContext)

  return aToken ? (
    <div className='bg-[#F8F9FD] min-h-screen'>
      <ToastContainer />
      <Navbar />
      <div className='flex items-start'>
        <Sidebar />
        <Routes>
          <Route path='/' element={<Navigate to='/dashboard' replace />} />
          <Route path='/dashboard' element={<Dashboard />} />
          <Route path='/control-manual' element={<ControlMotoare />} />
          <Route path='/istoric-telemetrie' element={<IstoricTelemetrie />} />
          <Route path='/configurare-hardware' element={<ConfigurarePanou />} />
        </Routes>
      </div>
    </div>
  ) : (
    <>
      <Login />
      <ToastContainer />
    </>
  )
}

export default App