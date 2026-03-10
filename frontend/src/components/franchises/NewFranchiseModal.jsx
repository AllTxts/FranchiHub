import { useState } from 'react';

// Modal component for creating a new franchise
const NewFranchiseModal = ({ isOpen, onClose, onCreate }) => {
  const [name, setName] = useState('');

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    if (name.trim()) {
      onCreate({ name: name.trim() });
      setName('');
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    // Modal overlay
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-96">
        {/* Modal header */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">New Franchise</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        {/* Create form */}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Franchise Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              placeholder="Enter franchise name"
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
              Create
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewFranchiseModal;