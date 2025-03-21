import './App.css'
import AdminDashboard from './app/components/AdminDashboard/AdminDashboard';
import UserDashboard from './app/components/UserDashboard/UserDashboard';
import ReportStatus from './app/components/UserDashboard/ReportStatus';
import EditReport from './app/components/UserDashboard/EditReport'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import NewReport from './app/components/UserDashboard/NewReport';
import Home from './app/pages/Home';
import ReportsPage from './app/pages/ReportsPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home/>} />
        <Route path="/ReportStatus/:reportId" element={<ReportStatus />} />
        <Route path="/EditReport/:reportId" element={<EditReport />} />
        <Route path="/NewReport" element={<NewReport/>}/>
        <Route path="/ReportsPage" element={<ReportsPage />}/>
      </Routes>
    </Router>
  )
}

export default App
