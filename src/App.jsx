import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/home';
import HealthCare from './pages/healthCare';
import DataTables from './pages/healthCareDataTables';
// Import other components for respective pages

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/health-care" element={<HealthCare />} />
        <Route path="/health-care/data-tables" element={<DataTables />} />
        {/* Add other routes here */}
      </Routes>
    </Router>
  );
};

export default App;
