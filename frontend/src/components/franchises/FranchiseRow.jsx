const FranchiseRow = ({ franchise, onView, onEdit }) => {
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
          className="text-gray-600 hover:text-gray-900"
        >
          Edit
        </button>
      </td>
    </tr>
  );
};

export default FranchiseRow;