import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

import { GoogleOAuthProvider } from "@react-oauth/google";

ReactDOM.createRoot(document.getElementById('root')).render(
  <GoogleOAuthProvider clientId='856573888795-frc9poaenv74g2uji9i8scqbnq29sg2a.apps.googleusercontent.com'>
    <App />
  </GoogleOAuthProvider>
);
