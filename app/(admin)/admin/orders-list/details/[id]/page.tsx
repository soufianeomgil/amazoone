"use client"
import React from 'react';

import { ChevronLeftIcon, CreditCardIcon } from "@/components/shared/icons"
import { PackageIcon, PrinterIcon } from 'lucide-react';
import { Order } from '../../page';
import Image from 'next/image';

interface AdminOrderDetailProps {
    order: Order;
    onBack: () => void;
}

const AdminOrderDetail: React.FC<AdminOrderDetailProps> = ({ order, onBack }) => {

    const getStatusClass = (status: string) => {
        switch (status) {
            case 'Pending': return 'bg-yellow-100 text-yellow-800';
            case 'Shipped': return 'bg-blue-100 text-blue-800';
            case 'Delivered': return 'bg-green-100 text-green-800';
            case 'Canceled': return 'bg-gray-100 text-gray-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };
    
    const subtotal = order.items.reduce((acc, item) => acc + item.price * item.quantity, 0);
    const shipping = 5.99;
    const tax = subtotal * 0.08;

    const timeline = [
        { status: 'Order Placed', date: new Date(order.date).toLocaleString(), complete: true },
        { status: 'Payment Confirmed', date: new Date(new Date(order.date).getTime() + 5 * 60000).toLocaleString(), complete: true },
        { status: 'Shipped', date: order.status === 'Shipped' || order.status === 'Delivered' ? new Date(new Date(order.date).getTime() + 2 * 3600 * 1000).toLocaleString() : 'Pending', complete: order.status === 'Shipped' || order.status === 'Delivered' },
        { status: 'Delivered', date: order.status === 'Delivered' ? new Date(new Date(order.date).getTime() + 48 * 3600 * 1000).toLocaleString() : 'Pending', complete: order.status === 'Delivered' },
    ];

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex justify-between items-center mb-6">
                <button onClick={onBack} className="flex items-center text-sm font-semibold text-gray-600 hover:text-gray-900">
                    <ChevronLeftIcon />
                    <span className="ml-1">Back to Orders</span>
                </button>
                <div className="flex items-center space-x-2">
                    <span className={`px-3 py-1 text-sm font-semibold rounded-full ${getStatusClass(order.status)}`}>{order.status}</span>
                    <button className="p-2 border rounded-md hover:bg-gray-50" title="Print Invoice">
                        <PrinterIcon />
                    </button>
                </div>
            </div>

            <h1 className="text-2xl font-bold text-gray-800">
                Order {order.orderId}
                <span className="ml-3 text-sm font-normal text-gray-500">{new Date(order.date).toLocaleDateString()}</span>
            </h1>

            <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Column (Order Details & Items) */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white p-6 rounded-lg shadow-md">
                        <h2 className="text-lg font-bold text-gray-800 mb-4">Items Ordered</h2>
                        <ul className="divide-y divide-gray-200">
                            {order.items.map(item => (
                                <li key={item.sku} className="py-4 flex items-center">
                                    <Image src={item.image} alt={item.name} className="h-16 w-16 object-contain rounded-md mr-4" />
                                    <div className="grow">
                                        <p className="font-semibold text-gray-800">{item.name}</p>
                                        <p className="text-sm text-gray-500">SKU: {item.sku}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-semibold text-gray-800">${item.price.toFixed(2)}</p>
                                        <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                                    </div>
                                </li>
                            ))}
                        </ul>
                         <div className="mt-4 pt-4 border-t text-right space-y-2 text-sm">
                            <p className="flex justify-between"><span>Subtotal:</span> <span>${subtotal.toFixed(2)}</span></p>
                            <p className="flex justify-between"><span>Shipping:</span> <span>${shipping.toFixed(2)}</span></p>
                            <p className="flex justify-between"><span>Tax (8%):</span> <span>${tax.toFixed(2)}</span></p>
                            <p className="flex justify-between font-bold text-base"><span>Total:</span> <span>${order.total.toFixed(2)}</span></p>
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-lg shadow-md">
                        <h2 className="text-lg font-bold text-gray-800 mb-4">Order Timeline</h2>
                        <div className="relative">
                             <div className="absolute left-3 h-full border-l-2 border-gray-200"></div>
                             {timeline.map((event, index) => (
                                <div key={index} className="flex items-start mb-6">
                                    <div className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center ${event.complete ? 'bg-blue-600' : 'bg-gray-300'}`}>
                                        {event.complete && <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>}
                                    </div>
                                    <div className="ml-4">
                                        <p className={`font-semibold ${event.complete ? 'text-gray-800' : 'text-gray-500'}`}>{event.status}</p>
                                        <p className="text-sm text-gray-500">{event.date}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Right Column (Customer & Shipping) */}
                <div className="space-y-6">
                    <div className="bg-white p-6 rounded-lg shadow-md">
                        <h2 className="text-lg font-bold text-gray-800 mb-4">Customer</h2>
                        <div className="flex items-center">
                            <Image width={48} height={48} src={order.customerAvatar} alt={order.customerName} className="h-12 w-12 rounded-full mr-4"/>
                            <div>
                                <p className="font-semibold text-gray-900">{order.customerName}</p>
                                <p className="text-sm text-gray-500">{order.customerEmail}</p>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white p-6 rounded-lg shadow-md">
                        <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center"><PackageIcon className="mr-2 h-5 w-5 text-gray-500" /> Shipping Address</h2>
                        <address className="not-italic text-sm text-gray-600">
                           {order.shippingAddress.split(',').map(line => <p key={line}>{line.trim()}</p>)}
                        </address>
                    </div>
                     <div className="bg-white p-6 rounded-lg shadow-md">
                        <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center"><CreditCardIcon className="mr-2 h-5 w-5 text-gray-500" /> Payment Information</h2>
                        <div className="text-sm text-gray-600">
                           <p><strong>Method:</strong> {order.paymentMethod.split(' ')[0]}</p>
                           <p><strong>Details:</strong> {order.paymentMethod.split(' ').slice(1).join(' ')}</p>
                           <p className="mt-2 text-green-600 font-semibold">Payment successful</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminOrderDetail;