"use client";
import {useEffect, useState} from 'react';
import { ArrowUpRight, Package, Plus, ShoppingBag, TrendingUp } from 'lucide-react';

interface OverviewTabProps{
    email: string,
    totalSales: string,
    totalOrders: string,
    totalProducts: string,
     onViewAllClick?: () => void
}   

function OverviewTab(OverviewTabProps: OverviewTabProps) {
    const { email, totalSales, totalOrders, totalProducts,onViewAllClick } = OverviewTabProps;
    const [recentOrders, setRecentOrders] = useState<any[]>([]);

    const getStatusColor = (status: string) => {
    switch (status) {
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'processing':
        return 'bg-blue-100 text-blue-800';
      case 'shipped':
        return 'bg-purple-100 text-purple-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      case 'low-stock':
        return 'bg-amber-100 text-amber-800';
      case 'active':
        return 'bg-emerald-100 text-emerald-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  
    useEffect(()=>{
        setRecentOrders([
      { id: 'ORD-7829', customer: 'Rahul Sharma', date: '2023-06-15', total: 1250, status: 'delivered', items: 3 },
      { id: 'ORD-7830', customer: 'Priya Patel', date: '2023-06-14', total: 850, status: 'processing', items: 2 },
      { id: 'ORD-7831', customer: 'Amit Kumar', date: '2023-06-14', total: 3200, status: 'shipped', items: 5 },
      { id: 'ORD-7832', customer: 'Neha Singh', date: '2023-06-13', total: 1600, status: 'delivered', items: 4 },
      { id: 'ORD-7833', customer: 'Vikram Reddy', date: '2023-06-12', total: 950, status: 'processing', items: 2 }
    ]);
    },[])

return (
  <div className="p-4 md:p-6">
    <div className="mb-6">
      <h1 className="text-2xl font-bold text-gray-900">Dashboard Overview</h1>
      <p className="text-gray-600">Welcome back, {email}</p>
    </div>
    {/* Stats Grid */}
    <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {/* Total Sales */}
      <div className="overflow-hidden rounded-lg bg-white p-4 shadow-sm">
        <div className="flex items-center">
          <div className="mr-4 flex size-12 items-center justify-center rounded-full bg-green-100">
            <TrendingUp className="size-6 text-green-600" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Total Sales</p>
            <p className="text-2xl font-bold text-gray-900">₹{totalSales}</p>
          </div>
        </div>
        <div className="mt-4 flex items-center text-xs font-medium text-green-600">
          <ArrowUpRight className="mr-1 size-3" />
          <span>12% from last month</span>
        </div>
      </div>
      {/* Total Orders */}
      <div className="overflow-hidden rounded-lg bg-white p-4 shadow-sm">
        <div className="flex items-center">
          <div className="mr-4 flex size-12 items-center justify-center rounded-full bg-purple-100">
            <ShoppingBag className="size-6 text-purple-600" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Total Orders</p>
            <p className="text-2xl font-bold text-gray-900">{totalOrders}</p>
          </div>
        </div>
        <div className="mt-4 flex items-center text-xs font-medium text-purple-600">
          <ArrowUpRight className="mr-1 size-3" />
          <span>8% from last month</span>
        </div>
      </div>
      {/* Total Products */}
      <div className="overflow-hidden rounded-lg bg-white p-4 shadow-sm">
        <div className="flex items-center">
          <div className="mr-4 flex size-12 items-center justify-center rounded-full bg-blue-100">
            <Package className="size-6 text-blue-600" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Total Products</p>
            <p className="text-2xl font-bold text-gray-900">{totalProducts}</p>
          </div>
        </div>
        <div className="mt-4 flex items-center text-xs font-medium text-blue-600">
          <Plus className="mr-1 size-3" />
          <span>5 new this month</span>
        </div>
      </div>
    </div>
    {/* Recent Orders */}
    <div className="mb-6">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-medium text-gray-900">Recent Orders</h2>
        <button 
            type='button'
            onClick={onViewAllClick} // call the function from parameter 
            className="text-sm font-medium text-green-600 hover:text-green-700"
        >
          View All
        </button>
      </div>
      <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Order ID
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Customer
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Date
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Total
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {recentOrders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50">
                  <td className="whitespace-nowrap px-6 py-4">
                    <div className="text-sm font-medium text-gray-900">{order.id}</div>
                  </td>
                  <td className="whitespace-nowrap px-6 py-4">
                    <div className="text-sm text-gray-900">{order.customer}</div>
                  </td>
                  <td className="whitespace-nowrap px-6 py-4">
                    <div className="text-sm text-gray-500">{order.date}</div>
                  </td>
                  <td className="whitespace-nowrap px-6 py-4">
                    <div className="text-sm font-medium text-gray-900">₹{order.total}</div>
                  </td>
                  <td className="whitespace-nowrap px-6 py-4">
                    <span className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${getStatusColor(order.status)}`}>
                      {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                    </span>
                  </td>
                </tr>
                        ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
)
}

export default OverviewTab
