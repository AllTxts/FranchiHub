import { useState, useEffect } from 'react';
import { FaStore, FaCodeBranch, FaBox, FaExclamationTriangle } from 'react-icons/fa';
import Layout from '../layout/Layout';
import StatCard from '../common/StatCard';
import SearchBar from '../common/SearchBar';
import BranchTable from '../branches/BranchTable';
import NewBranchModal from '../branches/NewBranchModal';
import { branchService } from '../../services/branchService';
import { franchiseService } from '../../services/franchiseService';

const BranchesPage = () => {
  const [branches, setBranches] = useState([]);
  const [franchises, setFranchises] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [stats, setStats] = useState({
    totalBranches: 0,
    avgProducts: 0,
    active: 0,
    stockAlerts: 0
  });

  // Load data when component mounts
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Load both branches and franchises in parallel
      const [branchesData, franchisesData] = await Promise.all([
        branchService.getAll(),
        franchiseService.getAll()
      ]);
      
      console.log('Branches loaded:', branchesData);
      console.log('Franchises loaded:', franchisesData);
      
      // Create a map of franchise names for quick lookup
      const franchiseMap = franchisesData.reduce((map, f) => {
        map[f.id] = f.name;
        return map;
      }, {});
      
      // Format branches with franchise names and product counts
      const formattedBranches = branchesData.map(b => ({
        id: b.id,
        name: b.name,
        franchiseId: b.franchiseId,
        franchiseName: franchiseMap[b.franchiseId] || 'Unknown',
        products: b.productsCount || Math.floor(Math.random() * 30) + 5 // Temporary random data
      }));
      
      setBranches(formattedBranches);
      setFranchises(franchisesData);
      
      // Calculate stats
      const totalProducts = formattedBranches.reduce((sum, b) => sum + b.products, 0);
      const avgProducts = formattedBranches.length > 0 
        ? Math.round(totalProducts / formattedBranches.length) 
        : 0;
      
      setStats({
        totalBranches: formattedBranches.length,
        avgProducts: avgProducts,
        active: formattedBranches.length, // All operational for now
        stockAlerts: Math.floor(Math.random() * 5) + 1 // Random for demo
      });
      
    } catch (err) {
      setError('Failed to load branches. Is the backend running?');
      console.error('Error loading branches:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateBranch = async (newBranch) => {
    try {
      setError(null);
      const created = await branchService.create(newBranch);
      console.log('Branch created:', created);
      
      // Find franchise name
      const franchise = franchises.find(f => f.id === created.franchiseId);
      
      // Add new branch to the list
      const newBranchWithDetails = {
        id: created.id,
        name: created.name,
        franchiseId: created.franchiseId,
        franchiseName: franchise?.name || 'Unknown',
        products: 0
      };
      
      setBranches([...branches, newBranchWithDetails]);
      
      // Update stats
      const newTotal = branches.length + 1;
      const totalProducts = branches.reduce((sum, b) => sum + b.products, 0);
      const newAvg = Math.round(totalProducts / newTotal);
      
      setStats(prev => ({
        ...prev,
        totalBranches: newTotal,
        avgProducts: newAvg
      }));
      
      setIsModalOpen(false);
      
    } catch (err) {
      if (err.response?.status === 409) {
        setError('A branch with this name already exists in this franchise');
      } else {
        setError('Failed to create branch');
      }
      console.error('Error creating branch:', err);
    }
  };

  const handleView = (id) => {
    console.log('View branch:', id);
    // Navigate to branch details
  };

  const handleEdit = (id) => {
    console.log('Edit branch:', id);
    // Open edit modal
  };

  const handleSearch = () => {
    console.log('Searching for:', searchTerm);
  };

  // Filter branches based on search term
  const filteredBranches = branches.filter(b =>
    b.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    b.franchiseName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Loading state
  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading branches...</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout currentPage="branches">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">BRANCHES</h1>
        <p className="text-gray-600">FranchiHub/branches</p>
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
          title="TOTAL BRANCHES"
          value={stats.totalBranches}
          subtitle={`Across ${franchises.length} franchises`}
          icon={<FaCodeBranch className="text-blue-500" size={24} />}
          bgColor="bg-blue-100"
        />
        <StatCard
          title="AVG PRODUCTS"
          value={stats.avgProducts}
          subtitle="per branch"
          icon={<FaBox className="text-green-500" size={24} />}
          bgColor="bg-green-100"
        />
        <StatCard
          title="ACTIVE"
          value={stats.active}
          subtitle="All operational"
          icon={<FaStore className="text-purple-500" size={24} />}
          bgColor="bg-purple-100"
        />
        <StatCard
          title="STOCK ALERTS"
          value={stats.stockAlerts}
          subtitle={`In ${stats.stockAlerts} branches`}
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
            placeholder="Search branches..."
          />
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 flex items-center transition-colors"
        >
          + New Branch
        </button>
      </div>

      {/* Branches Table */}
      {filteredBranches.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-12 text-center">
          <FaCodeBranch className="mx-auto text-gray-400 text-5xl mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No branches found</h3>
          <p className="text-gray-500 mb-4">
            {searchTerm ? 'Try a different search term' : 'Get started by creating your first branch'}
          </p>
          {!searchTerm && (
            <button
              onClick={() => setIsModalOpen(true)}
              className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 inline-flex items-center"
            >
              + New Branch
            </button>
          )}
        </div>
      ) : (
        <BranchTable
          branches={filteredBranches}
          onView={handleView}
          onEdit={handleEdit}
        />
      )}

      {/* New Branch Modal */}
      <NewBranchModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onCreate={handleCreateBranch}
        franchises={franchises}
      />
    </Layout>
  );
};

export default BranchesPage;