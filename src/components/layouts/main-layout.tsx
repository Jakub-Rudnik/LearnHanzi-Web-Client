import Header from "@/components/header.tsx";
import { Outlet } from "react-router";

export default function MainLayout() {
  return (
    <div className="flex min-h-screen w-full items-start justify-center">
      <div className="container flex w-full flex-col items-center justify-start px-4">
        <Header />
        <main className="mt-6 flex w-full flex-col items-center justify-center px-4 md:mt-12">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
