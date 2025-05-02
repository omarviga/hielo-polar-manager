
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Header from "./Header";

export default function Layout() {
  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <div className="md:pl-20 lg:pl-64">
        <Header />
        <main className="container py-6 px-4 md:px-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
