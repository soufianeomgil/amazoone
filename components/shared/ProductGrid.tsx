// import { IProduct } from '@/models/product.model';
// import MainCard from '../cards/MainCard';
// import { auth } from '@/auth';

// const ProductGrid = async({ products, title }: { products: (IProduct)[], title:string }) => {
//   const session = await auth()

   
//     return (
//         <>
//             <main className="max-w-[1500px] mx-auto    relative z-10">
//                 {/* <div className="bg-white p-4 rounded-t-lg shadow-md">
//                     <h2 className="text-2xl font-bold text-gray-800">Today's Deals</h2>
//                 </div> */}
//                  <div className="mt-6 bg-white px-4">
//                     <h2 className="text-xl font-bold mb-4">
//                        {title}
//                     </h2>
//                     <main className="sm:container mx-auto  sm:px-4 py-8">
//         <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-2 sm:gap-6">
          
//           {products.map((product,index) => (
//             <MainCard userId={session?.user.id as string}  key={index}   product={product} />
//           ))}
//         </div>
//       </main>
//                 </div>
//             </main>
           
//         </>
//     );
// };
// // cart slide sidebar // twick product card a bit / fix that add to cart shit / order fns
// export default ProductGrid;
import { IProduct } from '@/models/product.model';
import MainCard from '../cards/MainCard';
import { auth } from '@/auth';

const ProductGrid = async ({ products, title }: { products: (IProduct)[], title: string }) => {
  const session = await auth();

  return (
    <section className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex items-center justify-between mb-8 border-b border-gray-100 pb-4">
        <h2 className="text-2xl md:text-3xl font-extrabold text-gray-900 tracking-tight">
          {title}
        </h2>
        <span className="text-sm font-medium text-[hsl(178,100%,34%)] cursor-pointer hover:underline">
          View All Products
        </span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-x-4 gap-y-8 md:gap-x-6 md:gap-y-12">
        {products.map((product, index) => (
          <MainCard 
            userId={session?.user.id as string} 
            key={product._id?.toString() || index} 
            product={product} 
          />
        ))}
      </div>
    </section>
  );
};

export default ProductGrid;