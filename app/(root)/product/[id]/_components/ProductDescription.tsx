import ParseHtml from "@/components/editor/ParseHtml";
import ProductDescriptionClient from "./ProductDescriptionClient";


const ProductDescription = async ({
  description,
}: {
  description: string;
}) => {
  return (
    <ProductDescriptionClient>
      <ParseHtml data={description} />
    </ProductDescriptionClient>
  );
};

export default ProductDescription;
