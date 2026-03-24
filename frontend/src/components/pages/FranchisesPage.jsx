import { useState } from 'react';
import { FaStore, FaCodeBranch, FaBox, FaExclamationTriangle } from 'react-icons/fa';
import Layout from '../layout/Layout';
import StatCard from '../common/StatCard';
import SearchBar from '../common/SearchBar';
import FranchiseTable from '../franchises/FranchiseTable';
import NewFranchiseModal from '../franchises/NewFranchiseModal';

const FranchisesPage = () => {
  const [franchises, setFranchises] = useState([
    { id: 1, name: 'BurgerZone', branches: 4 },
    { id: 2, name: 'PizzaCraft', branches: 7 },
    { id: 3, name: 'TacoWorld', branches: 2 },
  ]);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Estadísticas quemadas como en la imagen
  const stats = {
    totalFranchises: 3,
    totalBranches: 13,
    totalProducts: 51,
    lowStock: 3
  };

  const filteredFranchises = franchises.filter(f =>
    f.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCreateFranchise = (newFranchise) => {
    const newId = Math.max(...franchises.map(f => f.id), 0) + 1;
    const franchiseWithId = { ...newFranchise, id: newId, branches: 0 };
    setFranchises([...franchises, franchiseWithId]);
  };

  const handleView = (id) => {
    console.log('View franchise:', id);
    // Aquí iría la navegación a la vista de detalles
  };

  const handleEdit = (id) => {
    console.log('Edit franchise:', id);
    // Aquí iría la lógica de edición
  };

  const handleSearch = () => {
    console.log('Searching for:', searchTerm);
    // Aquí iría la búsqueda en API
  };

  return (
    <Layout>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">FRANCHISES</h1>
        <p className="text-gray-600">FranchiHub/franchises</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="TOTAL FRANCHISES"
          value={stats.totalFranchises}
          icon={<FaStore className="text-blue-500" size={24} />}
          bgColor="bg-blue-100"
        />
        <StatCard
          title="TOTAL BRANCHES"
          value={stats.totalBranches}
          subtitle="+3 this month"
          icon={<FaCodeBranch className="text-green-500" size={24} />}
          bgColor="bg-green-100"
        />
        <StatCard
          title="TOTAL PRODUCTS"
          value={stats.totalProducts}
          subtitle="+8 this month"
          icon={<FaBox className="text-purple-500" size={24} />}
          bgColor="bg-purple-100"
        />
        <StatCard
          title="LOW STOCK"
          value={stats.lowStock}
          subtitle="Needs attention"
          icon={<FaExclamationTriangle className="text-yellow-500" size={24} />}
          bgColor="bg-yellow-100"
        />
      </div>

      {/* Search and New Button */}
      <div className="flex justify-between items-center mb-6">
        <div className="w-96">
          <SearchBar
            value={searchTerm}
            onChange={setSearchTerm}
            onSearch={handleSearch}
            placeholder="Search franchises..."
          />
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 flex items-center"
        >
          + New Franchise
        </button>
      </div>

      {/* Franchises Table */}
      <FranchiseTable
        franchises={filteredFranchises}
        onView={handleView}
        onEdit={handleEdit}
      />

      {/* New Franchise Modal */}
      <NewFranchiseModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onCreate={handleCreateFranchise}
      />
    </Layout>
  );
};

export default FranchisesPage;