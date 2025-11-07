
import { ChevronDownIcon, DollarSignIcon, ExternalLinkIcon, ShoppingCartIcon, TargetIcon, UsersIcon } from 'lucide-react';
import React from 'react';
// import { DollarSignIcon, ShoppingCartIcon, TargetIcon, UsersIcon, ChevronDownIcon, ExternalLinkIcon } from "@/components/shared/icons"

const AdminAnalytics: React.FC = () => {
    return (
        <div className="container mx-auto px-4 py-8">
            {/* Page Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
                <h1 className="text-3xl font-bold text-gray-800 mb-2 sm:mb-0">Analytics Dashboard</h1>
                <button className="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-md font-semibold hover:bg-gray-50 transition-colors text-sm flex items-center gap-2">
                    <span>Last 30 Days</span>
                    <ChevronDownIcon className="h-4 w-4" />
                </button>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <KpiCard title="Total Sales" value="$134,842.10" change="+12.5%" icon={<DollarSignIcon />} />
                <KpiCard title="Avg. Order Value" value="$152.45" change="-1.2%" positiveChange={false} icon={<ShoppingCartIcon />} />
                <KpiCard title="Conversion Rate" value="3.45%" change="+0.8%" icon={<TargetIcon />} />
                <KpiCard title="Total Sessions" value="21,482" change="+22.1%" icon={<UsersIcon />} />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Content: Sales Chart */}
                <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow-md">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-bold text-gray-800">Sales Overview</h2>
                        <div className="flex items-center gap-4 text-sm">
                            <div className="flex items-center gap-2"><span className="h-2 w-2 bg-blue-500 rounded-full"></span>This Period</div>
                            <div className="flex items-center gap-2"><span className="h-2 w-2 bg-gray-300 rounded-full"></span>Last Period</div>
                        </div>
                    </div>
                    {/* Placeholder for chart */}
                    <div className="h-80 w-full">
                        <svg width="100%" height="100%" viewBox="0 0 500 250" preserveAspectRatio="xMidYMid meet">
                            {/* Grid lines */}
                            {[1, 2, 3, 4, 5].map(i => (
                                <line key={i} x1="0" y1={i * 50} x2="500" y2={i * 50} stroke="#e5e7eb" strokeWidth="1" />
                            ))}
                            <line x1="0" y1="250" x2="500" y2="250" stroke="#d1d5db" strokeWidth="1" />
                             {/* Labels */}
                            <text x="0" y="245" fill="#6b7280" fontSize="10">0</text>
                            <text x="0" y="195" fill="#6b7280" fontSize="10">2.5k</text>
                            <text x="0" y="145" fill="#6b7280" fontSize="10">5k</text>
                            <text x="0" y="95" fill="#6b7280" fontSize="10">7.5k</text>
                            <text x="0" y="45" fill="#6b7280" fontSize="10">10k</text>
                            {/* Data lines */}
                            <polyline points="0,200 50,180 100,190 150,150 200,160 250,120 300,100 350,110 400,80 450,90 500,60" fill="none" stroke="#3b82f6" strokeWidth="2" />
                            <polyline points="0,220 50,210 100,215 150,190 200,195 250,170 300,160 350,165 400,140 450,150 500,130" fill="none" stroke="#d1d5db" strokeWidth="2" strokeDasharray="4" />
                        </svg>
                    </div>
                </div>

                {/* Right Column: Top Products & Device Sessions */}
                <div className="space-y-6">
                    <div className="bg-white p-6 rounded-lg shadow-md">
                        <h2 className="text-xl font-bold text-gray-800 mb-4">Top Selling Products</h2>
                        <ul className="space-y-4">
                           <ProductListItem image="https://m.media-amazon.com/images/I/71Que-d6-wL._AC_UY218_.jpg" name="Echo Dot (5th Gen)" sales="1,204 units" />
                           <ProductListItem image="https://m.media-amazon.com/images/I/61-fwv2G7GL._AC_UY218_.jpg" name="Kindle Paperwhite (16 GB)" sales="982 units" />
                           <ProductListItem image="https://m.media-amazon.com/images/I/51km+p3mP-L._AC_UY218_.jpg" name="Fire TV Stick 4K Max" sales="856 units" />
                        </ul>
                    </div>
                     <div className="bg-white p-6 rounded-lg shadow-md">
                        <h2 className="text-xl font-bold text-gray-800 mb-4">Sessions By Device</h2>
                         <div className="flex items-center justify-center gap-8">
                             <div className="relative w-32 h-32">
                                <svg className="w-full h-full" viewBox="0 0 36 36">
                                    <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#e5e7eb" strokeWidth="3" />
                                    <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831" fill="none" stroke="#3b82f6" strokeWidth="3" strokeDasharray="60, 100" />
                                    <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831" fill="none" stroke="#34d399" strokeWidth="3" strokeDasharray="30, 100" strokeDashoffset="-60" />
                                </svg>
                                <div className="absolute inset-0 flex items-center justify-center flex-col">
                                    <span className="text-2xl font-bold text-gray-800">21k</span>
                                    <span className="text-xs text-gray-500">Sessions</span>
                                </div>
                             </div>
                             <ul className="text-sm space-y-2">
                                <li><div className="flex items-center gap-2"><span className="h-2 w-2 bg-blue-500 rounded-full"></span>Desktop: 60%</div></li>
                                <li><div className="flex items-center gap-2"><span className="h-2 w-2 bg-emerald-400 rounded-full"></span>Mobile: 30%</div></li>
                                <li><div className="flex items-center gap-2"><span className="h-2 w-2 bg-gray-200 rounded-full"></span>Tablet: 10%</div></li>
                             </ul>
                         </div>
                    </div>
                </div>
            </div>
            
            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h2 className="text-xl font-bold text-gray-800 mb-4">Sales by Channel</h2>
                    <ul className="space-y-3 text-sm">
                        <ChannelListItem name="Direct" value="40%" percentage={40} color="bg-blue-500" />
                        <ChannelListItem name="Organic Search" value="30%" percentage={30} color="bg-green-500" />
                        <ChannelListItem name="Social Media" value="15%" percentage={15} color="bg-sky-400" />
                        <ChannelListItem name="Referral" value="10%" percentage={10} color="bg-purple-500" />
                        <ChannelListItem name="Email Marketing" value="5%" percentage={5} color="bg-red-500" />
                    </ul>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-md">
                     <h2 className="text-xl font-bold text-gray-800 mb-4">Top Referrers</h2>
                     <ul className="space-y-3 text-sm divide-y">
                        <ReferrerListItem name="google.com" visitors="4,821" />
                        <ReferrerListItem name="facebook.com" visitors="2,109" />
                        <ReferrerListItem name="techcrunch.com" visitors="1,583" />
                        <ReferrerListItem name="instagram.com" visitors="974" />
                     </ul>
                </div>
            </div>
        </div>
    );
};

