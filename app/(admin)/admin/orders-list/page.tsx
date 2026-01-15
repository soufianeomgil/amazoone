"use client"
import React, { useState, useMemo } from 'react';
import { SearchIcon, CaretDownIcon, DotsVerticalIcon,ChevronLeftIcon, ChevronRightIcon} from "@/components/shared/icons"
import { ChevronDownIcon, ChevronUpIcon, EyeIcon, PrinterIcon } from 'lucide-react';
import Image from 'next/image';

type OrderStatus = 'Pending' | 'Shipped' | 'Delivered' | 'Canceled';

interface OrderItem {
  sku: string;
  name: string;
  image: string;
  quantity: number;
  price: number;
}

export interface Order {
  orderId: string;
  customerName: string;
  customerEmail: string;
  customerAvatar: string;
  date: string;
  total: number;
  status: OrderStatus;
  items: OrderItem[];
  shippingAddress: string;
  billingAddress: string;
  paymentMethod: string;
}

const mockOrders: Order[] = [
  { 
    orderId: 'AMZ-2024-001', 
    customerName: 'John Doe', 
    customerEmail: 'john.doe@example.com',
    customerAvatar: `https://i.pravatar.cc/150?u=a042581f4e29026704d`, 
    date: '2024-07-28T10:30:00Z', 
    total: 149.98, 
    status: 'Shipped', 
    items: [
      { sku: 'SKU-001', name: 'Echo Dot (5th Gen)', image: 'https://m.media-amazon.com/images/I/71Que-d6-wL._AC_UY218_.jpg', quantity: 1, price: 49.99 },
      { sku: 'SKU-005', name: 'Blink Outdoor Camera', image: 'https://m.media-amazon.com/images/I/51-iA8-jX-L._AC_UY218_.jpg', quantity: 1, price: 99.99 },
    ],
    shippingAddress: '123 Beacon St, Boston, MA 02108, USA',
    billingAddress: '123 Beacon St, Boston, MA 02108, USA',
    paymentMethod: 'Visa **** 4242'
  },
  { 
    orderId: 'AMZ-2024-002', 
    customerName: 'Jane Smith', 
    customerEmail: 'jane.smith@example.com',
    customerAvatar: `https://i.pravatar.cc/150?u=a042581f4e29026705d`, 
    date: '2024-07-28T09:15:00Z', 
    total: 45.99, 
    status: 'Delivered', 
    items: [
        { sku: 'SKU-003', name: 'Amazon Basics AA Batteries (48-Pack)', image: 'https://m.media-amazon.com/images/I/71IdKRlm8+L._AC_UY218_.jpg', quantity: 3, price: 15.33 },
    ],
    shippingAddress: '456 Oak Ave, London, SW1A 0AA, UK',
    billingAddress: '456 Oak Ave, London, SW1A 0AA, UK',
    paymentMethod: 'Mastercard **** 5678'
  },
  { 
    orderId: 'AMZ-2024-003', 
    customerName: 'Carlos Garcia', 
    customerEmail: 'carlos.garcia@example.com',
    customerAvatar: `https://i.pravatar.cc/150?u=a042581f4e29026706d`, 
    date: '2024-07-27T18:00:00Z', 
    total: 204.50, 
    status: 'Pending', 
    items: [
        { sku: 'SKU-002', name: 'Kindle Paperwhite (16 GB)', image: 'https://m.media-amazon.com/images/I/61-fwv2G7GL._AC_UY218_.jpg', quantity: 1, price: 139.99 },
        { sku: 'SKU-004', name: 'Fire TV Stick 4K Max', image: 'https://m.media-amazon.com/images/I/51km+p3mP-L._AC_UY218_.jpg', quantity: 1, price: 54.99 },
        { sku: 'SKU-003', name: 'Amazon Basics AA Batteries', image: 'https://m.media-amazon.com/images/I/71IdKRlm8+L._AC_UY218_.jpg', quantity: 1, price: 9.52 },
    ],
    shippingAddress: '789 Pine Rd, Madrid, 28001, Spain',
    billingAddress: '789 Pine Rd, Madrid, 28001, Spain',
    paymentMethod: 'PayPal'
  },
  { 
    orderId: 'AMZ-2024-004', 
    customerName: 'Aisha Khan', 
    customerEmail: 'aisha.khan@example.com',
    customerAvatar: `https://i.pravatar.cc/150?u=a042581f4e29026707d`, 
    date: '2024-07-26T11:45:00Z', 
    total: 54.99, 
    status: 'Canceled', 
    items: [
        { sku: 'SKU-004', name: 'Fire TV Stick 4K Max', image: 'https://m.media-amazon.com/images/I/51km+p3mP-L._AC_UY218_.jpg', quantity: 1, price: 54.99 },
    ],
    shippingAddress: '101 Palm Jumeirah, Dubai, UAE',
    billingAddress: '101 Palm Jumeirah, Dubai, UAE',
    paymentMethod: 'Visa **** 1234'
  },
];

type SortKey = keyof Omit<Order, 'items' | 'shippingAddress' | 'billingAddress' | 'paymentMethod' | 'customerEmail'>;
type SortDirection = 'asc' | 'desc';

interface AdminOrdersProps {
  onSelectOrder: (order: Order) => void;
}

