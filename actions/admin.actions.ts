"use server"


import { auth } from "@/auth"
import connectDB from "@/database/db"
import handleError from "@/lib/handlers/error"
import { UnAuthorizedError } from "@/lib/http-errors"
import { CityRisk } from "@/models/BlackListCities.model"
import Order from "@/models/order.model"
import User from "@/models/user.model"
import { Session } from "next-auth";
export async function getRevenuePerCity(): Promise<
  ActionResponse<{
    cities: {
      city: string
      revenue: number
      ordersCount: number
    }[]
  }>
> {
    //const session: Session | null = await auth()
  try {
    // if(!session) throw new UnAuthorizedError('')
    //     if(!session && !session.user.isAdmin) throw new UnAuthorizedError("UnAuthorized, Admin access only")
    await connectDB()

    const cities = await Order.aggregate([
      // 1️⃣ Only real revenue orders
      {
        $match: {
          archived: { $ne: true },
          status: { $in: ["PAID", "DELIVERED"] },
        },
      },

      // 2️⃣ Group by city
      {
        $group: {
          _id: {
            city: { $toLower: "$shippingAddress.city" },
          },
          revenue: { $sum: "$total" },
          ordersCount: { $sum: 1 },
        },
      },

      // 3️⃣ Shape output
      {
        $project: {
          _id: 0,
          city: "$_id.city",
          revenue: { $round: ["$revenue", 2] },
          ordersCount: 1,
        },
      },

      // 4️⃣ Sort by revenue (top cities first)
      {
        $sort: { revenue: -1 },
      },
    ])

    return {
      success: true,
      data: {
        cities: JSON.parse(JSON.stringify(cities)),
      },
    }
  } catch (error) {
    return handleError(error) as ErrorResponse
  }
}
export async function getRevenueLastPeriods(): Promise<
  ActionResponse<{
    last7Days: {
      revenue: number
      ordersCount: number
    }
    last30Days: {
      revenue: number
      ordersCount: number
    }
  }>
> {
  try {
    await connectDB()

    const now = new Date()
    const sevenDaysAgo = new Date(now)
    sevenDaysAgo.setDate(now.getDate() - 7)

    const thirtyDaysAgo = new Date(now)
    thirtyDaysAgo.setDate(now.getDate() - 30)

    const results = await Order.aggregate([
      {
        $match: {
          archived: { $ne: true },
          status: { $in: ["PAID", "DELIVERED"] },
          createdAt: { $gte: thirtyDaysAgo },
        },
      },
      {
        $facet: {
          last7Days: [
            { $match: { createdAt: { $gte: sevenDaysAgo } } },
            {
              $group: {
                _id: null,
                revenue: { $sum: "$total" },
                ordersCount: { $sum: 1 },
              },
            },
          ],
          last30Days: [
            {
              $group: {
                _id: null,
                revenue: { $sum: "$total" },
                ordersCount: { $sum: 1 },
              },
            },
          ],
        },
      },
    ])

    const data = results[0] || {}

    return {
      success: true,
      data: {
        last7Days: {
          revenue: data.last7Days?.[0]?.revenue ?? 0,
          ordersCount: data.last7Days?.[0]?.ordersCount ?? 0,
        },
        last30Days: {
          revenue: data.last30Days?.[0]?.revenue ?? 0,
          ordersCount: data.last30Days?.[0]?.ordersCount ?? 0,
        },
      },
    }
  } catch (error) {
    return handleError(error) as ErrorResponse
  }
}

export async function getConversionRate(): Promise<
  ActionResponse<{
    last7Days: {
      viewers: number
      buyers: number
      conversionRate: number
    }
    last30Days: {
      viewers: number
      buyers: number
      conversionRate: number
    }
  }>
