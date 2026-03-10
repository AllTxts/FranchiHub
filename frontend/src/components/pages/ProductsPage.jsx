import { useState, useEffect } from 'react';
import { FaBox, FaCheckCircle, FaExclamationTriangle, FaTimesCircle } from 'react-icons/fa';
import Layout from '../layout/Layout';
import StatCard from '../common/StatCard';
import SearchBar from '../common/SearchBar';
import ProductTable from '../products/ProductTable';
import NewProductModal from '../products/NewProductModal';
import EditProductModal from '../products/EditProductModal';
import UpdateStockModal from '../products/UpdateStockModal';
import ConfirmModal from '../common/ConfirmModal';
import ViewDetailsModal from '../common/ViewDetailsModal';
import Notification from '../common/Notification';
import { useNotification } from '../hooks/useNotification';
import { productService } from '../../services/productService';
import { branchService } from '../../services/branchService';

// Main products page component
const ProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [branches, setBranches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isNewModalOpen, setIsNewModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isStockModalOpen, setIsStockModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [viewItem, setViewItem] = useState(null);
  const { notification, showNotification, hideNotification } = useNotification();
  const [stats, setStats] = useState({
    totalProducts: 0,
    inStock: 0,
    lowStock: 0,
    outOfStock: 0
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
      
      // Load both products and branches in parallel
      const [productsData, branchesData] = await Promise.all([
        productService.getAll(),
        branchService.getAll()
      ]);
      
      console.log('Products loaded:', productsData);
      console.log('Branches loaded:', branchesData);
      
      // Create a map of branch names for quick lookup
      const branchMap = branchesData.reduce((map, b) => {
        map[b.id] = b.name;
        return map;
      }, {});
      
      // Format products with branch names
      const formattedProducts = productsData.map(p => ({
        id: p.id,
        name: p.name,
        stock: p.stock,
        branchId: p.branchId,
        branchName: branchMap[p.branchId] || 'Unknown'
      }));
      
      setProducts(formattedProducts);
      setBranches(branchesData);
      
      // Calculate stats based on stock levels
      const inStock = formattedProducts.filter(p => p.stock > 10).length;
      const lowStock = formattedProducts.filter(p => p.stock > 0 && p.stock <= 10).length;
      const outOfStock = formattedProducts.filter(p => p.stock === 0).length;
      
      setStats({
        totalProducts: formattedProducts.length,
        inStock,
        lowStock,
        outOfStock
      });
      
    } catch (err) {
      setError('Failed to load products. Is the backend running?');
      console.error('Error loading products:', err);
    } finally {
      setLoading(false);
    }
  };

  // Create new product
  const handleCreateProduct = async (newProduct) => {
    try {
      setError(null);
      const created = await productService.create(newProduct);
      console.log('Product created:', created);
      
      // Find branch name
      const branch = branches.find(b => b.id === created.branchId);
      
      // Add new product to the list
      const newProductWithDetails = {
        id: created.id,
        name: created.name,
        stock: created.stock,
        branchId: created.branchId,
        branchName: branch?.name || 'Unknown'
      };
      
      setProducts([...products, newProductWithDetails]);
      
      // Update stats
      const newStats = { ...stats };
      newStats.totalProducts++;
      if (created.stock === 0) newStats.outOfStock++;
      else if (created.stock <= 10) newStats.lowStock++;
      else newStats.inStock++;
      
      setStats(newStats);
      
      showNotification(`Product "${created.name}" created successfully!`, 'success');
      setIsNewModalOpen(false);
      
    } catch (err) {
      let errorMessage = 'Failed to create product';
      if (err.response?.status === 409) {
        errorMessage = 'A product with this name already exists in this branch';
      } else if (err.response?.data?.errors) {
        const validationErrors = err.response.data.errors;
        // Check for specific validation errors
        if (validationErrors.Name) {
          errorMessage = validationErrors.Name[0];
        } else if (validationErrors.Stock) {
          errorMessage = validationErrors.Stock[0];
        } else {
          errorMessage = Object.values(validationErrors).flat().join(', ');
        }
      } else if (err.response?.data?.title) {
        errorMessage = err.response.data.title;
      }
      
      showNotification(errorMessage, 'error');
      console.error('Error creating product:', err);
    }
  };

  // Update existing product
  const handleEditProduct = async (id, productData) => {
    try {
      setError(null);
      await productService.update(id, productData);
      
      // Find branch name
      const branch = branches.find(b => b.id === productData.branchId);
      
      // Update local state
      const updatedProducts = products.map(p => 
        p.id === id ? { 
          ...p, 
          name: productData.name,
          stock: productData.stock,
          branchId: productData.branchId,
          branchName: branch?.name || 'Unknown'
        } : p
      );
      
      setProducts(updatedProducts);
      
      // Recalculate stats
      const inStock = updatedProducts.filter(p => p.stock > 10).length;
      const lowStock = updatedProducts.filter(p => p.stock > 0 && p.stock <= 10).length;
      const outOfStock = updatedProducts.filter(p => p.stock === 0).length;
      
      setStats({
        totalProducts: updatedProducts.length,
        inStock,
        lowStock,
        outOfStock
      });
      
      showNotification(`Product updated successfully!`, 'success');
      setIsEditModalOpen(false);
      setSelectedProduct(null);
      
    } catch (err) {
      let errorMessage = 'Failed to update product';
      if (err.response?.status === 409) {
        errorMessage = 'A product with this name already exists in this branch';
      } else if (err.response?.data?.errors) {
        const validationErrors = err.response.data.errors;
        if (validationErrors.Name) {
          errorMessage = validationErrors.Name[0];
        } else if (validationErrors.Stock) {
          errorMessage = validationErrors.Stock[0];
        } else {
          errorMessage = Object.values(validationErrors).flat().join(', ');
        }
      } else if (err.response?.data?.title) {
        errorMessage = err.response.data.title;
      }
      
      showNotification(errorMessage, 'error');
      console.error('Error updating product:', err);
    }
  };

  // Update product stock
  const handleUpdateStock = async (productId, newStock) => {
    try {
      setError(null);
      const updated = await productService.updateStock(productId, newStock);
      console.log('Stock updated:', updated);
      
      // Update product in list
      const updatedProducts = products.map(p => {
        if (p.id === productId) {
          return { ...p, stock: newStock };
        }
        return p;
      });
      
      setProducts(updatedProducts);
      
      // Recalculate stats
      const inStock = updatedProducts.filter(p => p.stock > 10).length;
      const lowStock = updatedProducts.filter(p => p.stock > 0 && p.stock <= 10).length;
      const outOfStock = updatedProducts.filter(p => p.stock === 0).length;
      
      setStats({
        totalProducts: updatedProducts.length,
        inStock,
        lowStock,
        outOfStock
      });
      
      showNotification(`Stock updated successfully!`, 'success');
      setIsStockModalOpen(false);
      setSelectedProduct(null);
      
    } catch (err) {
      let errorMessage = 'Failed to update stock';
      if (err.response?.data?.errors) {
        const validationErrors = err.response.data.errors;
        if (validationErrors.stock) {
          errorMessage = validationErrors.stock[0];
        }
      }
      showNotification(errorMessage, 'error');
      console.error('Error updating stock:', err);
    }
  };

  // Delete product
  const handleDeleteProduct = async () => {
    if (!selectedProduct) return;
    
    try {
      setError(null);
      await productService.delete(selectedProduct.id);
      
      // Remove from local state
      const updatedProducts = products.filter(p => p.id !== selectedProduct.id);
      setProducts(updatedProducts);
      
      // Recalculate stats
      const inStock = updatedProducts.filter(p => p.stock > 10).length;
      const lowStock = updatedProducts.filter(p => p.stock > 0 && p.stock <= 10).length;
      const outOfStock = updatedProducts.filter(p => p.stock === 0).length;
      
      setStats({
        totalProducts: updatedProducts.length,
        inStock,
        lowStock,
        outOfStock
      });
      
      showNotification(`Product "${selectedProduct.name}" deleted successfully!`, 'success');
      setIsDeleteModalOpen(false);
      setSelectedProduct(null);
      
    } catch (err) {
      let errorMessage = 'Failed to delete product';
      showNotification(errorMessage, 'error');
      console.error('Error deleting product:', err);
    }
  };

  // Handlers for table actions
  const handleView = (id) => {
    const product = products.find(p => p.id === id);
    setViewItem(product);
    setIsViewModalOpen(true);
  };

  const handleEdit = (id) => {
    const product = products.find(p => p.id === id);
    setSelectedProduct(product);
    setIsEditModalOpen(true);
  };

  const handleDelete = (product) => {
    setSelectedProduct(product);
    setIsDeleteModalOpen(true);
  };

  const handleUpdateStockClick = (product) => {
    setSelectedProduct(product);
    setIsStockModalOpen(true);
  };

  const handleSearch = async () => {
    if (searchTerm.trim()) {
      try {
        const results = await productService.search(searchTerm);
        // Format results with branch names
        const branchMap = branches.reduce((map, b) => {
          map[b.id] = b.name;
          return map;
        }, {});
        
        const formattedResults = results.map(p => ({
          id: p.id,
          name: p.name,
          stock: p.stock,
          branchId: p.branchId,
          branchName: branchMap[p.branchId] || 'Unknown'
        }));
        
        setProducts(formattedResults);
      } catch (err) {
        console.error('Error searching products:', err);
      }
    } else {
      loadData(); // Reload all if search is empty
    }
  };

  // Filter products based on search term (client-side as backup)
  const filteredProducts = products.filter(p =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.branchName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Loading state
  if (loading) {
    return (
      <Layout currentPage="products">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading products...</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout currentPage="products">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">PRODUCTS</h1>
        <p className="text-gray-600">FranchiHub/products</p>
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
          title="TOTAL PRODUCTS"
          value={stats.totalProducts}
          icon={<FaBox className="text-blue-500" size={24} />}
          bgColor="bg-blue-100"
        />
        <StatCard
          title="IN STOCK"
          value={stats.inStock}
          subtitle={`${stats.totalProducts ? Math.round((stats.inStock / stats.totalProducts) * 100) : 0}% availability`}
          icon={<FaCheckCircle className="text-green-500" size={24} />}
          bgColor="bg-green-100"
        />
        <StatCard
          title="LOW STOCK"
          value={stats.lowStock}
          subtitle="Action needed"
          icon={<FaExclamationTriangle className="text-yellow-500" size={24} />}
          bgColor="bg-yellow-100"
        />
        <StatCard
          title="OUT OF STOCK"
          value={stats.outOfStock}
          subtitle="Restock required"
          icon={<FaTimesCircle className="text-red-500" size={24} />}
          bgColor="bg-red-100"
        />
      </div>

      {/* Search and New Button */}
      <div className="flex justify-between items-center mb-6">
        <div className="w-96">
          <SearchBar
            value={searchTerm}
            onChange={setSearchTerm}
            onSearch={handleSearch}
            placeholder="Search products..."
          />
        </div>
        <button
          onClick={() => setIsNewModalOpen(true)}
          className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 flex items-center transition-colors"
        >
          + New Product
        </button>
      </div>

      {/* Products Table or Empty State */}
      {filteredProducts.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-12 text-center">
          <FaBox className="mx-auto text-gray-400 text-5xl mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No products found</h3>
          <p className="text-gray-500 mb-4">
            {searchTerm ? 'Try a different search term' : 'Get started by creating your first product'}
          </p>
          {!searchTerm && (
            <button
              onClick={() => setIsNewModalOpen(true)}
              className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 inline-flex items-center"
            >
              + New Product
            </button>
          )}
        </div>
      ) : (
        <ProductTable
          products={filteredProducts}
          onUpdateStock={handleUpdateStockClick}
          onView={handleView}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      )}

      {/* Modals */}
      <NewProductModal
        isOpen={isNewModalOpen}
        onClose={() => setIsNewModalOpen(false)}
        onCreate={handleCreateProduct}
        branches={branches}
      />

      <EditProductModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedProduct(null);
        }}
        onEdit={handleEditProduct}
        product={selectedProduct}
        branches={branches}
      />

      <UpdateStockModal
        isOpen={isStockModalOpen}
        onClose={() => {
          setIsStockModalOpen(false);
          setSelectedProduct(null);
        }}
        product={selectedProduct}
        onUpdate={handleUpdateStock}
      />

      <ConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setSelectedProduct(null);
        }}
        onConfirm={handleDeleteProduct}
        title="Delete Product"
        message={`Are you sure you want to delete "${selectedProduct?.name}"? This action cannot be undone.`}
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
        type="product"
      />

      {notification && (
        <Notification
          message={notification.message}
          type={notification.type}
          duration={notification.duration}
          onClose={hideNotification}
        />
      )}
    </Layout>
  );
};

export default ProductsPage;