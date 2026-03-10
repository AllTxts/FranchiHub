// frontend/src/components/common/ViewDetailsModal.jsx
import { FaStore, FaCodeBranch, FaBox, FaTimes } from 'react-icons/fa';

// Reusable modal for displaying item details
const ViewDetailsModal = ({ isOpen, onClose, item, type }) => {
  if (!isOpen || !item) return null;

  const getIcon = () => {
    switch(type) {
      case 'franchise':
        return <FaStore className="text-orange-500 text-4xl mb-2" />;
      case 'branch':
        return <FaCodeBranch className="text-orange-500 text-4xl mb-2" />;
      case 'product':
        return <FaBox className="text-orange-500 text-4xl mb-2" />;
      default:
        return null;
    }
  };

  const getTitle = () => {
    switch(type) {
      case 'franchise': return 'Franchise Details';
      case 'branch': return 'Branch Details';
      case 'product': return 'Product Details';
      default: return 'Details';
    }
  };

  return (
    // Modal overlay with subtle blur
    <div className="fixed inset-0 bg-black bg-opacity-20 backdrop-blur-[2px] flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-96 max-w-md">
        {/* Modal header */}
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-2">
            {getIcon()}
            <h2 className="text-xl font-bold text-gray-800">{getTitle()}</h2>
          </div>
          <button 
            onClick={onClose} 
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <FaTimes size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="space-y-4">
          {/* Basic info */}
          <div className="bg-gray-50 rounded-lg p-4">
            <p className="text-sm text-gray-500 mb-1">ID</p>
            <p className="text-gray-900 font-medium">#{item.id}</p>
          </div>

          <div className="bg-gray-50 rounded-lg p-4">
            <p className="text-sm text-gray-500 mb-1">Name</p>
            <p className="text-gray-900 font-medium">{item.name}</p>
          </div>

          {/* Type-specific details */}
          {type === 'branch' && (
            <>
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-sm text-gray-500 mb-1">Franchise</p>
                <p className="text-gray-900 font-medium">{item.franchiseName}</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-sm text-gray-500 mb-1">Products Count</p>
                <p className="text-gray-900 font-medium">{item.products} products</p>
              </div>
            </>
          )}

          {type === 'product' && (
            <>
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-sm text-gray-500 mb-1">Branch</p>
                <p className="text-gray-900 font-medium">{item.branchName}</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-sm text-gray-500 mb-1">Stock</p>
                <p className="text-gray-900 font-medium">{item.stock} units</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-sm text-gray-500 mb-1">Status</p>
                <p className="text-gray-900 font-medium">
                  {item.stock === 0 ? 'Out of Stock' : 
                   item.stock <= 10 ? 'Low Stock' : 'In Stock'}
                </p>
              </div>
            </>
          )}

          {type === 'franchise' && (
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-sm text-gray-500 mb-1">Branches Count</p>
              <p className="text-gray-900 font-medium">{item.branches} branches</p>
            </div>
          )}

          {/* Created/Updated info (placeholder - you can add real dates if available) */}
          <div className="text-xs text-gray-400 mt-4 pt-2 border-t border-gray-200">
            <p>Created: {new Date().toLocaleDateString()}</p>
            <p>Last Updated: {new Date().toLocaleDateString()}</p>
          </div>
        </div>

        {/* Close button */}
        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default ViewDetailsModal;