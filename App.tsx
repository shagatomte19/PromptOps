import React from 'react';
import { HashRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { Navbar } from './components/layout/Navbar';
import { Landing } from './pages/Landing';
import { FeaturesPage } from './pages/FeaturesPage';
import { PricingPage } from './pages/PricingPage';
import { DocsPage } from './pages/DocsPage';
import { Dashboard } from './pages/dashboard/Dashboard';
import { Footer } from './components/layout/Footer';

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="bg-[#05050A] min-h-screen text-white selection:bg-cyan-500/30 selection:text-cyan-100 flex flex-col">
      <Navbar />
      <main className="flex-1">
        {children}
      </main>
      <Footer />
    </div>
  );
};

// Wrapper to conditionally render Layout (Navbar/Footer) only for non-dashboard routes
const AppContent = () => {
    const location = useLocation();
    const isDashboard = location.pathname.startsWith('/dashboard');

    if (isDashboard) {
        return (
            <Routes>
                <Route path="/dashboard/*" element={<Dashboard />} />
            </Routes>
        )
    }

    return (
        <Layout>
            <Routes>
                <Route path="/" element={<Landing />} />
                <Route path="/features" element={<FeaturesPage />} />
                <Route path="/solution" element={<FeaturesPage />} />
                <Route path="/pricing" element={<PricingPage />} />
                <Route path="/docs" element={<DocsPage />} />
            </Routes>
        </Layout>
    );
}

function App() {
  return (
    <Router>
        <AppContent />
    </Router>
  );
}

export default App;