import Sidebar from './Sidebar';

const Layout = ({ children, currentPage = 'franchises' }) => {
  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar currentPage={currentPage} />
      <main className="ml-64 flex-1 p-8 overflow-y-auto">
        {children}
      </main>
    </div>
  );
};

export default Layout;