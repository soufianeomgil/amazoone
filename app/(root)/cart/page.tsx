"use client"
import { useState, useMemo } from 'react';

interface CartItem {
  id: number;
  name: string;
  author: string;
  type: string;
  price: number;
  imageUrl: string;
  inStock: boolean;
  isGift: boolean;
  quantity: number;
  selected: boolean;
}

const initialCartItems: CartItem[] = [
  {
    id: 1,
    name: 'The Psychology of Money',
    author: 'Morgan Housel',
    type: 'Paperback',
    price: 15.99,
    imageUrl: 'https://images-na.ssl-images-amazon.com/images/I/81cpDaCJJCL._AC_UL600_SR600,400_.jpg',
    inStock: true,
    isGift: false,
    quantity: 1,
    selected: true,
  },
  {
    id: 2,
    name: 'Atomic Habits: An Easy & Proven Way to Build Good Habits & Break Bad Ones',
    author: 'James Clear',
    type: 'Hardcover',
    price: 11.98,
    imageUrl: 'https://images-na.ssl-images-amazon.com/images/I/81wgcld4wxL._AC_UL600_SR600,400_.jpg',
    inStock: true,
    isGift: false,
    quantity: 2,
    selected: true,
  },
  {
    id: 3,
    name: 'Sony WH-1000XM5 Wireless Noise Canceling Headphones',
    author: 'Sony',
    type: 'Electronics',
    price: 348.00,
    imageUrl: 'https://images-na.ssl-images-amazon.com/images/I/61vJtKbLoML._AC_UL600_SR600,400_.jpg',
    inStock: false,
    isGift: true,
    quantity: 1,
    selected: true,
  },
];


