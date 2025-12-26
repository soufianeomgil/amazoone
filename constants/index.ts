import { KpiData, Order, ProductData, SaleData } from "@/types/actionTypes";
import { BadgeDollarSign, BadgeInfo, Heart, MapPin, ShoppingCart, UserRound } from "lucide-react";
import { ROUTES } from "./routes";

export const ProfileItems = [
  {
     name: "mon compte",
     icon: UserRound,
     pathname:"/profile"
  },
  {
     name: "mes commandes",
     icon: ShoppingCart,
     pathname: ROUTES.myorders
  },   {
     name: "ma list d'envie",
     icon: Heart,
     pathname: ROUTES.mywishlist
  },  {
     name: "Carnet d'addresses",
     icon: MapPin,
     pathname: ROUTES.addresses
  }, 
   {
     name: "Information du compte",
     icon: BadgeInfo,
     pathname: "/customer/account/edit"
  }, 
  {
     name: "mes Coupons",
     icon: BadgeDollarSign,
     pathname:  "/"
 },
 
 //  {
 //     name: "LogOut",
 //     icon: LogOut,
 //     pathname: ""
 //  },
  
  
]

export const brands = [
    "Nike",
    "Adidas",
    "Samsung",
    "Apple",
    "Xiaomi",
    "Bella Maison",
    "New Balance",
    "Essence",
    "Huawei",
    "La Roche Posay",
    "Oppo",
    "Puma",
    "Tommy Hilfiger",
    "Under Armour",
    "Infinix",
    "The North Face",
    "Asics",
    "Celio",
    "Honor",
    "Revox",
    "Ray-Ban",
    "Daniel Wellington",
    "Denwa",
    "L'Oréal Paris",
    "MSI",
    "Dyson",
    "Herbal Essence",
    "Maybelline",
    "Bosch",
    "Nivea",
    "Taurus",
    "Moulinex",
    "Garnier",
    "Neutrogena",
    "Philips",
    "Tissot",
    "Uriage",
    "Eastpak",
    "Mievic",
    "Nintendo",
    "Razer",
    "Casio",
    "Krohler",
    "Lamacom",
    "Chi",
    "Lattafa",
    "Head & Shoulders",
    "Nuxe",
    "Dans Ma Maison",
    "Catrice",
    "Acure",
    "Skala",
    "CeraVe",
    "Topface",
    "Mellerware",
    "Tefal",
    "Kenwood",
    "Bys",
    "Heinrich's",
    "Epson",
    "Oraimo",
    "Canon",
    "ITEL",
    "Golden Rose",
    "Logitech",
    "Sony",
    "TCL",
    "Baseus",
    "Lenovo",
    "The Purest Solution",
    "Sol de Janeiro",
    "Bourjois"
];
export const footerCategories = [
    "Téléphone & objets connectés",
    "Tv, Son, Photo",
    "Informatique & Gaming",
    "Electroménager",
    "Maison - Cuisine - Déco",
    "Beauté - Santé",
    "Vêtements - Chaussures - Bijoux - Accessoires",
    "Bébé & Jouets",
    "Sport",
    "Auto Moto",
    "Brico - Jardin - Animalerie",
    "Librairie",
    "Epicerie fine"
];



export const MOCK_SALES: SaleData[] = [
  { date: '2023-10-01', revenue: 4500, orders: 120 },
  { date: '2023-10-02', revenue: 5200, orders: 135 },
  { date: '2023-10-03', revenue: 4800, orders: 128 },
  { date: '2023-10-04', revenue: 6100, orders: 155 },
  { date: '2023-10-05', revenue: 5900, orders: 142 },
  { date: '2023-10-06', revenue: 7200, orders: 180 },
  { date: '2023-10-07', revenue: 6800, orders: 172 },
];

export const MOCK_CATEGORIES: ProductData[] = [
  { category: 'Electronics', value: 35 },
  { category: 'Fashion', value: 25 },
  { category: 'Home', value: 20 },
  { category: 'Beauty', value: 15 },
  { category: 'Toys', value: 5 },
];

export const MOCK_ORDERS: Order[] = [
  { id: '#AMZ-8891', customer: 'John Doe', product: 'Wireless Headphones', amount: 129.99, status: 'Delivered', date: 'Oct 07, 2023' },
  { id: '#AMZ-8892', customer: 'Sarah Smith', product: 'Yoga Mat', amount: 24.50, status: 'Shipped', date: 'Oct 07, 2023' },
  { id: '#AMZ-8893', customer: 'Michael Ross', product: 'Smart Watch', amount: 199.00, status: 'Pending', date: 'Oct 06, 2023' },
  { id: '#AMZ-8894', customer: 'Emma Wilson', product: 'Coffee Maker', amount: 89.99, status: 'Delivered', date: 'Oct 05, 2023' },
  { id: '#AMZ-8895', customer: 'David Brown', product: 'Bluetooth Speaker', amount: 45.00, status: 'Cancelled', date: 'Oct 05, 2023' },
];

export const KPI_STATS: KpiData[] = [
  { label: 'Total Revenue', value: '$128,430', change: '+12.5%', isPositive: true, icon: '💰' },
  { label: 'Total Orders', value: '1,240', change: '+5.2%', isPositive: true, icon: '📦' },
  { label: 'Avg Order Value', value: '$103.57', change: '-1.4%', isPositive: false, icon: '📊' },
  { label: 'Conversion Rate', value: '3.42%', change: '+0.8%', isPositive: true, icon: '📈' },
];