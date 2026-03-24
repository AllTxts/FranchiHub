import { useState, useEffect } from 'react';

// Modal component for updating product stock
const UpdateStockModal = ({ isOpen, onClose, product, onUpdate }) => {
  const [stock, setStock] = useState(0);
  const [error, setError] = useState('');

  // Set stock value when modal opens
  useEffect(() => {
    if (isOpen && product) {
      setStock(product.stock);
      setError('');
    }
  }, [isOpen, product]);

  // Handle form submission with validation
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (stock < 0) {
      setError('Stock cannot be negative');
      return;
    }

    onUpdate(product.id, parseInt(stock));
  };

  if (!isOpen || !product) return null;

  return (
    // Modal overlay
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-96">
        {/* Modal header */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Update Stock</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        {/* Product info */}
        <div className="mb-4">
          <p className="text-sm text-gray-600">Product: <span className="font-medium">{product.name}</span></p>
          <p className="text-sm text-gray-600">Current Stock: <span className="font-medium">{product.stock}</span></p>
        </div>
        
        {/* Error message */}
        {error && (
          <div className="mb-4 p-2 bg-red-100 border border-red-400 text-red-700 rounded text-sm">
            {error}
          </div>
        )}
        
        {/* Stock update form */}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              New Stock *
            </label>
            <input
              type="number"
              min="0"
              value={stock}
              onChange={(e) => setStock(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              autoFocus
            />
          </div>
          
          {/* Form actions */}
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-600 hover:text-gray-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600"
            >
              Update Stock
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdateStockModal;