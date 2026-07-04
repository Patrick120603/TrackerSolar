import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { BrowserRouter } from 'react-router-dom'
import SolarAdminContextProvider from './context/SolarAdminContext.jsx'
import HardwareControlContextProvider from './context/HardwareControlContext.jsx'
import SolarAppContextProvider from './context/SolarAppContext.jsx'

ReactDOM.createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <SolarAdminContextProvider>
      <HardwareControlContextProvider>
        <SolarAppContextProvider>
          <App />
        </SolarAppContextProvider>
      </HardwareControlContextProvider>
    </SolarAdminContextProvider>
  </BrowserRouter>,
)