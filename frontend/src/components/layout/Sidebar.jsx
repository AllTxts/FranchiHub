import { FaStore, FaCodeBranch, FaBox } from 'react-icons/fa';

const Sidebar = () => {
  return (
    <aside className="w-64 bg-gray-900 text-white h-screen fixed left-0 top-0 overflow-y-auto">
      <div className="p-6">
        <h1 className="text-2xl font-bold text-orange-500">FRANCHIHUB</h1>
        <p className="text-xs text-gray-400 mt-1">MANAGEMENT SYSTEM</p>
      </div>
      
      <nav className="mt-8">
        <a href="/" className="flex items-center px-6 py-3 text-sm bg-orange-600 text-white border-l-4 border-orange-400">
          <FaStore className="mr-3" />
          Franchises
        </a>
        <a href="/branches" className="flex items-center px-6 py-3 text-sm text-gray-300 hover:bg-gray-800">
          <FaCodeBranch className="mr-3" />
          Branches
        </a>
        <a href="/products" className="flex items-center px-6 py-3 text-sm text-gray-300 hover:bg-gray-800">
          <FaBox className="mr-3" />
          Products
        </a>
      </nav>

      <div className="absolute bottom-0 w-full p-6">
        <div className="text-xs text-gray-500">
          <p>MAIN</p>
          <p className="mt-2">FranchiHub/franchises</p>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;