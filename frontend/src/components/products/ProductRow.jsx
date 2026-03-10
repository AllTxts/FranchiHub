import StatusBadge from './StatusBadge';

const ProductRow = ({ product, onUpdateStock, onEdit }) => {
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
      <td className="px-6 py-4 whitespace-nowrap">
        <StatusBadge stock={product.stock} />
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
        <button
          onClick={() => onUpdateStock(product)}
          className="text-blue-600 hover:text-blue-900 mr-3"
        >
          Update Stock
        </button>
        <button
          onClick={() => onEdit(product.id)}
          className="text-gray-600 hover:text-gray-900"
        >
          Edit
        </button>
      </td>
    </tr>
  );
};

export default ProductRow;