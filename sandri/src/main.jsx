import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import Login from './login/Login';
import Signup from './signup/Signup';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
    <Login />
    <Signup />
  </StrictMode>,
)
