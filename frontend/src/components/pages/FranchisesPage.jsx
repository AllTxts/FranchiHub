import { useState, useEffect } from 'react';
import { FaStore, FaCodeBranch, FaBox, FaExclamationTriangle } from 'react-icons/fa';
import Layout from '../layout/Layout';
import StatCard from '../common/StatCard';
import SearchBar from '../common/SearchBar';
import FranchiseTable from '../franchises/FranchiseTable';
import NewFranchiseModal from '../franchises/NewFranchiseModal';
import EditFranchiseModal from '../franchises/EditFranchiseModal';
import ConfirmModal from '../common/ConfirmModal';
import { franchiseService } from '../../services/franchiseService';
import { branchService } from '../../services/branchService';
import { productService } from '../../services/productService';

const FranchisesPage = () => {
  const [franchises, setFranchises] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isNewModalOpen, setIsNewModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedFranchise, setSelectedFranchise] = useState(null);
  const [stats, setStats] = useState({
    totalFranchises: 0,
    totalBranches: 0,
    totalProducts: 0,
    lowStock: 0
  });

  useEffect(() => {
    loadFranchises();
  }, []);

  const loadFranchises = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const [franchisesData, branchesData, productsData] = await Promise.all([
        franchiseService.getAll(),
        branchService.getAll(),
        productService.getAll()
      ]);
      
      const branchesCount = branchesData.reduce((acc, branch) => {
        acc[branch.franchiseId] = (acc[branch.franchiseId] || 0) + 1;
        return acc;
      }, {});
      
      const formattedFranchises = franchisesData.map(f => ({
        id: f.id,
        name: f.name,
        branches: branchesCount[f.id] || 0
      }));
      
      setFranchises(formattedFranchises);
      
      const lowStockProducts = productsData.filter(p => p.stock > 0 && p.stock <= 10).length;
      
      setStats({
        totalFranchises: franchisesData.length,
        totalBranches: branchesData.length,
        totalProducts: productsData.length,
        lowStock: lowStockProducts
      });
      
    } catch (err) {
      setError('Failed to load franchises. Is the backend running?');
      console.error('Error loading franchises:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateFranchise = async (newFranchise) => {
    try {
      setError(null);
      const created = await franchiseService.create(newFranchise);
      
      setFranchises([...franchises, { 
        id: created.id, 
        name: created.name,
        branches: 0 
      }]);
      
      setStats(prev => ({
        ...prev,
        totalFranchises: prev.totalFranchises + 1
      }));
      
      setIsNewModalOpen(false);
      
    } catch (err) {
      if (err.response?.status === 409) {
        setError('A franchise with this name already exists');
      } else {
        setError('Failed to create franchise');
      }
      console.error('Error creating franchise:', err);
    }
  };

  const handleEditFranchise = async (id, franchiseData) => {
    try {
      setError(null);
      await franchiseService.update(id, franchiseData);
      
      // Update local state
      const updatedFranchises = franchises.map(f => 
        f.id === id ? { ...f, name: franchiseData.name } : f
      );
      setFranchises(updatedFranchises);
      
      setIsEditModalOpen(false);
      setSelectedFranchise(null);
      
    } catch (err) {
      if (err.response?.status === 409) {
        setError('A franchise with this name already exists');
      } else {
        setError('Failed to update franchise');
      }
      console.error('Error updating franchise:', err);
    }
  };

  const handleDeleteFranchise = async () => {
    if (!selectedFranchise) return;
    
    try {
      setError(null);
      await franchiseService.delete(selectedFranchise.id);
      
      // Remove from local state
      const updatedFranchises = franchises.filter(f => f.id !== selectedFranchise.id);
      setFranchises(updatedFranchises);
      
      // Update stats
      setStats(prev => ({
        ...prev,
        totalFranchises: prev.totalFranchises - 1,
        totalBranches: prev.totalBranches - selectedFranchise.branches
      }));
      
      setIsDeleteModalOpen(false);
      setSelectedFranchise(null);
      
    } catch (err) {
      setError('Failed to delete franchise');
      console.error('Error deleting franchise:', err);
    }
  };

  const handleView = (id) => {
    console.log('View franchise:', id);
    // Aquí podrías navegar a una página de detalle
    alert(`View franchise ${id} - This would show franchise details`);
  };

  const handleEdit = (id) => {
    const franchise = franchises.find(f => f.id === id);
    setSelectedFranchise(franchise);
    setIsEditModalOpen(true);
  };

  const handleDelete = (franchise) => {
    setSelectedFranchise(franchise);
    setIsDeleteModalOpen(true);
  };

  const handleSearch = () => {
    // Client-side filtering
    console.log('Searching for:', searchTerm);
  };

  const filteredFranchises = franchises.filter(f =>
    f.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <Layout currentPage="franchises">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading franchises...</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout currentPage="franchises">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">FRANCHISES</h1>
        <p className="text-gray-600">FranchiHub/franchises</p>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg flex items-center justify-between">
          <span>{error}</span>
          <button 
            onClick={() => setError(null)}
            className="text-red-700 hover:text-red-900"
          >
            ✕
          </button>
        </div>
      )}

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
          subtitle={`Across ${stats.totalFranchises} franchises`}
          icon={<FaCodeBranch className="text-green-500" size={24} />}
          bgColor="bg-green-100"
        />
        <StatCard
          title="TOTAL PRODUCTS"
          value={stats.totalProducts}
          subtitle={`In ${stats.totalBranches} branches`}
          icon={<FaBox className="text-purple-500" size={24} />}
          bgColor="bg-purple-100"
        />
        <StatCard
          title="LOW STOCK"
          value={stats.lowStock}
          subtitle="Products need attention"
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
          onClick={() => setIsNewModalOpen(true)}
          className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 flex items-center transition-colors"
        >
          + New Franchise
        </button>
      </div>

      {/* Franchises Table */}
      {filteredFranchises.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-12 text-center">
          <FaStore className="mx-auto text-gray-400 text-5xl mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No franchises found</h3>
          <p className="text-gray-500 mb-4">
            {searchTerm ? 'Try a different search term' : 'Get started by creating your first franchise'}
          </p>
          {!searchTerm && (
            <button
              onClick={() => setIsNewModalOpen(true)}
              className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 inline-flex items-center"
            >
              + New Franchise
            </button>
          )}
        </div>
      ) : (
        <FranchiseTable
          franchises={filteredFranchises}
          onView={handleView}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      )}

      {/* Modals */}
      <NewFranchiseModal
        isOpen={isNewModalOpen}
        onClose={() => setIsNewModalOpen(false)}
        onCreate={handleCreateFranchise}
      />

      <EditFranchiseModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedFranchise(null);
        }}
        onEdit={handleEditFranchise}
        franchise={selectedFranchise}
      />

      <ConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setSelectedFranchise(null);
        }}
        onConfirm={handleDeleteFranchise}
        title="Delete Franchise"
        message={`Are you sure you want to delete "${selectedFranchise?.name}"? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
      />
    </Layout>
  );
};

export default FranchisesPage;