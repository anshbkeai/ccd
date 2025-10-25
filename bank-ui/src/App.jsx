import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import QRCode from 'react-qr-code'
import { QRCodeCanvas, QRCodeSVG } from 'qrcode.react'
import Test from './pages/test'
import { Link, Outlet, useNavigate, useNavigation } from 'react-router-dom'
function App() {
  const [count, setCount] = useState(0);
  const navigate = useNavigate();

  const go = () => {
    navigate('/scan'); // navigates to /scan route
  };
  return (
  <>
  

  <Outlet />
  </>
  )
}


export default App