> {
  try {
    await connectDB()

    const now = new Date()
    const sevenDaysAgo = new Date(now)
    sevenDaysAgo.setDate(now.getDate() - 7)

    const thirtyDaysAgo = new Date(now)
    thirtyDaysAgo.setDate(now.getDate() - 30)

    // USERS WHO VIEWED PRODUCTS
    const viewersAgg = await User.aggregate([
      {
        $project: {
          hasViewed7: {
            $gt: [
              {
                $size: {
                  $filter: {
                    input: "$browsingHistory",
                    as: "b",
                    cond: { $gte: ["$$b.viewedAt", sevenDaysAgo] },
                  },
                },
              },
              0,
            ],
          },
          hasViewed30: {
            $gt: [
              {
                $size: {
                  $filter: {
                    input: "$browsingHistory",
                    as: "b",
                    cond: { $gte: ["$$b.viewedAt", thirtyDaysAgo] },
                  },
                },
              },
              0,
            ],
          },
        },
      },
      {
        $group: {
          _id: null,
          viewers7: { $sum: { $cond: ["$hasViewed7", 1, 0] } },
          viewers30: { $sum: { $cond: ["$hasViewed30", 1, 0] } },
        },
      },
    ])

    // USERS WHO PLACED ORDERS
    const buyersAgg = await Order.aggregate([
      {
        $match: {
          archived: { $ne: true },
          status: { $in: ["PAID", "DELIVERED"] },
        },
      },
      {
        $group: {
          _id: "$userId",
          firstOrderAt: { $min: "$createdAt" },
        },
      },
      {
        $group: {
          _id: null,
          buyers7: {
            $sum: {
              $cond: [{ $gte: ["$firstOrderAt", sevenDaysAgo] }, 1, 0],
            },
          },
          buyers30: {
            $sum: {
              $cond: [{ $gte: ["$firstOrderAt", thirtyDaysAgo] }, 1, 0],
            },
          },
        },
      },
    ])

    const viewers = viewersAgg[0] ?? {}
    const buyers = buyersAgg[0] ?? {}

    const viewers7 = viewers.viewers7 ?? 0
    const viewers30 = viewers.viewers30 ?? 0
    const buyers7 = buyers.buyers7 ?? 0
    const buyers30 = buyers.buyers30 ?? 0

    return {
      success: true,
      data: {
        last7Days: {
          viewers: viewers7,
          buyers: buyers7,
          conversionRate: viewers7
            ? Number(((buyers7 / viewers7) * 100).toFixed(2))
            : 0,
        },
        last30Days: {
          viewers: viewers30,
          buyers: buyers30,
          conversionRate: viewers30
            ? Number(((buyers30 / viewers30) * 100).toFixed(2))
            : 0,
        },
      },
    }
  } catch (error) {
    return handleError(error) as ErrorResponse
  }
}
export async function getCODDeliverySuccessRate(): Promise<
  ActionResponse<{
    last7Days: {
      totalCODOrders: number
      delivered: number
      failed: number
      successRate: number
    }
    last30Days: {
      totalCODOrders: number
      delivered: number
      failed: number
      successRate: number
    }
  }>
> {
  try {
    await connectDB()

    const now = new Date()
    const sevenDaysAgo = new Date(now)
    sevenDaysAgo.setDate(now.getDate() - 7)

    const thirtyDaysAgo = new Date(now)
    thirtyDaysAgo.setDate(now.getDate() - 30)

    const baseMatch = {
      "payment.method": "CASH_ON_DELIVERY",
      status: { $in: ["SHIPPED", "DELIVERED", "CANCELLED", "REFUNDED"] },
      archived: { $ne: true },
    }

    const agg = await Order.aggregate([
      {
        $facet: {
          last7Days: [
            { $match: { ...baseMatch, createdAt: { $gte: sevenDaysAgo } } },
            {
              $group: {
                _id: null,
                total: { $sum: 1 },
                delivered: {
                  $sum: { $cond: [{ $eq: ["$status", "DELIVERED"] }, 1, 0] },
                },
                failed: {
                  $sum: {
                    $cond: [
                      { $in: ["$status", ["CANCELLED", "REFUNDED"]] },
                      1,
                      0,
                    ],
                  },
                },
              },
            },
          ],
          last30Days: [
            { $match: { ...baseMatch, createdAt: { $gte: thirtyDaysAgo } } },
            {
              $group: {
                _id: null,
                total: { $sum: 1 },
                delivered: {
                  $sum: { $cond: [{ $eq: ["$status", "DELIVERED"] }, 1, 0] },
                },
                failed: {
                  $sum: {
                    $cond: [
                      { $in: ["$status", ["CANCELLED", "REFUNDED"]] },
                      1,
                      0,
                    ],
                  },
                },
              },
            },
          ],
        },
      },
    ])

    const d7 = agg[0].last7Days[0] ?? { total: 0, delivered: 0, failed: 0 }
    const d30 = agg[0].last30Days[0] ?? { total: 0, delivered: 0, failed: 0 }

    return {
      success: true,
      data: {
        last7Days: {
          totalCODOrders: d7.total,
          delivered: d7.delivered,
          failed: d7.failed,
          successRate: d7.total
            ? Number(((d7.delivered / d7.total) * 100).toFixed(2))
            : 0,
        },
        last30Days: {
          totalCODOrders: d30.total,
          delivered: d30.delivered,
          failed: d30.failed,
          successRate: d30.total
            ? Number(((d30.delivered / d30.total) * 100).toFixed(2))
            : 0,
        },
      },
    }
  } catch (error) {
    return handleError(error) as ErrorResponse
  }
}
export async function getTopSellingProducts(
  limit = 10,
  days = 30
): Promise<
  ActionResponse<
    Array<{
      productId: string
      name: string
      thumbnail: string | null;
      totalQuantitySold: number
      totalRevenue: number
      ordersCount: number
    }>
  >
