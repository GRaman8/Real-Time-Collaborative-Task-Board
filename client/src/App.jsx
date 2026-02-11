import { Outlet } from 'react-router-dom'
import Navbar from './components/layout/Navbar.jsx'

export default function App() {
  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <Outlet />
    </div>
  )
}