const BranchRow = ({ branch, onView, onEdit }) => {
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
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
        {branch.products} items
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
        <button
          onClick={() => onView(branch.id)}
          className="text-blue-600 hover:text-blue-900 mr-3"
        >
          View
        </button>
        <button
          onClick={() => onEdit(branch.id)}
          className="text-gray-600 hover:text-gray-900"
        >
          Edit
        </button>
      </td>
    </tr>
  );
};

export default BranchRow;