import React from "react";
import {
  ChevronDownIcon,
  ExternalLinkIcon,
} from "lucide-react";
import { getTopSellingProducts } from "@/actions/admin.actions";

/* ----------------------------------
   PAGE
----------------------------------- */

const AdminAnalytics = async () => {
  const result = await getTopSellingProducts();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sticky Header */}
      <header className="sticky top-0 z-20 bg-white border-b">
        <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">
          <h1 className="text-lg font-semibold text-gray-900">
            Business Analytics
          </h1>

          <button className="flex items-center gap-2 text-sm border px-3 py-1.5 rounded hover:bg-gray-50">
            Last 30 days
            <ChevronDownIcon className="w-4 h-4" />
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-6">
        {/* KPI STRIP */}
        <section className="grid grid-cols-2 lg:grid-cols-5 gap-4">
          <Stat title="Revenue" value="134,842 MAD" delta="+12.5%" />
          <Stat title="Orders" value="884" delta="+8.1%" />
          <Stat title="Conversion Rate" value="3.45%" delta="+0.8%" />
          <Stat title="COD Success" value="82%" delta="-3%" negative />
          <Stat title="Avg Order Value" value="152 MAD" delta="+1.2%" />
        </section>

        {/* MAIN CHART */}
        <section className="mt-8 bg-white border rounded-md p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-gray-900">
              Revenue & Orders (Daily)
            </h2>
            <span className="text-xs text-gray-500">
              Compared to previous period
            </span>
          </div>

          {/* Chart placeholder */}
          <div className="h-72 flex items-center justify-center text-gray-400 text-sm border rounded">
            Chart Component (Revenue + Orders)
          </div>
        </section>

        {/* CONVERSION FUNNEL */}
        <section className="mt-8">
          <h2 className="text-sm font-semibold text-gray-900 mb-3">
            Conversion Funnel
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <FunnelStep label="Sessions" value="21,482" />
            <FunnelStep label="Product Views" value="9,340" />
            <FunnelStep label="Add to Cart" value="2,180" />
            <FunnelStep label="Orders" value="884" highlight />
          </div>
        </section>

        {/* TOP SELLING PRODUCTS */}
        <section className="mt-10 bg-white border rounded-md">
          <div className="px-5 py-4 border-b">
            <h2 className="text-sm font-semibold text-gray-900">
              Top Selling Products
            </h2>
          </div>

          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-600">
              <tr>
                <th className="px-4 py-3 text-left">#</th>
                <th className="px-4 py-3 text-left">Product</th>
                <th className="px-4 py-3 text-right">Units Sold</th>
                <th className="px-4 py-3 text-right">Revenue</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>

            <tbody>
              {result.data?.map((p, index) => (
                <tr
                  key={p.productId}
                  className="border-t hover:bg-gray-50 transition"
                >
                  <td className="px-4 py-3 font-medium">
                    {index + 1}
                  </td>

                  <td className="px-4 py-3 flex items-center gap-3">
                    <img
                      src={p.thumbnail as string}
                      alt={p.name}
                      className="w-9 h-9 rounded object-cover border"
                    />
                    <span className="font-medium text-gray-900">
                      {p.name}
                    </span>
                  </td>

                  <td className="px-4 py-3 text-right">
                    {p.totalQuantitySold}
                  </td>

                  <td className="px-4 py-3 text-right font-semibold">
                    {p.totalRevenue} MAD
                  </td>

                  <td className="px-4 py-3 text-right">
                    <ExternalLinkIcon className="w-4 h-4 text-gray-400 hover:text-gray-700 cursor-pointer" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        {/* GEO & COD INSIGHTS */}
        <section className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
          <InsightCard
            title="Revenue by City"
            description="Casablanca · Rabat · Marrakech dominate total revenue"
          />

          <InsightCard
            title="COD Delivery Performance"
            description="82% delivered · 18% returned (watch high-risk cities)"
          />
        </section>
      </main>
    </div>
  );
};

/* ----------------------------------
   COMPONENTS
----------------------------------- */

const Stat = ({
  title,
  value,
  delta,
  negative,
}: {
  title: string;
  value: string;
  delta: string;
  negative?: boolean;
}) => (
  <div className="bg-white border rounded-md p-4">
    <p className="text-xs text-gray-500">{title}</p>
    <p className="text-xl font-semibold text-gray-900 mt-1">
      {value}
    </p>
    <p
      className={`text-xs mt-1 ${
        negative ? "text-red-600" : "text-green-600"
      }`}
    >
      {delta} vs previous
    </p>
  </div>
);

const FunnelStep = ({
  label,
  value,
  highlight,
}: {
  label: string;
  value: string;
  highlight?: boolean;
}) => (
  <div
    className={`border rounded-md p-4 ${
      highlight ? "bg-gray-50" : "bg-white"
    }`}
  >
    <p className="text-xs text-gray-500">{label}</p>
    <p className="text-lg font-semibold text-gray-900 mt-1">
      {value}
    </p>
  </div>
);

const InsightCard = ({
  title,
  description,
}: {
  title: string;
  description: string;
}) => (
  <div className="bg-white border rounded-md p-5">
    <h3 className="text-sm font-semibold text-gray-900 mb-1">
      {title}
    </h3>
    <p className="text-sm text-gray-600">
      {description}
    </p>
  </div>
);

export default AdminAnalytics;
