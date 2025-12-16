
import React from 'react';

export const CheckmarkIcon: React.FC<{className?: string}> = ({className}) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className || "h-6 w-6"} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);
const mockOrder = {
    orderNumber: '113-8937428-8473051',
    estimatedDelivery: 'Tuesday, October 29',
    shippingAddress: {
        name: 'John Doe',
        street: '123 Amazon Lane',
        cityStateZip: 'Seattle, WA 98109',
       
    },
    items: [
        {
            id: 1,
            name: 'Echo Dot (5th Gen) | Smart speaker with Alexa | Charcoal',
            image: 'https://m.media-amazon.com/images/I/71Que-d6-wL._AC_UY218_.jpg',
            price: 49.99,
            quantity: 1,
        },
        {
            id: 2,
            name: 'Kindle Paperwhite (16 GB) – Now with a 6.8" display and adjustable warm light',
            image: 'https://m.media-amazon.com/images/I/61-fwv2G7GL._AC_UY218_.jpg',
            price: 139.99,
            quantity: 1,
        }
    ],
    total: 194.38
};

const ThankYou: React.FC = () => {
    return (
        <main className="max-w-4xl mx-auto p-4 md:p-6">
            <div className="flex items-start mb-4">
                <CheckmarkIcon className="h-8 w-8 text-green-600 mr-3 mt-1 flex-shrink-0" />
                <div>
                    <h1 className="text-xl md:text-2xl font-semibold text-green-700">Thank you, your order has been placed.</h1>
                    <p className="text-sm text-gray-600 mt-1">
                        A confirmation email has been sent to your-email@example.com.
                    </p>
                </div>
            </div>

            <div className="border border-gray-300 rounded-lg p-4 mb-6 bg-white">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-y-4 gap-x-4">
                    <div className="sm:col-span-2 md:col-span-1">
                        <h2 className="text-lg font-bold text-green-700">Arriving</h2>
                        <p className="font-semibold text-gray-800">{mockOrder.estimatedDelivery}</p>
                    </div>
                    <div className="md:col-span-1">
                        <h2 className="text-lg font-bold text-gray-800">Your order will be sent to:</h2>
                        <address className="text-sm text-gray-600 not-italic">
                            {mockOrder.shippingAddress.name} <br />
                            {mockOrder.shippingAddress.street} <br />
                            {mockOrder.shippingAddress.cityStateZip} <br />
                            
                        </address>
                    </div>
                     <div className="sm:col-span-2 md:col-span-1 md:text-right">
                        <p className="text-sm text-gray-600">Order #{mockOrder.orderNumber}</p>
                    </div>
                </div>
                
                <div className="mt-4 border-t border-gray-200 divide-y divide-gray-200">
                     {mockOrder.items.map(item => (
                        <div key={item.id} className="flex flex-col sm:flex-row items-start sm:items-center py-4">
                            <img src={item.image} alt={item.name} className="w-20 h-20 object-contain mr-4 mb-2 sm:mb-0"/>
                            <div className="flex-grow">
                                <h3 className="font-semibold text-gray-800 text-sm">{item.name}</h3>
                                <button className="w-full sm:w-auto bg-yellow-400 hover:bg-yellow-500 text-gray-800 text-xs py-1 px-3 rounded-lg mt-2 shadow-sm border border-yellow-500">
                                    Buy it again
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="flex flex-col sm:flex-row sm:justify-between items-center">
                 <div className="text-sm text-gray-600 mb-4 sm:mb-0 order-2 sm:order-1">
                    <a href="#" className="text-blue-600 hover:underline">Review or edit your recent orders</a>
                </div>
                <div className="order-1 sm:order-2 w-full sm:w-auto mb-4 sm:mb-0">
                    <button className="w-full sm:w-auto bg-gray-100 hover:bg-gray-200 text-gray-800 py-2 px-6 rounded-lg shadow-sm border border-gray-400">
                        Continue shopping
                    </button>
                </div>
            </div>
        </main>
    );
};

export default ThankYou;