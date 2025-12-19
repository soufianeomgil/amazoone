import { getDeletedProducts } from "@/actions/product.actions";
import TrashProductRow from "./_components/TrashProductRow";


export default async function AdminTrashPage() {
  const result = await getDeletedProducts();

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-2xl font-semibold">Trash</h1>

      <p className="text-sm text-gray-500">
        Deleted products are permanently removed after 30 days.
      </p>

      <div className="border rounded-md overflow-hidden">
        {result && result?.data?.products.length! === 0 ? (
          <div className="p-6 text-center text-gray-500">
            Trash is empty
          </div>
        ) : (
          result?.data?.products.map((product) => (
            <TrashProductRow product={product} />
          ))
        )}
      </div>
    </div>
  );
}
