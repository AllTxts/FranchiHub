import { FaTrash } from 'react-icons/fa';

const FranchiseRow = ({ franchise, onView, onEdit, onDelete }) => {
  return (
    <tr className="hover:bg-gray-50">
      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
        #{franchise.id}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
        {franchise.name}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
        {franchise.branches} branches
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
        <button
          onClick={() => onView(franchise.id)}
          className="text-blue-600 hover:text-blue-900 mr-3"
        >
          View
        </button>
        <button
          onClick={() => onEdit(franchise.id)}
          className="text-gray-600 hover:text-gray-900 mr-3"
        >
          Edit
        </button>
        <button
          onClick={() => onDelete(franchise)}
          className="text-red-600 hover:text-red-900"
        >
          <FaTrash className="inline mr-1" />
          Delete
        </button>
      </td>
    </tr>
  );
};

export default FranchiseRow;