import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { PageContainer } from "./components/layout/PageContainer";
import { HomePage } from "./pages/HomePage";
import { HowItWorksPage } from "./pages/HowItWorksPage";
import { SecurityGuidePage } from "./pages/SecurityGuidePage";
import { AboutPage } from "./pages/AboutPage";
import { ElementNumberProvider } from "./context/ElementNumberContext";

export const App: React.FC = () => {
  return (
    <ElementNumberProvider>
      <BrowserRouter>
        <PageContainer>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/how-it-works" element={<HowItWorksPage />} />
            <Route path="/security-guide" element={<SecurityGuidePage />} />
            <Route path="/about" element={<AboutPage />} />
            {/* Fallback to Home */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </PageContainer>
      </BrowserRouter>
    </ElementNumberProvider>
  );
};

export default App;
