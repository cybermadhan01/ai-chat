
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { Home } from './pages/Home';
import { Settings } from './pages/Settings';

// Chat imports
import { ChatLayout } from './layouts/ChatLayout';
import { ChatDashboard } from './pages/ChatDashboard';
import { ChatConversation } from './pages/ChatConversation';
import { ChatHistory } from './pages/ChatHistory';
import { SharedChat } from './pages/SharedChat';

// Models imports
import { ModelsLayout } from './layouts/ModelsLayout';
import { ModelSelection } from './pages/ModelSelection';
import { ModelDetails } from './pages/ModelDetails';
import { CustomModel } from './pages/CustomModel';
import { ModelCompare } from './pages/ModelCompare';
import { ModelUsage } from './pages/ModelUsage';

// MCQ imports
import { McqUpload } from './pages/mcq/McqUpload';
import { McqTest } from './pages/mcq/McqTest';

function AppContent() {
  const location = useLocation();
  const isMcqTestPage = /^\/mcq\/[^/]+$/.test(location.pathname);

  return (
    <div className="app-container">
      {!isMcqTestPage && <Header />}
      <main className={isMcqTestPage ? '' : 'main-content'}>
        <Routes>
          <Route path="/" element={<Home />} />
          
          {/* Chat System Routes */}
          <Route path="/chat" element={<ChatLayout />}>
            <Route index element={<Navigate to="/chat/dashboard" replace />} />
            <Route path="dashboard" element={<ChatDashboard />} />
            <Route path="new" element={<ChatConversation />} />
            <Route path="history" element={<ChatHistory />} />
            <Route path="shared/:id" element={<SharedChat />} />
            <Route path=":id" element={<ChatConversation />} />
          </Route>

          {/* AI Models Routes */}
          <Route path="/models" element={<ModelsLayout />}>
            <Route index element={<ModelSelection />} />
            <Route path="custom" element={<CustomModel />} />
            <Route path="compare" element={<ModelCompare />} />
            <Route path="usage" element={<ModelUsage />} />
            <Route path=":id" element={<ModelDetails />} />
          </Route>

          {/* MCQ Routes */}
          <Route path="/mcq">
            <Route index element={<McqUpload />} />
            <Route path=":slug" element={<McqTest />} />
          </Route>

          <Route path="/settings" element={<Settings />} />
        </Routes>
      </main>
      {!isMcqTestPage && <Footer />}
    </div>
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
