import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import FranchisesPage from './components/pages/FranchisesPage';
import BranchesPage from './components/pages/BranchesPage';
import ProductsPage from './components/pages/ProductsPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/franchises" replace />} />
        <Route path="/franchises" element={<FranchisesPage />} />
        <Route path="/branches" element={<BranchesPage />} />
        <Route path="/products" element={<ProductsPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;