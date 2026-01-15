import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import qs from 'query-string'
import { IProduct } from "@/models/product.model"
import { subDays } from "date-fns"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
export const getTrustLabel = (weeklySales: number) => {
  if (weeklySales >= 1000) return "1k+ bought this week"
  if (weeklySales >= 500) return "500+ bought this week"
  if (weeklySales >= 100) return "100+ bought this week"
  return null
}
 enum OrderStatus {
  PENDING = "PENDING",
  PAID = "PAID",
  PROCESSING = "PROCESSING",
  SHIPPED = "SHIPPED",
  DELIVERED = "DELIVERED",
  CANCELLED = "CANCELLED",
  REFUNDED = "REFUNDED",
}
export function calculateDiscount(
  original: number,
  current: number
): number {
  if (original <= 0 || current >= original) return 0
  return Math.floor(((original - current) / original) * 100)
}

export const formatPrice = (price: number) => {
  return new Intl.NumberFormat("en-US", {
      style: 'currency',
      currency: 'USD',
  }).format(price);
}
export function formatDate(dateInput: Date | string): string {
  const date = new Date(dateInput);
  
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-based
  const year = date.getFullYear();

  return `${day}-${month}-${year}`;
}
export function formatFullDateTime(date: Date): string {
  const pad = (n: number) => n.toString().padStart(2, '0');

  const day = pad(date.getDate());
  const month = pad(date.getMonth() + 1); // Months are zero-indexed
  const year = date.getFullYear();

  const hours = pad(date.getHours());
  const minutes = pad(date.getMinutes());
  const seconds = pad(date.getSeconds());

  return `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;
}
interface URlQueryParams {
  params: string;
  key: string;
  value: string | null;
}
export const formUrlQuery = ({params, key, value}:URlQueryParams)=> {
      const currentUrl = qs.parse(params)
      currentUrl[key] = value;
      return qs.stringifyUrl({
        url: window.location.pathname,
        query: currentUrl
      }, {
        skipNull: true
      })
  }

  interface RemoveURlQueryParams {
    params: string;
    keysToRemove: string[];
   
 }
  export const removeKeysFromQuery = ({params, keysToRemove}:RemoveURlQueryParams)=> {
    const currentUrl = qs.parse(params)
    keysToRemove.forEach((key)=> {
       delete currentUrl[key]
    })
    return qs.stringifyUrl({
      url: window.location.pathname,
      query: currentUrl
    }, {
      skipNull: true
    })
}



type TimelineItem = {
  key: string;
  label: string;
  time?: string;
  active: boolean;
  color?: string;
};

export const formatDateTimeline = (date?: Date | string | null) => {
  if (!date) return "";
  return new Date(date).toLocaleString("fr-FR", {
    weekday: "long",
    day: "2-digit",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

export const buildOrderTimeline = (order: any): TimelineItem[] => {
  const current = order.status;

  const isActive = (status: OrderStatus[]) =>
    status.includes(current);

  return [
    {
      key: "pending",
      label: "En attente de confirmation",
      time: order.createdAt ? formatDate(order.createdAt) : "",
      active: isActive([
        OrderStatus.PENDING,
        OrderStatus.PAID,
        OrderStatus.PROCESSING,
        OrderStatus.SHIPPED,
        OrderStatus.DELIVERED,
      ]),
      color: "#00BFA6",
    },
    {
      key: "confirmed",
      label: "Confirmée",
      time: order.isPaid ? formatDate(order.payment?.paidAt as Date) : "",
      active: isActive([
        OrderStatus.PAID,
        OrderStatus.PROCESSING,
        OrderStatus.SHIPPED,
        OrderStatus.DELIVERED,
      ]),
      color: "#00BFA6",
    },
    {
      key: "preparing",
      label: "En préparation",
      active: isActive([
        OrderStatus.PROCESSING,
        OrderStatus.SHIPPED,
        OrderStatus.DELIVERED,
      ]),
    },
    {
      key: "shipping",
      label: "En cours de livraison",
      time: order.shippedAt ?  formatDate(order.shippedAt) : "",
      active: isActive([
        OrderStatus.SHIPPED,
        OrderStatus.DELIVERED,
      ]),
    },
    {
      key: "delivered",
      label: "Livrée",
      time: order.deliveredAt ? formatDate(order.deliveredAt) : "",
      active: current === OrderStatus.DELIVERED,
    },
    {
      key: "cancelled",
      label: "Annulée",
      time: order.cancelledAt ?  formatDate(order.cancelledAt) : "",
      active: current === OrderStatus.CANCELLED,
      color: "#EF4444",
    },
  ];
};

export type ConversionBadge =
  | { type: "FAST_SELLING"; label: string }
  | { type: "SOCIAL_PROOF"; label: string }
  | { type: "LOWEST_PRICE"; label: string };

export function getConversionBadge(
  product: IProduct
): ConversionBadge | null {
  // 1️⃣ Fast selling
  if (product.stock >= 5 ) {
    return {
      type: "FAST_SELLING",
      label: "Selling out fast",
    };
  }

  // 2️⃣ Social proof
  // >=
  if (product.weeklySales < 50) {
    return {
      type: "SOCIAL_PROOF",
      label: `+${product.weeklySales} sold recently`,
    };
  }

  // 3️⃣ Lowest price in 7 days
  if (product.priceHistory?.length) {
    const sevenDaysAgo = subDays(new Date(), 7);

    const last7Days = product.priceHistory.filter(
      p => p.date >= sevenDaysAgo
    );

    if (last7Days.length) {
      const lowest = Math.min(...last7Days.map(p => p.price));

      if (product.basePrice <= lowest) {
        return {
          type: "LOWEST_PRICE",
          label: "Lowest price in 7 days",
        };
      }
    }
  }

  return null;
}