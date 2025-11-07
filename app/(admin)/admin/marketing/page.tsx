"use client"
import React, { useState } from 'react';
import {  DotsVerticalIcon, DuplicateIcon} from "@/components/shared/icons"
import { ChartBarIcon, MailIcon, MegaphoneIcon, PencilIcon, ShareIcon, TagIcon, TrendingUpIcon, UsersIcon } from 'lucide-react';

type CampaignStatus = 'Active' | 'Scheduled' | 'Draft' | 'Completed';
type CampaignType = 'Email' | 'Social Media' | 'Search Ads';

interface Campaign {
    id: string;
    name: string;
    type: CampaignType;
    status: CampaignStatus;
    startDate: string;
    endDate: string;
    budget: number;
    reach: number;
    ctr: number; // Click-Through Rate
    conversions: number;
    image: string;
}

const mockCampaigns: Campaign[] = [
    { id: 'CAMP-001', name: 'Summer Sale 2024', type: 'Email', status: 'Active', startDate: '2024-07-15', endDate: '2024-08-15', budget: 5000, reach: 150000, ctr: 4.5, conversions: 1200, image: 'https://images.unsplash.com/photo-1529333166437-7750a6dd5a70?q=80&w=2069&auto=format&fit=crop&ixlib=rb-4.0.3' },
    { id: 'CAMP-002', name: 'New Product Launch: Echo Show 15', type: 'Social Media', status: 'Completed', startDate: '2024-06-01', endDate: '2024-06-30', budget: 12000, reach: 1200000, ctr: 2.1, conversions: 3500, image: 'https://images.unsplash.com/photo-1629196232230-2615e4a396d2?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3' },
    { id: 'CAMP-003', name: 'Back to School Deals', type: 'Search Ads', status: 'Scheduled', startDate: '2024-08-20', endDate: '2024-09-10', budget: 8000, reach: 0, ctr: 0, conversions: 0, image: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3' },
    { id: 'CAMP-004', name: 'Holiday Gift Guide', type: 'Email', status: 'Draft', startDate: '2024-11-01', endDate: '2024-12-24', budget: 25000, reach: 0, ctr: 0, conversions: 0, image: 'https://images.unsplash.com/photo-1510254397453-a75b21027b3b?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3' },
    { id: 'CAMP-005', name: 'Prime Day Early Access', type: 'Social Media', status: 'Active', startDate: '2024-07-10', endDate: '2024-07-14', budget: 50000, reach: 5000000, ctr: 6.8, conversions: 8500, image: 'https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?q=80&w=2069&auto=format&fit=crop&ixlib=rb-4.0.3' },
];

const AdminMarketing: React.FC = () => {
    const [activeTab, setActiveTab] = useState<CampaignStatus | 'All'>('All');
    
    const filteredCampaigns = activeTab === 'All' ? mockCampaigns : mockCampaigns.filter(c => c.status === activeTab);
    
    const getStatusClass = (status: CampaignStatus) => ({
        'Active': 'bg-green-100 text-green-800',
        'Scheduled': 'bg-blue-100 text-blue-800',
        'Draft': 'bg-yellow-100 text-yellow-800',
        'Completed': 'bg-gray-100 text-gray-800',
    }[status]);
    
    const getCampaignTypeIcon = (type: CampaignType) => ({
        'Email': <MailIcon className="h-5 w-5 text-red-500" />,
        'Social Media': <ShareIcon className="h-5 w-5 text-blue-500" />,
        'Search Ads': <TrendingUpIcon className="h-5 w-5 text-green-500" />,
    }[type]);

    return (
        <div className="container mx-auto px-4 py-8">
            {/* Page Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
                <h1 className="text-3xl font-bold text-gray-800 mb-2 sm:mb-0">Marketing</h1>
                <button className="bg-blue-600 text-white px-4 py-2 rounded-md font-semibold hover:bg-blue-700 transition-colors flex items-center gap-2">
                    <MegaphoneIcon className="h-5 w-5" />
                    Create Campaign
                </button>
            </div>
            
            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <KpiCard title="Total Reach" value="6.35M" change="+15.2%" icon={<UsersIcon className="text-blue-500" />} />
                <KpiCard title="Engagement Rate" value="3.8%" change="+0.5%" icon={<TrendingUpIcon className="text-green-500" />} />
                <KpiCard title="Total Conversions" value="13.2K" change="+21.7%" icon={<ChartBarIcon />} />
                <KpiCard title="Campaign ROI" value="257%" change="-2.1%" positiveChange={false} icon={<span className="text-2xl font-bold text-purple-500">$</span>} />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Content: Campaigns */}
                <div className="lg:col-span-2">
                    <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md">
                        <div className="flex justify-between flex-wrap items-center mb-4">
                            <h2 className="text-xl font-bold text-gray-800">Campaigns</h2>
                            <div className="flex border-b">
                                {(['All', 'Active', 'Scheduled', 'Draft', 'Completed'] as const).map(tab => (
                                    <button
                                        key={tab}
                                        onClick={() => setActiveTab(tab)}
                                        className={`px-3 py-1 text-sm font-semibold ${activeTab === tab ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-500 hover:text-gray-800'}`}
                                    >
                                        {tab}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Campaigns Table (Desktop) */}
                        <div className="overflow-x-auto hidden md:block">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Campaign</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Timeline</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Conversions</th>
                                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {filteredCampaigns.map(c => (
                                        <tr key={c.id} className="hover:bg-gray-50">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center">
                                                    <div className="flex-shrink-0 h-10 w-10 bg-gray-100 rounded-md flex items-center justify-center">
                                                        {getCampaignTypeIcon(c.type)}
                                                    </div>
                                                    <div className="ml-4">
                                                        <div className="text-sm font-medium text-gray-900">{c.name}</div>
                                                        <div className="text-sm text-gray-500">{c.type}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4"><span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusClass(c.status)}`}>{c.status}</span></td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{c.startDate} - {c.endDate}</td>
                                            <td className="px-6 py-4 text-sm font-medium text-gray-900">{c.conversions.toLocaleString()}</td>
                                            <td className="px-6 py-4 text-right text-sm">
                                                <div className="flex items-center justify-end space-x-3">
                                                    <button className="text-gray-400 hover:text-blue-600" title="Edit"><PencilIcon /></button>
                                                    <button className="text-gray-400 hover:text-green-600" title="Duplicate"><DuplicateIcon /></button>
                                                    <button className="text-gray-400 hover:text-purple-600" title="View Report"><ChartBarIcon /></button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        
                        {/* Campaigns List (Mobile) */}
                        <div className="md:hidden space-y-4">
                            {filteredCampaigns.map(c => (
                                <div key={c.id} className="bg-white border rounded-lg p-4">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center">
                                            <div className="flex-shrink-0 h-10 w-10 bg-gray-100 rounded-md flex items-center justify-center">
                                                {getCampaignTypeIcon(c.type)}
                                            </div>
                                            <div className="ml-3">
                                                <p className="text-sm font-medium text-gray-900">{c.name}</p>
                                                <p className="text-xs text-gray-500">{c.type}</p>
                                            </div>
                                        </div>
                                        <button className="text-gray-500"><DotsVerticalIcon /></button>
                                    </div>
                                    <div className="mt-4 flex justify-between items-center">
                                        <div>
                                            <p className="text-gray-500 text-xs">Conversions</p>
                                            <p className="font-medium text-gray-800">{c.conversions.toLocaleString()}</p>
                                        </div>
                                        <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusClass(c.status)}`}>{c.status}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Right Column: Quick Tools */}
                <div className="space-y-6">
                    <div className="bg-white p-6 rounded-lg shadow-md">
                         <h2 className="text-xl font-bold text-gray-800 mb-4">Quick Tools</h2>
                         <div className="space-y-3">
                            <ToolCard title="Manage Promotions" description="Create and edit site-wide sales events." icon={<MegaphoneIcon className="text-blue-500" />} />
                            <ToolCard title="Discount Codes" description="Generate unique or bulk discount codes." icon={<TagIcon className="text-green-500" />} />
                            <ToolCard title="Audience Segments" description="Define and manage customer groups." icon={<UsersIcon className="text-purple-500" />} />
                         </div>
                    </div>
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
        <div className="bg-gray-100 p-3 rounded-full">
            {icon}
        </div>
    </div>
);

const ToolCard: React.FC<{ title: string; description: string; icon: React.ReactNode; }> = ({ title, description, icon }) => (
    <button className="w-full text-left p-4 border rounded-lg hover:bg-gray-50 hover:shadow-sm transition-all flex items-start space-x-4">
        <div className="bg-gray-100 p-3 rounded-lg mt-1">
            {icon}
        </div>
        <div>
            <p className="font-semibold text-gray-800">{title}</p>
            <p className="text-sm text-gray-500">{description}</p>
        </div>
    </button>
);


export default AdminMarketing;