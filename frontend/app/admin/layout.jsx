import Sidebar from "@/components/admin/dashboard/Sidebar";

export default function DashboardLayout({ children }) {
  return (
    <div className="flex">
      <Sidebar />

      <main className="flex-1 ml-64 p-6">
        {children}
      </main>
    </div>
  );
}