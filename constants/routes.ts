import { BadgeCheck, BookOpenText, ThumbsUp, Truck } from "lucide-react"

export const ROUTES = {
    admin: {
        products:  "/admin/products-list",
        createProduct:  "/admin/products-list/create-product",
        users:  "/admin/users-list",
        analytics:  '/admin/analytics',
        marketing:  "/admin/marketing",
        orders:  "/admin/orders-list",
        orderDetails: (orderId:string)=> `/admin/orders-list/details/${orderId}` ,
        dashboard: "/admin/dashboard",
    },
    myorders: "/account/order-history",
    mywishlist: "/account/wishlist",
    myBrowsingHistory: "/browsing-history",
    editAddress: (id:string) => `/account/addresses/edit/${id}`,
    profile: (id:string) => `/profile/${id}`,
    addAddress: "/account/addresses/add",
    addresses: "/account/addresses"
       
    
}
export const features = [
    {
        icon: ThumbsUp,
        title: "Satisfait ou remboursé",
        show: true
    },
    {
        icon: BookOpenText,
        title: "Offre nationale et internationale",
        show: true
    },
    {
        icon: Truck,
        title: "Livraison partout au Maroc",
        show: true
    },
    {
        icon: BadgeCheck,
        title: "Produits 100% authentiques",
        show: false
    },
   
]