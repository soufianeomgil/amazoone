"use client"
import React from 'react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, Cell, PieChart, Pie
} from 'recharts';
import { MOCK_SALES, MOCK_CATEGORIES, MOCK_ORDERS, KPI_STATS } from "@/constants/index"

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

const Dashboard: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Sales Dashboard</h1>
        <div className="flex space-x-2">
          <select className="bg-white border rounded px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400">
            <option>Last 7 Days</option>
            <option>Last 30 Days</option>
            <option>Year to Date</option>
          </select>
          <button className="bg-orange-400 hover:bg-orange-500 text-white px-4 py-1.5 rounded text-sm font-medium transition-colors">
            Export Data
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {KPI_STATS.map((stat, idx) => (
          <div key={idx} className="bg-white p-6 rounded-lg border shadow-sm flex flex-col justify-between">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm text-gray-500 mb-1">{stat.label}</p>
                <h3 className="text-2xl font-bold">{stat.value}</h3>
              </div>
              <span className="text-2xl">{stat.icon}</span>
            </div>
            <div className="mt-4 flex items-center">
              <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${stat.isPositive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                {stat.change}
              </span>
              <span className="text-xs text-gray-400 ml-2">vs last period</span>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white p-6 rounded-lg border shadow-sm h-[400px] flex flex-col">
          <h3 className="font-semibold mb-4 flex items-center">
             Revenue Trend <span className="ml-2 text-xs text-gray-400 font-normal">(USD)</span>
          </h3>
          <div className="flex-1">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={MOCK_SALES}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#FF9900" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#FF9900" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                <XAxis dataKey="date" tick={{fontSize: 12}} axisLine={false} tickLine={false} />
                <YAxis tick={{fontSize: 12}} axisLine={false} tickLine={false} />
                <Tooltip />
                <Area type="monotone" dataKey="revenue" stroke="#FF9900" fillOpacity={1} fill="url(#colorRevenue)" strokeWidth={3} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border shadow-sm h-[400px] flex flex-col">
          <h3 className="font-semibold mb-4">Category Distribution</h3>
          <div className="flex-1">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={MOCK_CATEGORIES}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  fill="#8884d8"
                  paddingAngle={5}
                  dataKey="value"
                  nameKey="category"
                  label
                >
                  {MOCK_CATEGORIES.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 grid grid-cols-2 gap-2">
            {MOCK_CATEGORIES.map((cat, idx) => (
              <div key={idx} className="flex items-center space-x-2">
                <div className="w-3 h-3 rounded-full" style={{backgroundColor: COLORS[idx % COLORS.length]}}></div>
                <span className="text-xs text-gray-600 truncate">{cat.category}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-lg border shadow-sm overflow-hidden">
        <div className="p-6 border-b flex justify-between items-center">
          <h3 className="font-semibold">Recent Sales</h3>
          <button className="text-sm text-orange-600 font-medium hover:underline">View All</button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                <th className="px-6 py-4">Order ID</th>
                <th className="px-6 py-4">Customer</th>
                <th className="px-6 py-4">Product</th>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4">Amount</th>
                <th className="px-6 py-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {MOCK_ORDERS.map((order) => (
                <tr key={order.id} className="text-sm hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 font-medium text-blue-600">{order.id}</td>
                  <td className="px-6 py-4">{order.customer}</td>
                  <td className="px-6 py-4">{order.product}</td>
                  <td className="px-6 py-4 text-gray-500">{order.date}</td>
                  <td className="px-6 py-4 font-semibold">${order.amount.toFixed(2)}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      order.status === 'Delivered' ? 'bg-green-100 text-green-700' :
                      order.status === 'Shipped' ? 'bg-blue-100 text-blue-700' :
                      order.status === 'Pending' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-red-100 text-red-700'
                    }`}>
                      {order.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
