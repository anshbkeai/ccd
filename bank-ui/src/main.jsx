import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider } from 'react-router-dom'
import Test from './pages/test.jsx'
import ScannerPage from './pages/test.jsx'
import Login from './pages/Login.jsx'
import DashBoard from './pages/DashBoard.jsx'
import Payment from './pages/Payment.jsx'
import Bank from './pages/Bank.jsx'

const route = createBrowserRouter(
  createRoutesFromElements(
    <Route path='/' element={<App />} > 
        <Route path='scan' element={<ScannerPage />}/>
        <Route path='/login' element={<Login />}/>
         <Route path='/dashboard' element={<DashBoard />}/>
         <Route path='/topay' element={<Payment />}/>
         <Route path='/bank' element={<Bank />}/>
    </Route>
  )
)
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={route} />
  </StrictMode>,
)
