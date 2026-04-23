import { useEffect } from "react";
import { Navigate, Outlet, Route, Routes } from "react-router";
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
import LearnCharPage from "@/pages/practise.tsx";
import { useUser } from "@/stores/user-store.ts";

export function App() {
  return (
    <>
      <AuthBootstrap />
      <Routes>
        <Route path="/" element={<LandingPage />} />

        <Route element={<RequireAuth />}>
          <Route element={<MainLayout />}>
            <Route path="/home" element={<HomePage />} />
            <Route path="/flash-cards" element={<FlashCardsPage />} />
            <Route path="/dictionary" element={<DictionaryPage />} />
            <Route path="/ranking" element={<RankingPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/learn/:char" element={<LearnCharPage />} />
          </Route>
        </Route>

        <Route element={<PublicOnlyRoute />}>
          <Route element={<AuthLayout />}>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
            <Route path="/reset-password" element={<ResetPasswordPage />} />
          </Route>
        </Route>
      </Routes>
    </>
  );
}

function AuthBootstrap() {
  useEffect(() => {
    void useUser.getState().checkAuth();
  }, []);

  return null;
}

function LoadingState() {
  return (
    <div className="flex min-h-[40vh] w-full items-center justify-center text-sm text-muted-foreground">
      Loading...
    </div>
  );
}

function RequireAuth() {
  const isLoading = useUser((state) => state.isLoading);
  const user = useUser((state) => state.user);

  if (isLoading) {
    return <LoadingState />;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}

function PublicOnlyRoute() {
  const isLoading = useUser((state) => state.isLoading);
  const user = useUser((state) => state.user);

  if (isLoading) {
    return <LoadingState />;
  }

  if (user) {
    return <Navigate to="/home" replace />;
  }

  return <Outlet />;
}

export default App;
