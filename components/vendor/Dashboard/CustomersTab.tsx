/* eslint-disable no-unused-vars */
"use client";
import { useState } from 'react';
import { Search, Filter, ChevronDown, Users, Mail, Phone, ShoppingBag } from 'lucide-react';

interface Customer {
  id: string;
  name: string;
  email: string;
  orders: number;
  totalSpent: number;
  lastOrder: string;
}

interface CustomersTabProps {
  customers: Customer[];
}

function CustomersTab({ customers }: CustomersTabProps) {
  const [searchTerm, setSearchTerm] = useState('');
  // biome-ignore lint/correctness/noUnusedVariables: will see if needed in future
  const [filterType, setFilterType] = useState('all');

  // Filter customers based on search term
  const filteredCustomers = customers.filter(customer => {
    const matchesSearch = customer.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         customer.id.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesSearch;
  });

  return (
    <div className="p-4 md:p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Customers</h1>
        <p className="text-gray-600">View and manage your customer information</p>
      </div>
      {/* Search and Filter */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row">
        <div className="relative flex-1">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <Search className="size-5 text-gray-400" />
          </div>
          <input
            type="text"
            className="block w-full rounded-md border border-gray-300 bg-white py-2 pl-10 pr-3 text-sm placeholder:text-gray-500 focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
            placeholder="Search customers..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="relative inline-block">
          <div className="flex">
            <button
              type="button"
              className="inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
              onClick={() => {}}
            >
              <Filter className="mr-2 size-4 text-gray-500" />
              Filter
              <ChevronDown className="ml-1 size-4 text-gray-500" />
            </button>
          </div>
          {/* Filter dropdown would go here */}
        </div>
      </div>
      {/* Customers Table */}
      {filteredCustomers.length > 0 ? (
        <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Customer
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Email
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Orders
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Total Spent
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Last Order
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {filteredCustomers.map((customer) => (
                  <tr key={customer.id} className="hover:bg-gray-50">
                    <td className="whitespace-nowrap px-6 py-4">
                      <div className="flex items-center">
                        <div className="mr-3 flex size-8 items-center justify-center rounded-full bg-gray-100 text-gray-700">
                          {customer.name.charAt(0)}
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-900">{customer.name}</div>
                          <div className="text-xs text-gray-500">{customer.id}</div>
                        </div>
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4">
                      <div className="text-sm text-gray-900">{customer.email}</div>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4">
                      <div className="text-sm text-gray-900">{customer.orders}</div>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4">
                      <div className="text-sm font-medium text-gray-900">₹{customer.totalSpent.toLocaleString()}</div>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4">
                      <div className="text-sm text-gray-500">{customer.lastOrder}</div>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-right text-sm font-medium">
                      <div className="flex justify-end space-x-2">
                        <button type='button' className="rounded p-1 text-gray-500 hover:bg-gray-100 hover:text-gray-700" title="View Orders">
                          <ShoppingBag className="size-4" />
                        </button>
                        <button type='button' className="rounded p-1 text-gray-500 hover:bg-gray-100 hover:text-gray-700" title="Email Customer">
                          <Mail className="size-4" />
                        </button>
                        <button type='button' className="rounded p-1 text-gray-500 hover:bg-gray-100 hover:text-gray-700" title="Call Customer">
                          <Phone className="size-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="rounded-lg border border-gray-200 bg-white p-8 text-center shadow-sm">
          <div className="mx-auto mb-4 flex size-12 items-center justify-center rounded-full bg-gray-100">
            <Users className="size-6 text-gray-400" />
          </div>
          <h3 className="mb-1 text-base font-medium text-gray-900">No customers found</h3>
          <p className="text-sm text-gray-500">
            {searchTerm ? 'Try adjusting your search criteria' : 'You have no customers yet'}
          </p>
        </div>
      )}
    </div>
  );
}

export default CustomersTab;