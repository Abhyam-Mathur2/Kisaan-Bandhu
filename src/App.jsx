import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { LandingLayout } from "./layouts/LandingLayout";
import { DashboardLayout } from "./layouts/DashboardLayout";
import { LandingPage } from "./pages/LandingPage";
import { LoginPage } from "./pages/LoginPage";
import { SignupPage } from "./pages/SignupPage";
import { DashboardPage } from "./pages/DashboardPage";
import { VoiceAssistantPage } from "./pages/VoiceAssistantPage";
import { CropPage } from "./pages/CropPage";
import { ClimatePage } from "./pages/ClimatePage";
import { WeatherPage } from "./pages/WeatherPage";
import { AlertsPage } from "./pages/AlertsPage";
import { FinancePage } from "./pages/FinancePage";
import DiseasePage from "./pages/DiseasePage";
import { AnimatePresence } from "framer-motion";
import { LanguageProvider } from "./context/LanguageContext";
import { STORAGE_KEYS } from "./data/storageKeys";

function RequireAuth({ children }) {
  const hasSession = Boolean(localStorage.getItem(STORAGE_KEYS.authSession));
  return hasSession ? children : <Navigate to="/login" replace />;
}

function App() {
  return (
    <LanguageProvider>
      <Router>
        <AnimatePresence mode="wait">
          <Routes>
            {/* Public Routes */}
            <Route element={<LandingLayout />}>
              <Route path="/" element={<LandingPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/signup" element={<SignupPage />} />
            </Route>

            {/* Protected Routes (Mocked) */}
            <Route
              path="/dashboard"
              element={(
                <RequireAuth>
                  <DashboardLayout />
                </RequireAuth>
              )}
            >
              <Route index element={<DashboardPage />} />
              <Route path="crop" element={<CropPage />} />
              <Route path="voice" element={<VoiceAssistantPage />} />
              <Route path="disease" element={<DiseasePage />} />
              <Route path="climate" element={<ClimatePage />} />
              <Route path="weather" element={<WeatherPage />} />
              <Route path="alerts" element={<AlertsPage />} />
              <Route path="finance" element={<FinancePage />} />
              <Route path="market" element={<DashboardPage />} />
              <Route path="settings" element={<DashboardPage />} />
            </Route>

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </AnimatePresence>
      </Router>
    </LanguageProvider>
  );
}

export default App;
