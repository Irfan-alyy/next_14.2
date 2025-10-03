import Link from "next/link";
import {
  ListChecks,
  Users,
  LineChart,
  Settings,
  UtensilsCrossed,
  LogOut,
} from "lucide-react";


export default function DashboardPage() {
  const dashboardItems = [
    {
      title: "Orders",
      description: "Manage and track all customer orders.",
      icon: <ListChecks size={24} />,
      href: "/dashboard/orders",
    },
    {
      title: "Kitchen",
      description: "View and edit your restaurant's full menu.",
      icon: <UtensilsCrossed size={24} />,
      href: "/dashboard/kitchen",
    },
    {
      title: "Users",
      description: "Manage staff, delivery drivers, and customers.",
      icon: <Users size={24} />,
      href: "/dashboard",
    },
    {
      title: "Analytics",
      description: "Review sales data and performance metrics.",
      icon: <LineChart size={24} />,
      href: "/dashboard",
    },
    {
      title: "Settings",
      description: "Configure your store and account settings.",
      icon: <Settings size={24} />,
      href: "/dashboard",
    },
  ];

  const gradientBackground = {
    background: "linear-gradient(135deg, #e0f2f7 0%, #f3e7e9 100%)",
  };

  return (
    <div className="min-h-screen  " style={gradientBackground}>
      {/* Sidebar Navigation */}
      
      <div className="flex">
        <aside className="pt-20 w-64 bg-white p-6 shadow-xl flex flex-col justify-between">
          <div>
            <h2 className="text-2xl font-bold text-stone-800 mb-8">
              Admin Panel
            </h2>
            <nav className="space-y-4">
              {dashboardItems.map((item) => (
                <Link
                  key={item.title}
                  href={item.href}
                  className="group flex items-center gap-4 text-stone-600 hover:text-sky-700 transition-colors duration-200"
                >
                  <div className="p-2 rounded-lg bg-stone-100 group-hover:bg-sky-100 transition-colors duration-200">
                    {item.icon}
                  </div>
                  <span className="font-semibold">{item.title}</span>
                </Link>
              ))}
            </nav>
          </div>
          <div className="mt-8 pt-4 border-t border-stone-200">
            <Link
              href="/logout"
              className="group flex items-center gap-4 text-stone-600 hover:text-red-500 transition-colors duration-200"
            >
              <div className="p-2 rounded-lg bg-stone-100 group-hover:bg-red-100 transition-colors duration-200">
                <LogOut size={24} />
              </div>
              <span className="font-semibold">Log Out</span>
            </Link>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 p-8 mt-20 sm:p-12">
          <header className="mb-12">
            <h1 className="text-5xl md:text-6xl font-bold text-stone-800 mb-2">
              Dashboard
            </h1>
            <p className="text-lg text-stone-600 font-sans">
              Welcome, to manage your operations with elegance and ease.
            </p>
          </header>

          {/* Dashboard Cards Section - You can replace this with specific content for the main page */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Example Data Cards */}
            <div className="bg-white rounded-3xl p-8 shadow-xl">
              <h2 className="text-xl font-bold text-stone-800 mb-2">
                Today's Sales
              </h2>
              <p className="text-3xl font-bold text-sky-600">$1,234.56</p>
              <p className="text-sm text-stone-500 font-sans mt-2">
                15% increase from yesterday
              </p>
            </div>
            <div className="bg-white rounded-3xl p-8 shadow-xl">
              <h2 className="text-xl font-bold text-stone-800 mb-2">
                New Orders
              </h2>
              <p className="text-3xl font-bold text-sky-600">8</p>
              <p className="text-sm text-stone-500 font-sans mt-2">
                3 pending, 5 in progress
              </p>
            </div>
            <div className="bg-white rounded-3xl p-8 shadow-xl">
              <h2 className="text-xl font-bold text-stone-800 mb-2">
                Top Item
              </h2>
              <p className="text-xl font-bold text-stone-800">
                Spaghetti Carbonara
              </p>
              <p className="text-sm text-stone-500 font-sans mt-2">
                Most ordered dish today
              </p>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