> {
  try {
    await connectDB()

    const since = new Date()
    since.setDate(since.getDate() - days)

    const products = await Order.aggregate([
      {
        $match: {
          //status: "DELIVERED",
          archived: { $ne: true },
          createdAt: { $gte: since },
        },
      },
      { $unwind: "$items" },
      {
        $group: {
          _id: "$items.productId",
          name: { $first: "$items.name" },
          thumbnail: { $first: "$items.thumbnail" },
          totalQuantitySold: { $sum: "$items.quantity" },
          totalRevenue: { $sum: "$items.linePrice" },
          ordersCount: { $sum: 1 },
        },
      },
      { $sort: { totalRevenue: -1 } }, // 🔥 money-first
      { $limit: limit },
      {
        $project: {
          _id: 0,
          productId: { $toString: "$_id" },
          name: 1,
          thumbnail: 1,
          totalQuantitySold: 1,
          totalRevenue: { $round: ["$totalRevenue", 2] },
          ordersCount: 1,
        },
      },
    ])

    return {
      success: true,
      data: JSON.parse(JSON.stringify(products)),
    }
  } catch (error) {
    return handleError(error) as ErrorResponse
  }
}


export async function getUserGrowthLast30Days(): Promise<
  ActionResponse<{
    current: number
    previous: number
    percentageChange: number
    trend: "UP" | "DOWN" | "FLAT"
  }>
> {
  try {
    await connectDB()

    const now = new Date()

    const startCurrent = new Date()
    startCurrent.setDate(now.getDate() - 30)

    const startPrevious = new Date()
    startPrevious.setDate(now.getDate() - 60)

    // Current 30 days
    const current = await User.countDocuments({
      createdAt: { $gte: startCurrent },
    })

    // Previous 30 days
    const previous = await User.countDocuments({
      createdAt: {
        $gte: startPrevious,
        $lt: startCurrent,
      },
    })

    let percentageChange = 0

    if (previous === 0 && current > 0) {
      percentageChange = 100
    } else if (previous > 0) {
      percentageChange = ((current - previous) / previous) * 100
    }

    percentageChange = Math.round(percentageChange * 10) / 10 // 1 decimal

    const trend =
      percentageChange > 0
        ? "UP"
        : percentageChange < 0
        ? "DOWN"
        : "FLAT"

    return {
      success: true,
      data: {
        current,
        previous,
        percentageChange,
        trend,
      },
    }
  } catch (error) {
    return handleError(error) as ErrorResponse
  }
}



export async function refreshCityCODRisk(): Promise<ActionResponse> {
  try {
    await connectDB();

  const cities = await Order.aggregate([
    {
      $match: {
        paymentMethod: "COD",
        status: { $in: ["DELIVERED", "RETURNED"] },
      },
    },
    {
      $group: {
        _id: "$shippingAddress.city",
        totalOrders: { $sum: 1 },
        delivered: {
          $sum: {
            $cond: [{ $eq: ["$status", "DELIVERED"] }, 1, 0],
          },
        },
        returned: {
          $sum: {
            $cond: [{ $eq: ["$status", "RETURNED"] }, 1, 0],
          },
        },
      },
    },
  ]);

  for (const c of cities) {
    if (!c._id || c.totalOrders < 30) continue;

    const successRate = Math.round(
      (c.delivered / c.totalOrders) * 100
    );

    const isBlacklisted = successRate < 65;

    await CityRisk.findOneAndUpdate(
      { city: c._id },
      {
        city: c._id,
        codSuccessRate: successRate,
        totalOrders: c.totalOrders,
        returnedOrders: c.returned,
        isBlacklisted,
        reason: isBlacklisted
          ? "High COD return rate"
          : undefined,
      },
      { upsert: true }
    );
  }

  return { success: true };
  } catch (error) {
     return handleError(error) as ErrorResponse;
  }
}
