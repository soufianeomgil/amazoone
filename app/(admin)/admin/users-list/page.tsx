"use client"
import React, { useState, useMemo } from 'react';
import { SearchIcon, CaretDownIcon,  ChevronLeftIcon, ChevronRightIcon, DotsVerticalIcon} from "@/components/shared/icons"
import { ChevronDownIcon, ChevronUpIcon, ExternalLinkIcon, FilterIcon, PencilIcon } from 'lucide-react';
import Image from 'next/image';

interface Customer {
  id: string;
  name: string;
  avatar: string;
  email: string;
  location: string;
  orders: number;
  totalSpent: number;
  joinedDate: string;
}

const mockCustomers: Customer[] = [
  { id: 'CUST-001', name: 'John Doe', avatar: `https://i.pravatar.cc/150?u=a042581f4e29026704d`, email: 'john.doe@example.com', location: 'New York, USA', orders: 12, totalSpent: 1450.75, joinedDate: '2023-01-15' },
  { id: 'CUST-002', name: 'Jane Smith', avatar: `https://i.pravatar.cc/150?u=a042581f4e29026705d`, email: 'jane.smith@example.com', location: 'London, UK', orders: 8, totalSpent: 980.50, joinedDate: '2023-03-22' },
  { id: 'CUST-003', name: 'Carlos Garcia', avatar: `https://i.pravatar.cc/150?u=a042581f4e29026706d`, email: 'carlos.garcia@example.com', location: 'Madrid, Spain', orders: 25, totalSpent: 3200.00, joinedDate: '2022-11-01' },
  { id: 'CUST-004', name: 'Aisha Khan', avatar: `https://i.pravatar.cc/150?u=a042581f4e29026707d`, email: 'aisha.khan@example.com', location: 'Dubai, UAE', orders: 5, totalSpent: 650.25, joinedDate: '2024-02-10' },
  { id: 'CUST-005', name: 'Kenji Tanaka', avatar: `https://i.pravatar.cc/150?u=a042581f4e29026708d`, email: 'kenji.tanaka@example.com', location: 'Tokyo, Japan', orders: 18, totalSpent: 2100.40, joinedDate: '2023-06-05' },
  { id: 'CUST-006', name: 'Fatima Al-Fassi', avatar: `https://i.pravatar.cc/150?u=a042581f4e29026709d`, email: 'fatima.fassi@example.com', location: 'Rabat, Morocco', orders: 3, totalSpent: 250.00, joinedDate: '2024-05-20' },
];

type SortKey = keyof Customer;
type SortDirection = 'asc' | 'desc';