const page = () => {
    const [cartItems, setCartItems] = useState<CartItem[]>(initialCartItems);
    const [selectAll, setSelectAll] = useState(true);

    const handleQuantityChange = (id: number, quantity: number) => {
        setCartItems(prevItems =>
            prevItems.map(item => (item.id === id ? { ...item, quantity: quantity } : item))
        );
    };
    
    const handleItemSelectionChange = (id: number) => {
        const newItems = cartItems.map(item => {
            if (item.id === id) {
                return { ...item, selected: !item.selected };
            }
            return item;
        });
        setCartItems(newItems);
        setSelectAll(newItems.every(item => item.selected));
    };

    const handleSelectAllChange = () => {
        const newSelectAll = !selectAll;
        setSelectAll(newSelectAll);
        setCartItems(cartItems.map(item => ({...item, selected: newSelectAll})));
    }

    const handleDelete = (id: number) => {
        setCartItems(prevItems => prevItems.filter(item => item.id !== id));
    };

    const subtotal = useMemo(() => {
        return cartItems
            .filter(item => item.selected)
            .reduce((total, item) => total + item.price * item.quantity, 0);
    }, [cartItems]);

    const selectedItemCount = useMemo(() => {
        return cartItems.filter(item => item.selected).reduce((count, item) => count + item.quantity, 0);
    }, [cartItems]);

    const CartItemComponent: React.FC<{ item: CartItem }> = ({ item }) => (
        <div className="flex flex-col sm:flex-row py-4 border-b border-gray-200">
            <div className="shrink-0 mr-4 mb-4 sm:mb-0">
                <input type="checkbox" className="mr-4 h-4 w-4" checked={item.selected} onChange={() => handleItemSelectionChange(item.id)} />
                <img className="w-32 h-32 object-contain inline-block" src={item.imageUrl} alt={item.name} />
            </div>
            <div className="grow">
                <div className="flex justify-between">
                    <div className="w-3/4">
                        <h3 className="text-lg font-medium text-gray-900">{item.name}</h3>
                        <p className="text-sm text-gray-500">{item.author} | {item.type}</p>
                        {item.inStock ? (
                            <p className="text-sm text-green-700">In Stock</p>
                        ) : (
                            <p className="text-sm text-red-600">Out of Stock</p>
                        )}
                        <p className="text-sm text-gray-500">Eligible for FREE Shipping</p>
                        <div className="flex items-center my-2">
                            <input type="checkbox" id={`gift-${item.id}`} className="h-4 w-4" defaultChecked={item.isGift} />
                            <label htmlFor={`gift-${item.id}`} className="ml-2 text-sm text-gray-700">This is a gift</label>
                            <a href="#" className="ml-2 text-sm text-blue-600 hover:underline">Learn more</a>
                        </div>
                         <div className="flex items-center space-x-2 text-sm text-blue-600">
                            <select
                                value={item.quantity}
                                onChange={(e) => handleQuantityChange(item.id, parseInt(e.target.value))}
                                className="bg-gray-100 border border-gray-300 rounded-md shadow-sm p-1 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500"
                            >
                                {[...Array(10).keys()].map(n => (
                                    <option key={n + 1} value={n + 1}>Qty: {n + 1}</option>
                                ))}
                            </select>
                            <span className="text-gray-300">|</span>
                            <button onClick={() => handleDelete(item.id)} className="hover:underline">Delete</button>
                            <span className="text-gray-300">|</span>
                            <button className="hover:underline">Save for later</button>
                            <span className="text-gray-300">|</span>
                            <button className="hover:underline">Compare with similar items</button>
                        </div>
                    </div>
                    <div className="w-1/4 text-right">
                        <p className="text-lg font-bold text-gray-900">${item.price.toFixed(2)}</p>
                    </div>
                </div>
            </div>
        </div>
    );
    
    const CheckoutBox: React.FC<{isMobile?: boolean}> = ({ isMobile = false }) => (
         <div className={`bg-white p-4 rounded-md shadow-sm ${isMobile ? 'mb-4' : 'w-full'}`}>
            <p className="text-lg">
                Subtotal ({selectedItemCount} item{selectedItemCount !== 1 && 's'}): 
                <span className="font-bold ml-1">${subtotal.toFixed(2)}</span>
            </p>
            <div className="flex items-center my-2">
                <input type="checkbox" id="checkout-gift" className="h-4 w-4" />
                <label htmlFor="checkout-gift" className="ml-2 text-sm text-gray-700">This order contains a gift</label>
            </div>
            <button className="w-full bg-[#FFD814] hover:bg-[#F7CA00] text-black text-sm rounded-lg py-2 mt-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500">
                Proceed to checkout
            </button>
        </div>
    );

    return (
        <div className="max-w-7xl mx-auto p-4 grid grid-cols-1 lg:grid-cols-4 lg:gap-x-4">
           {/* Desktop Layout */}
            <div className="lg:col-span-3 order-2 lg:order-1 bg-white p-4 rounded-md shadow-sm">
                 <div className="flex justify-between items-baseline pb-2 border-b border-gray-200">
                    <h1 className="text-2xl font-semibold">Shopping Cart</h1>
                    <span className="text-sm text-gray-500">Price</span>
                </div>
                <div className="flex items-center py-2 text-sm">
                    <input type="checkbox" className="h-4 w-4 mr-2" checked={selectAll} onChange={handleSelectAllChange} />
                    <span>Select all items</span>
                </div>
                <hr/>
                {cartItems.map(item => (
                    <CartItemComponent key={item.id} item={item} />
                ))}
                <div className="text-right mt-4 text-lg">
                    Subtotal ({selectedItemCount} item{selectedItemCount !== 1 && 's'}): 
                    <span className="font-bold ml-1">${subtotal.toFixed(2)}</span>
                </div>
            </div>

            <div className="lg:col-span-1 order-1 lg:order-2">
                <div className="hidden lg:block">
                  <CheckoutBox />
                </div>
                <div className="lg:hidden">
                    <CheckoutBox isMobile />
                </div>
            </div>
        </div>
    );
};

export default page