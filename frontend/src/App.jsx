import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import Sectors from './pages/Sectors';
import Recommendations from './pages/Recommendations';
import MacroView from './pages/MacroView';
import Portfolio from './pages/Portfolio';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-primary-bg">
        <Navbar />
        <main className="container mx-auto px-4 py-8">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/sectors" element={<Sectors />} />
            <Route path="/sectors/:id" element={<Sectors />} />
            <Route path="/recommendations" element={<Recommendations />} />
            <Route path="/recommendations/:id" element={<Recommendations />} />
            <Route path="/macro" element={<MacroView />} />
            <Route path="/portfolio" element={<Portfolio />} />
          </Routes>
        </main>
        <footer className="border-t border-primary-border py-8 mt-16">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
              <div className="text-text-secondary text-sm">
                © 2024 Alpha Oracle. All rights reserved.
              </div>
              <div className="text-text-muted text-xs text-center">
                For educational and informational purposes only. Not financial advice.
              </div>
            </div>
          </div>
        </footer>
      </div>
    </Router>
  );
}

export default App;
