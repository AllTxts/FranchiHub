import FranchiseRow from './FranchiseRow';

const FranchiseTable = ({ franchises, onView, onEdit }) => {
  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">NAME</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">BRANCHES</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ACTIONS</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {franchises.map((franchise) => (
            <FranchiseRow
              key={franchise.id}
              franchise={franchise}
              onView={onView}
              onEdit={onEdit}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default FranchiseTable;