const AdminCustomers: React.FC = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [sortKey, setSortKey] = useState<SortKey>('joinedDate');
    const [sortDirection, setSortDirection] = useState<SortDirection>('desc');

    const sortedCustomers = useMemo(() => {
        let filtered = mockCustomers.filter(customer =>
            customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            customer.email.toLowerCase().includes(searchTerm.toLowerCase())
        );

        return filtered.sort((a, b) => {
            if (a[sortKey] < b[sortKey]) {
                return sortDirection === 'asc' ? -1 : 1;
            }
            if (a[sortKey] > b[sortKey]) {
                return sortDirection === 'asc' ? 1 : -1;
            }
            return 0;
        });
    }, [mockCustomers, searchTerm, sortKey, sortDirection]);
    
    const handleSort = (key: SortKey) => {
        if (sortKey === key) {
            setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
        } else {
            setSortKey(key);
            setSortDirection('asc');
        }
    };

    const SortableHeader: React.FC<{ columnKey: SortKey; title: string }> = ({ columnKey, title }) => (
        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer" onClick={() => handleSort(columnKey)}>
            <div className="flex items-center">
                <span>{title}</span>
                {sortKey === columnKey && (
                    <span className="ml-1">
                        {sortDirection === 'asc' ? <ChevronUpIcon /> : <ChevronDownIcon />}
                    </span>
                )}
            </div>
        </th>
    );

    return (
        <div className="container mx-auto px-4 py-8">
            {/* Page Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
                <h1 className="text-3xl font-bold text-gray-800 mb-2 sm:mb-0">Customers</h1>
                <button className="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-md font-semibold hover:bg-gray-50 transition-colors text-sm">
                    Export CSV
                </button>
            </div>

            {/* Main Content Card */}
            <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md">
                {/* Filters and Search */}
                <div className="flex flex-col md:flex-row justify-between gap-4 mb-4">
                    <div className="grow">
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <SearchIcon />
                            </div>
                            <input
                                type="text"
                                placeholder="Search customers by name or email..."
                                className="w-full p-2 pl-10 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>
                    <div className="flex items-center gap-2 sm:gap-4">
                        <button className="flex-1 sm:flex-initial flex items-center justify-center gap-2 p-2 border rounded-md hover:bg-gray-50 text-sm">
                            <FilterIcon />
                            <span>Filters</span>
                        </button>
                         <button className="flex-1 sm:flex-initial flex items-center justify-center gap-2 p-2 border rounded-md hover:bg-gray-50 text-sm">
                            <span>Joined: Any</span>
                            <CaretDownIcon />
                        </button>
                    </div>
                </div>

                {/* Customers Table (Desktop) */}
                <div className="overflow-x-auto hidden md:block">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th scope="col" className="p-4"><input type="checkbox" className="h-4 w-4 text-blue-600 border-gray-300 rounded" /></th>
                                <SortableHeader columnKey="name" title="Customer" />
                                <SortableHeader columnKey="location" title="Location" />
                                <SortableHeader columnKey="orders" title="Orders" />
                                <SortableHeader columnKey="totalSpent" title="Total Spent" />
                                <SortableHeader columnKey="joinedDate" title="Joined" />
                                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {sortedCustomers.map((customer) => (
                                <tr key={customer.id} className="hover:bg-gray-50">
                                    <td className="p-4"><input type="checkbox" className="h-4 w-4 text-blue-600 border-gray-300 rounded" /></td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                            <Image width={40} height={40} className="h-10 w-10 rounded-full" src={customer.avatar} alt={customer.name} />
                                            <div className="ml-4">
                                                <div className="text-sm font-medium text-gray-900">{customer.name}</div>
                                                <div className="text-sm text-gray-500">{customer.email}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{customer.location}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{customer.orders}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">${customer.totalSpent.toFixed(2)}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(customer.joinedDate).toLocaleDateString()}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <div className="flex items-center justify-end space-x-4">
                                             <button className="text-gray-400 hover:text-blue-600"><PencilIcon /></button>
                                             <button className="text-gray-400 hover:text-green-600"><ExternalLinkIcon /></button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Customers List (Mobile) */}
                <div className="md:hidden space-y-4">
                    {sortedCustomers.map(customer => (
                        <div key={customer.id} className="bg-white border rounded-lg p-4">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center">
                                    <Image width={40} height={40} className="h-10 w-10 rounded-full" src={customer.avatar} alt={customer.name} />
                                    <div className="ml-3">
                                        <p className="text-sm font-medium text-gray-900">{customer.name}</p>
                                        <p className="text-xs text-gray-500">{customer.email}</p>
                                    </div>
                                </div>
                                <button className="text-gray-500"><DotsVerticalIcon /></button>
                            </div>
                            <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
                                <div>
                                    <p className="text-gray-500">Location</p>
                                    <p className="font-medium text-gray-800">{customer.location}</p>
                                </div>
                                <div>
                                    <p className="text-gray-500">Total Spent</p>
                                    <p className="font-medium text-gray-800">${customer.totalSpent.toFixed(2)}</p>
                                </div>
                                <div>
                                    <p className="text-gray-500">Orders</p>
                                    <p className="font-medium text-gray-800">{customer.orders}</p>
                                </div>
                                <div>
                                    <p className="text-gray-500">Joined</p>
                                    <p className="font-medium text-gray-800">{new Date(customer.joinedDate).toLocaleDateString()}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                 {/* Pagination */}
                <div className="flex items-center justify-between mt-4">
                    <div className="text-sm text-gray-700">
                        Showing <span className="font-medium">1</span> to <span className="font-medium">{sortedCustomers.length}</span> of <span className="font-medium">{sortedCustomers.length}</span> results
                    </div>
                    <div className="flex items-center space-x-1">
                        <button className="p-2 border rounded-md text-sm hover:bg-gray-50 disabled:opacity-50" disabled><ChevronLeftIcon /></button>
                        <button className="p-2 border rounded-md text-sm hover:bg-gray-50 disabled:opacity-50" disabled><ChevronRightIcon /></button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminCustomers;