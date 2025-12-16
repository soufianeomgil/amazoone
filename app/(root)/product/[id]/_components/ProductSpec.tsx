import React from "react";

const specs = [
  { name: "Brand", value: "Nike" },
  { name: "Material", value: "Leather" },
  { name: "Color", value: "Black" },
  { name: "Weight", value: "1.2 kg" },
  { name: "Dimensions", value: "30 x 20 x 10 cm" },
];

const ProductSpecs = ({name}:{name:string}) => {
  return (
    <section className="mt-8">
      <h2 className="text-2xl font-semibold mb-4">
         {name}
      </h2>

      <div className="w-full border-t border-b border-gray-200 divide-y divide-gray-200">
        {specs.map((spec, idx) => (
          <div
            key={idx}
            className="flex justify-between py-3 px-4 text-sm sm:text-base"
          >
            <span className="text-gray-600 font-medium">{spec.name}</span>
            <span className="text-gray-900">{spec.value}</span>
          </div>
        ))}
      </div>
    </section>
  );
};

export default ProductSpecs;
