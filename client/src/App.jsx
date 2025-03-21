import './App.css'
import HomePage from './pages/HomePage/HomePage'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/about" element={<div>Test</div>} />
        <Route path="/" element={<HomePage />} />
      </Routes>
    </Router>
  )
}

export default App
