"use client"
import React, { useState } from 'react';
// Correct: import GoogleGenAI according to guidelines
import { GoogleGenAI } from '@google/genai';
import { SpinnerIcon } from '@/components/shared/icons';
//import { SpinnerIcon } from "@/components/shared/icons";

const mockOrders = [
    {
        orderNumber: '113-8937428-8473051',
        orderPlacedDate: 'October 27, 2024',
        total: 194.38,
        shipTo: 'John Doe',
        deliveryDate: 'October 29, 2024',
        status: 'Delivered',
        items: [
            {
                id: 1,
                name: 'Echo Dot (5th Gen) | Smart speaker with Alexa | Charcoal',
                image: 'https://m.media-amazon.com/images/I/71Que-d6-wL._AC_UY218_.jpg',
            },
            {
                id: 2,
                name: 'Kindle Paperwhite (16 GB) – Now with a 6.8" display and adjustable warm light',
                image: 'https://m.media-amazon.com/images/I/61-fwv2G7GL._AC_UY218_.jpg',
            }
        ],
    },
    {
        orderNumber: '113-2948204-4485853',
        orderPlacedDate: 'September 15, 2024',
        total: 45.99,
        shipTo: 'John Doe',
        deliveryDate: 'September 17, 2024',
        status: 'Delivered',
        items: [
            {
                id: 3,
                name: 'Amazon Basics 48-Pack AA High-Performance Alkaline Batteries, 10-Year Shelf Life',
                image: 'https://m.media-amazon.com/images/I/71IdKRlm8+L._AC_UY218_.jpg',
            }
        ],
    },
];

