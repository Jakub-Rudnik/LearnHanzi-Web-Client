import { Route, Routes } from "react-router";
import MainLayout from "@/components/layouts/main-layout.tsx";
import HomePage from "@/pages/home.tsx";
import FlashCardsPage from "@/pages/flash-cards.tsx";
import DictionaryPage from "@/pages/dictionary.tsx";
import RankingPage from "@/pages/ranking.tsx";
import ProfilePage from "@/pages/profile.tsx";
import AuthLayout from "@/components/layouts/auth-layout.tsx";
import LoginPage from "@/pages/login.tsx";
import SignupPage from "@/pages/signup.tsx";
import LandingPage from "@/pages/landing.tsx";
import ForgotPasswordPage from "@/pages/forgot-password.tsx";
import ResetPasswordPage from "@/pages/reset-password.tsx";

export function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />

      <Route element={<MainLayout />}>
        <Route path="/home" element={<HomePage />} />
        <Route path="/flash-cards" element={<FlashCardsPage />} />
        <Route path="/dictionary" element={<DictionaryPage />} />
        <Route path="/ranking" element={<RankingPage />} />
        <Route path="/profile" element={<ProfilePage />} />
      </Route>

      <Route element={<AuthLayout />}>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />
      </Route>
    </Routes>
  );
}

export default App;
