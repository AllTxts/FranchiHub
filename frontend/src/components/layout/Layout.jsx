import Sidebar from './Sidebar';

// Main layout wrapper component with sidebar and content area
const Layout = ({ children, currentPage = 'franchises' }) => {
  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar navigation */}
      <Sidebar currentPage={currentPage} />
      {/* Main content area with left margin for sidebar */}
      <main className="ml-64 flex-1 p-8 overflow-y-auto">
        {children}
      </main>
    </div>
  );
};

export default Layout;