const OrderHistory: React.FC = () => {
    const [isChatOpen, setIsChatOpen] = useState(false);
    const [chatInput, setChatInput] = useState('');
    const [chatHistory, setChatHistory] = useState<{ role: 'user' | 'model'; text: string }[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    const handleChatSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!chatInput.trim() || isLoading) return;

        const userMessage = { role: 'user' as const, text: chatInput };
        setChatHistory(prev => [...prev, userMessage]);
        const currentChatInput = chatInput;
        setChatInput('');
        setIsLoading(true);

        try {
            // Correct: Per guidelines, API key is assumed to be in process.env.API_KEY
            const ai = new GoogleGenAI({ apiKey: "AIzaSyBJ2zUdZVfkeCNB9cyAUNMazaqKPt_g5r8" });
            
            const systemInstruction = `You are a friendly and helpful Amazon customer service assistant. Your tone should be conversational and empathetic. Always be polite and address the user in a helpful manner. If a question is not related to the provided order history, politely decline and state that you can only answer questions about their orders.`;
            const prompt = `Here is the user's order history in JSON format: ${JSON.stringify(mockOrders)}. Please answer the user's question based on this data. The question is: "${currentChatInput}"`;

            // Correct: Per guidelines, use ai.models.generateContent
            const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash', // Correct: Per guidelines, use 'gemini-2.5-flash' for basic text tasks
                contents: prompt,
                config: {
                    systemInstruction: systemInstruction,
                }
            });
            
            // Correct: Per guidelines, extract text using response.text
            const modelResponse = { role: 'model' as const, text: response.text };
            setChatHistory(prev => [...prev, modelResponse]);

        } catch (error) {
            console.error("Error calling Gemini API:", error);
            const errorMessage = { role: 'model' as const, text: "Sorry, I'm having trouble connecting. Please try again later." };
            setChatHistory(prev => [...prev, errorMessage]);
        } finally {
            setIsLoading(false);
        }
    };
    
    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex justify-between items-center mb-4">
                <h1 className="text-2xl font-bold">Your Orders</h1>
                <div className="flex items-center space-x-4">
                    <input type="text" placeholder="Search all orders" className="border p-2 rounded-md hidden md:block" />
                    <button className="bg-gray-200 px-4 py-2 rounded-md hidden md:block">Search Orders</button>
                </div>
            </div>

            <ul className="flex space-x-6 border-b mb-4">
                <li><a href="#" className="text-blue-600 border-b-2 border-blue-600 pb-2">Orders</a></li>
                <li><a href="#" className="text-gray-600 hover:text-blue-600">Buy Again</a></li>
                <li><a href="#" className="text-gray-600 hover:text-blue-600">Not Yet Shipped</a></li>
                <li><a href="#" className="text-gray-600 hover:text-blue-600">Cancelled Orders</a></li>
            </ul>

            <div className="space-y-4">
                {mockOrders.map(order => (
                    <div key={order.orderNumber} className="border rounded-lg bg-white">
                        <div className="bg-gray-100 p-3 rounded-t-lg flex flex-col md:flex-row justify-between md:items-center text-sm">
                            <div className="flex flex-wrap gap-x-8 gap-y-2">
                                <div>
                                    <p className="text-gray-600">ORDER PLACED</p>
                                    <p>{order.orderPlacedDate}</p>
                                </div>
                                <div>
                                    <p className="text-gray-600">TOTAL</p>
                                    <p>${order.total.toFixed(2)}</p>
                                </div>
                                <div>
                                    <p className="text-gray-600">SHIP TO</p>
                                    <p className="text-blue-600 hover:underline cursor-pointer">{order.shipTo}</p>
                                </div>
                            </div>
                            <div className="mt-2 md:mt-0 text-left md:text-right">
                                <p className="text-gray-600">ORDER # {order.orderNumber}</p>
                            </div>
                        </div>
                        <div className="p-4">
                            <h2 className="text-lg font-bold mb-2">{order.status === 'Delivered' ? `Delivered ${order.deliveryDate}` : order.status}</h2>
                            {order.items.map(item => (
                                <div key={item.id} className="flex flex-col md:flex-row items-start space-y-4 md:space-y-0 md:space-x-4 mb-4">
                                    <img src={item.image} alt={item.name} className="w-24 h-24 object-contain" />
                                    <div className="flex-grow">
                                        <p className="text-blue-600 hover:underline cursor-pointer">{item.name}</p>
                                        <div className="flex space-x-2 mt-2">
                                            <button className="bg-yellow-400 hover:bg-yellow-500 text-black text-sm px-4 py-1 rounded-md">Buy it again</button>
                                            <button className="bg-gray-200 hover:bg-gray-300 text-black text-sm px-4 py-1 rounded-md">View your item</button>
                                        </div>
                                    </div>
                                    <div className="flex flex-col items-stretch space-y-2 w-full md:w-auto">
                                        <button className="bg-white border border-gray-300 text-black text-sm px-4 py-1 rounded-md w-full text-left">Track package</button>
                                        <button className="bg-white border border-gray-300 text-black text-sm px-4 py-1 rounded-md w-full text-left">Write a product review</button>
                                        <button className="bg-white border border-gray-300 text-black text-sm px-4 py-1 rounded-md w-full text-left">Archive order</button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
            
            {/* Gemini Chat Feature */}
            <div className="fixed bottom-4 right-4 z-10">
                <button
                    onClick={() => setIsChatOpen(!isChatOpen)}
                    className="bg-[#FEBD69] hover:bg-orange-400 text-black font-bold py-3 px-4 rounded-full shadow-lg"
                    aria-label="Ask about your orders"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                </button>
            </div>
            {isChatOpen && (
                <div className="fixed bottom-20 right-4 w-96 h-[32rem] bg-white rounded-lg shadow-2xl flex flex-col z-20">
                    <header className="bg-gray-800 text-white p-4 rounded-t-lg flex justify-between items-center">
                        <h2 className="font-bold">Ask about your orders</h2>
                        <button onClick={() => setIsChatOpen(false)}>&times;</button>
                    </header>
                    <div className="flex-grow p-4 overflow-y-auto">
                        <div className="space-y-4">
                            {chatHistory.map((msg, index) => (
                                <div key={index} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                    <div className={`p-3 rounded-lg max-w-xs ${msg.role === 'user' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-black'}`}>
                                        {msg.text}
                                    </div>
                                </div>
                            ))}
                            {isLoading && (
                                <div className="flex justify-start">
                                    <div className="p-3 rounded-lg max-w-xs bg-gray-200 text-black">
                                        ...
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                    <form onSubmit={handleChatSubmit} className="p-4 border-t">
                        <div className="flex items-center">
                            <div className="relative flex-grow">
                                <input
                                    type="text"
                                    value={chatInput}
                                    onChange={(e) => setChatInput(e.target.value)}
                                    placeholder="When was my Echo Dot delivered?"
                                    className="w-full p-2 pr-10 border rounded-l-md focus:outline-none focus:ring-2 focus:ring-orange-400"
                                    disabled={isLoading}
                                    aria-label="Chat input"
                                />
                                {isLoading && (
                                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                                        <SpinnerIcon />
                                    </div>
                                )}
                            </div>
                            <button
                                type="submit"
                                className="bg-[#FEBD69] hover:bg-orange-400 p-2 rounded-r-md disabled:opacity-50"
                                disabled={isLoading}
                                aria-label="Send message"
                            >
                                Send
                            </button>
                        </div>
                    </form>
                </div>
            )}
        </div>
    );
};

export default OrderHistory;