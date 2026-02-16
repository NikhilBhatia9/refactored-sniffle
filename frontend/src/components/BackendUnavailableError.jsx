import { Link } from 'react-router-dom';

const BackendUnavailableError = () => {
  return (
    <div className="space-y-6 max-w-4xl mx-auto py-8">
      <div className="card bg-accent-red/10 border-accent-red/30">
        <div className="flex items-start space-x-4">
          <div className="flex-shrink-0">
            <svg className="w-6 h-6 text-accent-red" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-accent-red mb-2">Backend Server Not Available</h3>
            <p className="text-text-secondary mb-4">
              The Alpha Oracle backend server is not currently running or accessible. 
              This GitHub Pages deployment serves only the frontend application.
            </p>
            <div className="space-y-3">
              <div>
                <h4 className="font-semibold text-text-primary mb-2">To use Alpha Oracle:</h4>
                <ol className="text-text-secondary text-sm space-y-2 ml-4 list-decimal">
                  <li>Clone the repository from GitHub</li>
                  <li>Follow the setup instructions in the README.md</li>
                  <li>Run the backend server locally on your machine</li>
                  <li>Access the frontend at http://localhost:3000</li>
                </ol>
              </div>
              <div className="pt-4 border-t border-primary-border">
                <a 
                  href="https://github.com/NikhilBhatia9/refactored-sniffle" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center px-4 py-2 bg-accent-blue text-white rounded-lg hover:bg-accent-blue/80 transition-colors"
                >
                  <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                    <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                  </svg>
                  View on GitHub
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="card">
        <h3 className="text-lg font-semibold text-text-primary mb-3">About Alpha Oracle</h3>
        <p className="text-text-secondary leading-relaxed mb-4">
          Alpha Oracle is an AI-powered investment recommendation platform that provides outstanding 
          investment opportunities based on sector analysis, economic cycles, and the investment 
          philosophies of legendary investors like Warren Buffett, Peter Lynch, Ray Dalio, and Howard Marks.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <div className="p-3 bg-primary-hover rounded-lg">
            <h4 className="font-semibold text-text-primary mb-2">📊 Features</h4>
            <ul className="text-text-secondary text-sm space-y-1">
              <li>• Real-time market analysis</li>
              <li>• 20+ stock recommendations</li>
              <li>• 11 sector deep dives</li>
              <li>• Economic cycle detection</li>
              <li>• Geopolitical risk assessment</li>
              <li>• Portfolio allocation suggestions</li>
            </ul>
          </div>
          <div className="p-3 bg-primary-hover rounded-lg">
            <h4 className="font-semibold text-text-primary mb-2">🚀 Quick Start</h4>
            <ul className="text-text-secondary text-sm space-y-1">
              <li>• Works out-of-the-box in demo mode</li>
              <li>• No API keys required initially</li>
              <li>• Python 3.11+ & Node.js 18+</li>
              <li>• See README for full setup</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="card bg-primary-hover border-accent-yellow/30">
        <div className="flex items-start space-x-3">
          <span className="text-accent-yellow text-xl">💡</span>
          <div>
            <h4 className="font-semibold text-text-primary mb-2">Alternative: Deploy Your Own Backend</h4>
            <p className="text-text-secondary text-sm leading-relaxed">
              You can deploy the backend to services like Heroku, Railway, or Render, then configure 
              the frontend to connect to your backend by setting the <code className="bg-primary-bg px-2 py-1 rounded">VITE_API_BASE_URL</code> environment 
              variable during the build process. See the README for detailed instructions.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BackendUnavailableError;