const AdminOrders: React.FC<AdminOrdersProps> = ({ onSelectOrder }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [sortKey, setSortKey] = useState<SortKey>('date');
    const [sortDirection, setSortDirection] = useState<SortDirection>('desc');

    const getStatusClass = (status: OrderStatus) => {
        switch (status) {
            case 'Pending': return 'bg-yellow-100 text-yellow-800';
            case 'Shipped': return 'bg-blue-100 text-blue-800';
            case 'Delivered': return 'bg-green-100 text-green-800';
            case 'Canceled': return 'bg-gray-100 text-gray-800';
        }
    };

    const sortedOrders = useMemo(() => {
        let filtered = mockOrders.filter(order =>
            order.orderId.toLowerCase().includes(searchTerm.toLowerCase()) ||
            order.customerName.toLowerCase().includes(searchTerm.toLowerCase())
        );

        return filtered.sort((a, b) => {
            const valA = a[sortKey];
            const valB = b[sortKey];
            if (valA < valB) return sortDirection === 'asc' ? -1 : 1;
            if (valA > valB) return sortDirection === 'asc' ? 1 : -1;
            return 0;
        });
    }, [mockOrders, searchTerm, sortKey, sortDirection]);
    
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
                    <span className="ml-1">{sortDirection === 'asc' ? <ChevronUpIcon /> : <ChevronDownIcon />}</span>
                )}
            </div>
        </th>
    );

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
                <h1 className="text-3xl font-bold text-gray-800 mb-2 sm:mb-0">Orders</h1>
                <button className="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-md font-semibold hover:bg-gray-50 transition-colors text-sm">
                    Export
                </button>
            </div>

            <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md">
                <div className="flex flex-col md:flex-row justify-between gap-4 mb-4">
                    <div className="flex-grow">
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><SearchIcon /></div>
                            <input
                                type="text"
                                placeholder="Search by Order ID or Customer..."
                                className="w-full p-2 pl-10 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>
                    <div className="flex items-center gap-2 sm:gap-4">
                        <button className="flex-1 sm:flex-initial flex items-center justify-center gap-2 p-2 border rounded-md hover:bg-gray-50 text-sm">
                            <span>Status: All</span>
                            <CaretDownIcon />
                        </button>
                         <button className="flex-1 sm:flex-initial flex items-center justify-center gap-2 p-2 border rounded-md hover:bg-gray-50 text-sm">
                            <span>Date: All Time</span>
                            <CaretDownIcon />
                        </button>
                    </div>
                </div>

                {/* Orders Table (Desktop) */}
                <div className="overflow-x-auto hidden md:block">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th scope="col" className="p-4"><input type="checkbox" className="h-4 w-4 text-blue-600 border-gray-300 rounded" /></th>
                                <SortableHeader columnKey="orderId" title="Order ID" />
                                <SortableHeader columnKey="customerName" title="Customer" />
                                <SortableHeader columnKey="date" title="Date" />
                                <SortableHeader columnKey="total" title="Total" />
                                <SortableHeader columnKey="status" title="Status" />
                                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {sortedOrders.map((order) => (
                                <tr key={order.orderId} className="hover:bg-gray-50">
                                    <td className="p-4"><input type="checkbox" className="h-4 w-4 text-blue-600 border-gray-300 rounded" /></td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                        <button onClick={() => onSelectOrder(order)} className="text-blue-600 hover:underline">
                                            {order.orderId}
                                        </button>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                            <Image width={32} height={32} className="h-8 w-8 rounded-full" src={order.customerAvatar} alt={order.customerName} />
                                            <div className="ml-3 text-sm font-medium text-gray-900">{order.customerName}</div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(order.date).toLocaleDateString()}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">${order.total.toFixed(2)}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusClass(order.status)}`}>{order.status}</span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <div className="flex items-center justify-end space-x-4">
                                             <button onClick={() => onSelectOrder(order)} className="text-gray-400 hover:text-blue-600" title="View Details"><EyeIcon /></button>
                                             <button className="text-gray-400 hover:text-gray-800" title="Print Invoice"><PrinterIcon /></button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Orders List (Mobile) */}
                <div className="md:hidden space-y-4">
                    {sortedOrders.map(order => (
                        <div key={order.orderId} className="bg-white border rounded-lg p-4" onClick={() => onSelectOrder(order)}>
                            <div className="flex items-center justify-between">
                                <div className="flex items-center">
                                    <Image width={40} height={40} className="h-10 w-10 rounded-full" src={order.customerAvatar} alt={order.customerName} />
                                    <div className="ml-3">
                                        <p className="text-sm font-bold text-gray-900">{order.customerName}</p>
                                        <p className="text-xs font-medium text-blue-600">{order.orderId}</p>
                                    </div>
                                </div>
                                <button className="text-gray-500"><DotsVerticalIcon /></button>
                            </div>
                            <div className="mt-4 flex justify-between items-end">
                                <div>
                                    <p className="text-sm font-bold text-gray-800">${order.total.toFixed(2)}</p>
                                    <p className="text-xs text-gray-500">{new Date(order.date).toLocaleDateString()}</p>
                                </div>
                                <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusClass(order.status)}`}>{order.status}</span>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="flex items-center justify-between mt-4">
                    <div className="text-sm text-gray-700">
                        Showing <span className="font-medium">1</span> to <span className="font-medium">{sortedOrders.length}</span> of <span className="font-medium">{sortedOrders.length}</span> results
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

export default AdminOrders;