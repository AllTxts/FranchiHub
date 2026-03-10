// Component to display stock status badge with appropriate color
const StatusBadge = ({ stock }) => {
  let bgColor = 'bg-green-100 text-green-800';
  let label = 'In Stock';
  
  // Determine status based on stock level
  if (stock === 0) {
    bgColor = 'bg-red-100 text-red-800';
    label = 'Out of Stock';
  } else if (stock <= 10) {
    bgColor = 'bg-yellow-100 text-yellow-800';
    label = 'Low Stock';
  }

  return (
    <span className={`px-2 py-1 text-xs font-medium rounded-full ${bgColor}`}>
      {label}
    </span>
  );
};

export default StatusBadge;