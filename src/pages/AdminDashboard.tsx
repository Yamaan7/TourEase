import { Users, Map, Calendar, DollarSign } from 'lucide-react';

const AdminDashboard = () => {
  return (
    <div className="max-w-7xl mx-auto my-8"> {/* Added my-8 for margin-top and margin-bottom */}
      <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-600">Total Users</h3>
            <Users className="h-8 w-8 text-blue-600" />
          </div>
          <p className="text-3xl font-bold">1,234</p>
          <p className="text-sm text-green-600">+12% from last month</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-600">Active Tours</h3>
            <Map className="h-8 w-8 text-blue-600" />
          </div>
          <p className="text-3xl font-bold">45</p>
          <p className="text-sm text-green-600">+5 new this week</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-600">Bookings</h3>
            <Calendar className="h-8 w-8 text-blue-600" />
          </div>
          <p className="text-3xl font-bold">89</p>
          <p className="text-sm text-green-600">+23% this month</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-600">Revenue</h3>
            <DollarSign className="h-8 w-8 text-blue-600" />
          </div>
          <p className="text-3xl font-bold">$12,345</p>
          <p className="text-sm text-green-600">+18% from last month</p>
        </div>
      </div>

      {/* Recent Bookings */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">Recent Bookings</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tour
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Customer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {/* Example booking rows */}
              <tr>
                <td className="px-6 py-4 whitespace-nowrap">Paris Discovery Tour</td>
                <td className="px-6 py-4 whitespace-nowrap">John Doe</td>
                <td className="px-6 py-4 whitespace-nowrap">2024-03-15</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                    Confirmed
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">$249</td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap">Tokyo Adventure</td>
                <td className="px-6 py-4 whitespace-nowrap">Jane Smith</td>
                <td className="px-6 py-4 whitespace-nowrap">2024-03-14</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                    Pending
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">$299</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
          <div className="space-y-4">
            <button className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              Add New Tour
            </button>
            <button className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
              View All Bookings
            </button>
            <button className="w-full px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
              Manage Users
            </button>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">System Notifications</h2>
          <div className="space-y-4">
            <div className="flex items-start gap-4 p-3 bg-yellow-50 rounded-lg">
              <div className="flex-shrink-0">
                <span className="inline-block w-2 h-2 bg-yellow-400 rounded-full"></span>
              </div>
              <div>
                <p className="text-sm font-medium text-yellow-800">New booking requires attention</p>
                <p className="text-xs text-yellow-600">2 minutes ago</p>
              </div>
            </div>
            <div className="flex items-start gap-4 p-3 bg-blue-50 rounded-lg">
              <div className="flex-shrink-0">
                <span className="inline-block w-2 h-2 bg-blue-400 rounded-full"></span>
              </div>
              <div>
                <p className="text-sm font-medium text-blue-800">System update available</p>
                <p className="text-xs text-blue-600">1 hour ago</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;