const KpiCard: React.FC<{ title: string; value: string; change: string; icon: React.ReactNode; positiveChange?: boolean }> = ({ title, value, change, icon, positiveChange = true }) => (
    <div className="bg-white p-5 rounded-lg shadow-md flex items-center justify-between">
        <div>
            <p className="text-sm font-medium text-gray-500">{title}</p>
            <p className="text-2xl font-bold text-gray-800 mt-1">{value}</p>
            <p className={`text-xs mt-1 ${positiveChange ? 'text-green-500' : 'text-red-500'}`}>{change}</p>
        </div>
        <div className="bg-gray-100 p-3 rounded-full text-gray-600">
            {icon}
        </div>
    </div>
);

const ProductListItem: React.FC<{image: string, name: string, sales: string}> = ({image, name, sales}) => (
    <li className="flex items-center justify-between">
        <div className="flex items-center gap-3">
            <img src={image} alt={name} className="h-10 w-10 object-contain rounded-md" />
            <div>
                <p className="text-sm font-medium text-gray-800">{name}</p>
                <p className="text-xs text-gray-500">{sales}</p>
            </div>
        </div>
        <button className="text-gray-400 hover:text-blue-600"><ExternalLinkIcon /></button>
    </li>
);

const ChannelListItem: React.FC<{name: string, value: string, percentage: number, color: string}> = ({ name, value, percentage, color }) => (
    <li>
        <div className="flex justify-between mb-1">
            <span className="font-medium text-gray-700">{name}</span>
            <span className="text-gray-500">{value}</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-1.5">
            <div className={`${color} h-1.5 rounded-full`} style={{ width: `${percentage}%` }}></div>
        </div>
    </li>
);

const ReferrerListItem: React.FC<{name: string, visitors: string}> = ({name, visitors}) => (
     <li className="flex items-center justify-between pt-3 first:pt-0">
        <p className="font-medium text-gray-700">{name}</p>
        <p className="text-gray-600">{visitors} visitors</p>
    </li>
);


export default AdminAnalytics;