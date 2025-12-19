
import React from "react";

interface Spec {
  name: string;
  value: string;
}

interface Props {
  title: string;
  specs: Spec[];
}

const ProductSpecs = ({ name }: {name:string}) => {
 const specs = [
  { name: "Brand", value: "Nike" },
  { name: "Material", value: "Leather" },
  { name: "Color", value: "Black" },
  { name: "Weight", value: "1.2 kg" },
  { name: "Dimensions", value: "30 x 20 x 10 cm" },
];

  return (
    <section className="mt-8 w-full">
      {/* <h2 className="mb-3 hidden text-lg font-semibold text-gray-900 dark:text-gray-100">
        {name}
      </h2> */}

      <div className="border-t border-b border-gray-200 dark:border-gray-700">
        {specs.map((spec, idx) => (
          <div
            key={idx}
            className="grid grid-cols-[140px_1fr] gap-4 py-3 text-sm
                       border-t first:border-t-0 border-gray-200 dark:border-gray-700"
          >
            <span className="text-gray-600 dark:text-gray-400 font-medium">
              {spec.name}
            </span>

            <span className="text-gray-900 dark:text-gray-100 wrap-break-word">
              {spec.value}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
};

export default ProductSpecs;
