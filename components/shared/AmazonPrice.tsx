import React from "react";

interface PriceProps {
  price: number; // e.g., 26.99
  className?: string;
}

const AmazonPrice: React.FC<PriceProps> = ({ price, className = "" }) => {
  const [dollars, cents] = price.toFixed(2).split("."); // splits 26.99 → ["26", "99"]

  return (
    <span className={`inline-flex items-start font-bold text-gray-900 ${className}`}>
      <span className="text-sm mr-0.5 mt-1">$</span>
      <span className={`text-3xl ${className} font-bold`}>{dollars}</span>
      <span className="text-xs mt-1">{cents}</span>
    </span>
  );
};

export default AmazonPrice;
