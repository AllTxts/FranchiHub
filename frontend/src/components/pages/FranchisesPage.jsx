import { useState, useEffect } from 'react';
import { FaStore, FaCodeBranch, FaBox, FaExclamationTriangle } from 'react-icons/fa';
import Layout from '../layout/Layout';
import StatCard from '../common/StatCard';
import SearchBar from '../common/SearchBar';
import FranchiseTable from '../franchises/FranchiseTable';
import NewFranchiseModal from '../franchises/NewFranchiseModal';
import { franchiseService } from '../../services/franchiseService';

const FranchisesPage = () => {
  const [franchises, setFranchises] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [stats, setStats] = useState({
    totalFranchises: 0,
    totalBranches: 0,
    totalProducts: 0,
    lowStock: 0
  });

  // Load franchises when component mounts
  useEffect(() => {
    loadFranchises();
  }, []);

  const loadFranchises = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const data = await franchiseService.getAll();
      console.log('Franchises loaded:', data);
      
      // Transform data to match our frontend structure
      const formattedFranchises = data.map(f => ({
        id: f.id,
        name: f.name,
        branches: f.branchesCount || 0 // This will come from API later
      }));
      
      setFranchises(formattedFranchises);
      
      // Update stats
      setStats(prev => ({
        ...prev,
        totalFranchises: data.length
      }));
      
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
      console.log('Franchise created:', created);
      
      // Add new franchise to the list
      setFranchises([...franchises, { 
        id: created.id, 
        name: created.name,
        branches: 0 
      }]);
      
      // Update stats
      setStats(prev => ({
        ...prev,
        totalFranchises: prev.totalFranchises + 1
      }));
      
    } catch (err) {
      if (err.response?.status === 409) {
        setError('A franchise with this name already exists');
      } else {
        setError('Failed to create franchise');
      }
      console.error('Error creating franchise:', err);
    }
  };

  const handleView = (id) => {
    console.log('View franchise:', id);
    // Navigate to franchise details
  };

  const handleEdit = (id) => {
    console.log('Edit franchise:', id);
    // Open edit modal
  };

  const handleSearch = () => {
    // Client-side filtering for now
    console.log('Searching for:', searchTerm);
  };

  // Filter franchises based on search term
  const filteredFranchises = franchises.filter(f =>
    f.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Loading state
  if (loading) {
    return (
      <Layout>
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
    <Layout>
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

      {/* Stats Cards - Using real data where available */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="TOTAL FRANCHISES"
          value={stats.totalFranchises}
          icon={<FaStore className="text-blue-500" size={24} />}
          bgColor="bg-blue-100"
        />
        <StatCard
          title="TOTAL BRANCHES"
          value={stats.totalBranches || 13}
          subtitle="+3 this month"
          icon={<FaCodeBranch className="text-green-500" size={24} />}
          bgColor="bg-green-100"
        />
        <StatCard
          title="TOTAL PRODUCTS"
          value={stats.totalProducts || 51}
          subtitle="+8 this month"
          icon={<FaBox className="text-purple-500" size={24} />}
          bgColor="bg-purple-100"
        />
        <StatCard
          title="LOW STOCK"
          value={stats.lowStock || 3}
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
              onClick={() => setIsModalOpen(true)}
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
        />
      )}

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