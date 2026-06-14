import { BrowserRouter, Routes, Route, Navigate } from 'react-router';
import { LandingPage } from './pages/LandingPage';
import CollectionApp from './pages/CollectionApp';
import { LanguageProvider } from './context/LanguageContext';

export default function App() {
  return (
    <LanguageProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/app" element={<CollectionApp />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </LanguageProvider>
  );
}
