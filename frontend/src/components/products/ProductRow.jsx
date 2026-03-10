import StatusBadge from './StatusBadge';

// Component for rendering a single product row in the products table
const ProductRow = ({ product, onUpdateStock, onView, onEdit, onDelete }) => {
  return (
    <tr className="hover:bg-gray-50">
      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
        #{product.id}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
        {product.branchName}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
        {product.name}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
        {product.stock}
      </td>
      {/* Stock status badge */}
      <td className="px-6 py-4 whitespace-nowrap">
        <StatusBadge stock={product.stock} />
      </td>
      {/* Action buttons */}
      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
        <button
          onClick={() => onView(product.id)}
          className="text-blue-600 hover:text-blue-900 mr-3"
        >
          View
        </button>
        <button
          onClick={() => onUpdateStock(product)}
          className="text-green-600 hover:text-green-900 mr-3"
        >
          Update Stock
        </button>
        <button
          onClick={() => onEdit(product.id)}
          className="text-gray-600 hover:text-gray-900 mr-3"
        >
          Edit
        </button>
        <button
          onClick={() => onDelete(product)}
          className="text-red-600 hover:text-red-900"
        >
          Delete
        </button>
      </td>
    </tr>
  );
};

export default ProductRow;