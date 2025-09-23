import Link from "next/link";
import { ListChecks, Users, LineChart, Settings, Home, UtensilsCrossed } from "lucide-react";

export default function DashboardPage() {

    
  const dashboardItems = [
    {
      title: "Orders",
      description: "Manage and track all customer orders.",
      icon: <ListChecks size={40} className="text-sky-600 mb-4" />,
      href: "/dashboard/orders",
    },
    {
      title: "Menu Items",
      description: "View and edit your restaurant's full menu.",
      icon: <UtensilsCrossed size={40} className="text-sky-600 mb-4" />,
      href: "/dashboard/menu-items",
    },
    {
      title: "Users",
      description: "Manage staff, delivery drivers, and customers.",
      icon: <Users size={40} className="text-sky-600 mb-4" />,
      href: "/dashboard/users",
    },
    {
      title: "Analytics",
      description: "Review sales data and performance metrics.",
      icon: <LineChart size={40} className="text-sky-600 mb-4" />,
      href: "/dashboard/analytics",
    },
    {
      title: "Settings",
      description: "Configure your store and account settings.",
      icon: <Settings size={40} className="text-sky-600 mb-4" />,
      href: "/dashboard/settings",
    },
  ];

  const gradientBackground = {
    background: 'linear-gradient(135deg, #e0f2f7 0%, #f3e7e9 100%)'
  };

  return (
    <main className="min-h-screen font-serif" style={gradientBackground}>
      <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
        <header className="text-center mb-12">
          <h1 className="text-5xl md:text-6xl font-bold text-stone-800 mb-2">
            Restaurant Dashboard
          </h1>
          <p className="text-lg text-stone-600 font-sans">
            Manage your operations with elegance and ease.
          </p>
        </header>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {dashboardItems.map((item) => (
            <Link
              key={item.title}
              href={item.href}
              className="bg-white rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 block"
            >
              <div className="text-center">
                {item.icon}
                <h2 className="text-xl font-bold text-stone-800 mb-2">
                  {item.title}
                </h2>
                <p className="text-stone-500 font-sans text-sm">
                  {item.description}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}