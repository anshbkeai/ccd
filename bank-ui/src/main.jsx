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
import Home from './pages/Home.jsx'
import Architecture from './pages/Architecture.jsx'
import conf from './conf/conf.js'


const route = createBrowserRouter(
  createRoutesFromElements(
    <Route path='/' element={<App />} > 
        <Route path='scan' element={<ScannerPage />}/>
        <Route path='/login' element={<Login />}/>
         <Route path='/dashboard' element={<DashBoard />}/>
         <Route path='/topay' element={<Payment />}/>
         <Route path='/bank' element={<Bank />}/>
          <Route path='/home' element={<Home />}/>
          <Route path='/arch' element={<Architecture />}/>
    </Route>
  )
)
async function init() {
  try {
    const resp = await fetch('config.json');
    const data = await resp.json();
    globalThis.RUNTIME_CONFIG = data;
    conf.backendUrl = data.BACKEND_URL;
    console.log('Loaded config:', data);


    console.log(conf);
    
    // Only start React after config is ready
    createRoot(document.getElementById('root')).render(
      <StrictMode>
        <RouterProvider router={route} />
      </StrictMode>
    );
  } catch (error) {
    console.warn('⚠️ Error fetching config.json:', error);

    // fallback in case fetch fails
    globalThis.RUNTIME_CONFIG = {};

    // still start React so app doesn’t hang
    createRoot(document.getElementById('root')).render(
      <StrictMode>
        <RouterProvider router={route} />
      </StrictMode>
    );
  }
}

// ✅ Start app
init();
