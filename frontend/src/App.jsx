import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import FranchisesPage from './components/pages/FranchisesPage';
import BranchesPage from './components/pages/BranchesPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/franchises" replace />} />
        <Route path="/franchises" element={<FranchisesPage />} />
        <Route path="/branches" element={<BranchesPage />} />
        {/* Products page will be added later */}
        <Route path="/products" element={<div>Products Page - Coming Soon</div>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;