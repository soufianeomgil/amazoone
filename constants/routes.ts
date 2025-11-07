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
    myorders: "/account/order-history"
       
    
}