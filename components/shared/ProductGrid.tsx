
// export default ProductGrid;
import { IProduct } from '@/models/product.model';
import MainCard from '../cards/MainCard';
import { auth } from '@/auth';

const ProductGrid = async ({ products, title }: { products: (IProduct)[], title: string }) => {
  const session = await auth();

  return (
    <section className="max-w-[1600px] mx-auto px-2 sm:px-6 lg:px-8 py-3">
      
        <h2 className="text-2xl md:text-3xl mb-6 font-extrabold text-gray-900 tracking-tight">
          {title}
        </h2>
       
     
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-x-2.5 gap-y-8 md:gap-x-6 md:gap-y-12">
        {products.map((product, index) => (
          <MainCard 
            userId={session?.user.id as string} 
            key={product._id?.toString() || index} 
            priority={index < 4}
            product={product} 
          />
        ))}
      </div>
    </section>
  );
};

export default ProductGrid;