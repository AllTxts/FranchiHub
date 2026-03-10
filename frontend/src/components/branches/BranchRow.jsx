// Component for rendering a single branch row in the branches table
const BranchRow = ({ branch, onView, onEdit, onDelete }) => {
  return (
    <tr className="hover:bg-gray-50">
      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
        #{branch.id}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
        {branch.franchiseName}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
        {branch.name}
      </td>
      {/* Display product count */}
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
        {branch.products} items
      </td>
      {/* Action buttons */}
      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
        <button
          onClick={() => onView(branch.id)}
          className="text-blue-600 hover:text-blue-900 mr-3"
        >
          View
        </button>
        <button
          onClick={() => onEdit(branch.id)}
          className="text-gray-600 hover:text-gray-900 mr-3"
        >
          Edit
        </button>
        <button
          onClick={() => onDelete(branch)}
          className="text-red-600 hover:text-red-900"
        >
          Delete
        </button>
      </td>
    </tr>
  );
};

export default BranchRow;