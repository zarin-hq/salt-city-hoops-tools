import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import App from './App'
import StyleGuide from './StyleGuide'
import FreeAgency from './pages/FreeAgency'
import DraftHistory from './pages/DraftHistory'
import DraftGuide from './pages/DraftGuide'
import Layout from './components/Layout'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/lottery-watch" element={<App />} />
          <Route path="/free-agency-simulator" element={<FreeAgency />} />
          {/* Redirects for old routes */}
          <Route path="/jazz-lottery-watch" element={<Navigate to="/lottery-watch" replace />} />
          <Route path="/free-agency" element={<Navigate to="/free-agency-simulator" replace />} />
          <Route path="/draft-history" element={<DraftHistory />} />
          <Route path="/draft-guide" element={<DraftGuide />} />
        </Route>
        <Route path="/style-guide" element={<StyleGuide />} />
        <Route path="/" element={<Navigate to="/lottery-watch" replace />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
)
