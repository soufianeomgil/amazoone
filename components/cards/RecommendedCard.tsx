import React from 'react';


import { IProduct } from '@/models/product.model';
import ProductItem from './ProductItem';

interface RecommendationSectionProps {
  title:string;
  products: IProduct[]
}

const RecommendationCard: React.FC<RecommendationSectionProps> = ({title,products }) => {
  return (
    <section className="mb-8 bg-white py-2.5 px-2">
      <h2 className="text-xl font-bold text-gray-900 mb-4 px-1">
        {title}
      </h2>
      <div className="flex flex-col">
        {products.map((product,index) => (
          <ProductItem key={index} product={product} />
        ))}
      </div>
    </section>
  );
};

export default RecommendationCard;