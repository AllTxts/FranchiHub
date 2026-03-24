import { useState, useEffect } from 'react';
import { FaStore, FaCodeBranch, FaBox, FaExclamationTriangle } from 'react-icons/fa';
import Layout from '../layout/Layout';
import StatCard from '../common/StatCard';
import SearchBar from '../common/SearchBar';
import BranchTable from '../branches/BranchTable';
import NewBranchModal from '../branches/NewBranchModal';
import EditBranchModal from '../branches/EditBranchModal';
import ConfirmModal from '../common/ConfirmModal';
import ViewDetailsModal from '../common/ViewDetailsModal';
import { branchService } from '../../services/branchService';
import { franchiseService } from '../../services/franchiseService';
import { productService } from '../../services/productService';

// Main branches page component
const BranchesPage = () => {
  const [branches, setBranches] = useState([]);
  const [franchises, setFranchises] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isNewModalOpen, setIsNewModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedBranch, setSelectedBranch] = useState(null);
  const [viewItem, setViewItem] = useState(null);
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

  // Fetch all data from API
  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Load all data in parallel
      const [branchesData, franchisesData, productsData] = await Promise.all([
        branchService.getAll(),
        franchiseService.getAll(),
        productService.getAll()
      ]);
      
      console.log('Branches loaded:', branchesData);
      console.log('Franchises loaded:', franchisesData);
      console.log('Products loaded:', productsData);
      
      // Count products per branch
      const productsPerBranch = productsData.reduce((acc, product) => {
        acc[product.branchId] = (acc[product.branchId] || 0) + 1;
        return acc;
      }, {});
      
      // Create a map of franchise names for quick lookup
      const franchiseMap = franchisesData.reduce((map, f) => {
        map[f.id] = f.name;
        return map;
      }, {});
      
      // Format branches with franchise names and REAL product counts
      const formattedBranches = branchesData.map(b => ({
        id: b.id,
        name: b.name,
        franchiseId: b.franchiseId,
        franchiseName: franchiseMap[b.franchiseId] || 'Unknown',
        products: productsPerBranch[b.id] || 0
      }));
      
      setBranches(formattedBranches);
      setFranchises(franchisesData);
      
      // Calculate REAL stats
      const totalProducts = formattedBranches.reduce((sum, b) => sum + b.products, 0);
      const avgProducts = formattedBranches.length > 0 
        ? Math.round(totalProducts / formattedBranches.length) 
        : 0;
      
      // Count branches with low stock products
      const branchesWithLowStock = new Set();
      productsData.forEach(product => {
        if (product.stock > 0 && product.stock <= 10) {
          branchesWithLowStock.add(product.branchId);
        }
      });
      
      setStats({
        totalBranches: formattedBranches.length,
        avgProducts: avgProducts,
        active: formattedBranches.length, // All operational for now
        stockAlerts: branchesWithLowStock.size
      });
      
    } catch (err) {
      setError('Failed to load branches. Is the backend running?');
      console.error('Error loading branches:', err);
    } finally {
      setLoading(false);
    }
  };

  // Create new branch
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
      
      setIsNewModalOpen(false);
      
    } catch (err) {
      if (err.response?.status === 409) {
        setError('A branch with this name already exists in this franchise');
      } else {
        setError('Failed to create branch');
      }
      console.error('Error creating branch:', err);
    }
  };

  // Update existing branch
  const handleEditBranch = async (id, branchData) => {
    try {
      setError(null);
      await branchService.update(id, branchData);
      
      // Update local state
      const franchise = franchises.find(f => f.id === branchData.franchiseId);
      
      const updatedBranches = branches.map(b => 
        b.id === id ? { 
          ...b, 
          name: branchData.name,
          franchiseId: branchData.franchiseId,
          franchiseName: franchise?.name || 'Unknown'
        } : b
      );
      
      setBranches(updatedBranches);
      setIsEditModalOpen(false);
      setSelectedBranch(null);
      
    } catch (err) {
      if (err.response?.status === 409) {
        setError('A branch with this name already exists in this franchise');
      } else {
        setError('Failed to update branch');
      }
      console.error('Error updating branch:', err);
    }
  };

  // Delete branch
  const handleDeleteBranch = async () => {
    if (!selectedBranch) return;
    
    try {
      setError(null);
      await branchService.delete(selectedBranch.id);
      
      // Remove from local state
      const updatedBranches = branches.filter(b => b.id !== selectedBranch.id);
      setBranches(updatedBranches);
      
      // Update stats
      const totalProducts = updatedBranches.reduce((sum, b) => sum + b.products, 0);
      const avgProducts = updatedBranches.length > 0 
        ? Math.round(totalProducts / updatedBranches.length) 
        : 0;
      
      setStats(prev => ({
        ...prev,
        totalBranches: updatedBranches.length,
        avgProducts: avgProducts
      }));
      
      setIsDeleteModalOpen(false);
      setSelectedBranch(null);
      
    } catch (err) {
      setError('Failed to delete branch');
      console.error('Error deleting branch:', err);
    }
  };

  // Handlers for table actions
  const handleView = (id) => {
    const branch = branches.find(b => b.id === id);
    setViewItem(branch);
    setIsViewModalOpen(true);
  };

  const handleEdit = (id) => {
    const branch = branches.find(b => b.id === id);
    setSelectedBranch(branch);
    setIsEditModalOpen(true);
  };

  const handleDelete = (branch) => {
    setSelectedBranch(branch);
    setIsDeleteModalOpen(true);
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
      <Layout currentPage="branches">
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
          onClick={() => setIsNewModalOpen(true)}
          className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 flex items-center transition-colors"
        >
          + New Branch
        </button>
      </div>

      {/* Branches Table or Empty State */}
      {filteredBranches.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-12 text-center">
          <FaCodeBranch className="mx-auto text-gray-400 text-5xl mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No branches found</h3>
          <p className="text-gray-500 mb-4">
            {searchTerm ? 'Try a different search term' : 'Get started by creating your first branch'}
          </p>
          {!searchTerm && (
            <button
              onClick={() => setIsNewModalOpen(true)}
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
          onDelete={handleDelete}
        />
      )}

      {/* Modals */}
      <NewBranchModal
        isOpen={isNewModalOpen}
        onClose={() => setIsNewModalOpen(false)}
        onCreate={handleCreateBranch}
        franchises={franchises}
      />

      <EditBranchModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedBranch(null);
        }}
        onEdit={handleEditBranch}
        branch={selectedBranch}
        franchises={franchises}
      />

      <ConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setSelectedBranch(null);
        }}
        onConfirm={handleDeleteBranch}
        title="Delete Branch"
        message={`Are you sure you want to delete "${selectedBranch?.name}"? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
      />

      <ViewDetailsModal
        isOpen={isViewModalOpen}
        onClose={() => {
          setIsViewModalOpen(false);
          setViewItem(null);
        }}
        item={viewItem}
        type="branch"
      />
    </Layout>
  );
};

export default BranchesPage;