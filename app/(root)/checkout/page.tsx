"use client"
import { LockIcon } from 'lucide-react';
import React, { useState } from 'react';
// import { LockIcon } from "@/components/shared/icons"

const mockItems = [
    {
        id: 1,
        name: 'Echo Dot (5th Gen) | Smart speaker with Alexa | Charcoal',
        image: 'https://m.media-amazon.com/images/I/71Que-d6-wL._AC_UY218_.jpg',
        price: 49.99,
        quantity: 1,
        giftable: true,
        stock: 5,
    },
    {
        id: 2,
        name: 'Kindle Paperwhite (16 GB) – Now with a 6.8" display and adjustable warm light',
        image: 'https://m.media-amazon.com/images/I/61-fwv2G7GL._AC_UY218_.jpg',
        price: 139.99,
        quantity: 1,
        giftable: false,
        stock: 10,
    }
];

const Checkout: React.FC = () => {
    const [cartItems, setCartItems] = useState(mockItems);

    const handleQuantityChange = (id: number, newQuantity: number) => {
        setCartItems(items => items.map(item => item.id === id ? { ...item, quantity: newQuantity } : item));
    };

    const handleDelete = (id: number) => {
        setCartItems(items => items.filter(item => item.id !== id));
    };

    const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
    const shipping = 0.00; // Assuming free shipping
    const tax = subtotal * 0.08; // Example tax rate
    const total = subtotal + shipping + tax;

    return (
        <main className="max-w-6xl mx-auto p-4">
            <h1 className="text-2xl md:text-3xl font-semibold text-gray-800 mb-4">Checkout</h1>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Column */}
                <div className="lg:col-span-2  space-y-4">
                    {/* Shipping Address */}
                    <div className="border bg-white border-gray-300 rounded-lg p-4">
                        <div className="flex justify-between items-start">
                            <div className="flex">
                                <span className="text-lg font-bold text-gray-800 mr-4">1</span>
                                <div>
                                    <h2 className="text-lg font-bold text-gray-800">Shipping address</h2>
                                    <p className="text-sm text-gray-600 mt-2">
                                        John Doe <br />
                                        123 Amazon Lane <br />
                                        Seattle, WA 98109 <br />
                                        United States
                                    </p>
                                </div>
                            </div>
                            <button className="text-sm text-blue-600 hover:underline">Change</button>
                        </div>
                    </div>

                    {/* Payment Method */}
                    <div className="border bg-white border-gray-300 rounded-lg p-4">
                        <div className="flex justify-between items-start">
                            <div className="flex">
                                <span className="text-lg font-bold text-gray-800 mr-4">2</span>
                                <div>
                                    <h2 className="text-lg font-bold text-gray-800">Payment method</h2>
                                    <div className="flex items-center mt-2">
                                        <img src="https://images-na.ssl-images-amazon.com/images/G/01/checkout/payselect/card-logos-small/visa._CB485936331_.gif" alt="Visa" className="h-5 mr-2" />
                                        <p className="text-sm text-gray-600">
                                            Visa ending in 1234
                                        </p>
                                    </div>
                                    <p className="text-sm text-gray-500 mt-1">Billing address: Same as shipping address</p>
                                </div>
                            </div>
                            <button className="text-sm text-blue-600 hover:underline">Change</button>
                        </div>
                    </div>

                    {/* Review Items */}
                    <div className="border border-gray-300 rounded-lg bg-white">
                        <div className="flex items-start p-4">
                            <span className="text-lg font-bold text-gray-800 mr-4">3</span>
                            <h2 className="text-lg font-bold text-gray-800">Review items and shipping</h2>
                        </div>
                        <div className="p-4 border-t border-gray-200">
                            <h3 className="text-lg font-semibold text-green-700 mb-2">Estimated delivery: Monday, October 28</h3>
                            <p className="text-sm text-gray-600 mb-4">Items dispatched by Amazon</p>
                            
                            <div className="space-y-6">
                                {cartItems.map(item => (
                                    <div key={item.id} className="flex flex-col sm:flex-row">
                                        <img src={item.image} alt={item.name} className="w-24 h-24 object-contain self-center sm:self-start mr-4 mb-2 sm:mb-0"/>
                                        <div className="flex-grow">
                                            <h4 className="font-semibold text-gray-800">{item.name}</h4>
                                            <p className="text-lg font-bold text-red-700">${item.price.toFixed(2)}</p>
                                            {item.giftable && (
                                                <div className="flex items-center my-1">
                                                    <input type="checkbox" id={`gift-${item.id}`} className="mr-2 h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500" />
                                                    <label htmlFor={`gift-${item.id}`} className="text-sm text-gray-700">This is a gift</label>
                                                </div>
                                            )}
                                            <div className="flex items-center mt-2 space-x-2">
                                                <select 
                                                    value={item.quantity} 
                                                    onChange={(e) => handleQuantityChange(item.id, parseInt(e.target.value))}
                                                    className="text-sm p-1 border border-gray-300 rounded-md bg-gray-50 shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                                                >
                                                    {[...Array(item.stock > 10 ? 10 : item.stock).keys()].map(n => (
                                                        <option key={n + 1} value={n + 1}>Qty: {n + 1}</option>
                                                    ))}
                                                </select>
                                                <button onClick={() => handleDelete(item.id)} className="text-sm text-blue-600 hover:underline">Delete</button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column (Order Summary) */}
                <div className="lg:col-span-1">
                    <div className="border bg-white border-gray-300 rounded-lg p-4 sticky top-4">
                        <h2 className="text-xl font-bold text-gray-800 mb-4">Order Summary</h2>
                        <div className="space-y-2 text-sm text-gray-700">
                            <div className="flex justify-between">
                                <span>Items ({cartItems.reduce((acc, item) => acc + item.quantity, 0)}):</span>
                                <span>${subtotal.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Shipping & handling:</span>
                                <span>${shipping.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between pb-2 border-b border-gray-200">
                                <span>Total before tax:</span>
                                <span>${(subtotal + shipping).toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between pt-2">
                                <span>Estimated tax to be collected:</span>
                                <span>${tax.toFixed(2)}</span>
                            </div>
                        </div>
                        <div className="flex justify-between text-lg font-bold text-red-700 mt-4 pt-4 border-t border-gray-300">
                            <h3>Order total:</h3>
                            <h3>${total.toFixed(2)}</h3>
                        </div>
                        <button className="w-full bg-yellow-400 hover:bg-yellow-500 text-gray-800 font-bold py-2 px-4 rounded-lg mt-4 shadow-md focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-opacity-50 transition duration-200">
                            Place your order
                        </button>
                        <div className="text-xs text-gray-500 mt-4 flex items-start">
                            <LockIcon className="h-4 w-4 mr-1 mt-0.5 shrink-0" />
                            <span>
                                By placing your order, you agree to Amazon's privacy notice and conditions of use.
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
};

export default Checkout;