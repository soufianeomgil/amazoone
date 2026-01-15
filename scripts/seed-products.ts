
import { faker } from "@faker-js/faker";
import mongoose from "mongoose"

import { Product } from "@/models/product.model";


await mongoose.connect("mongodb+srv://soufianeowner_db_user:ZT9RdG1zl8Gzk6qT@cluster0.ico3a53.mongodb.net/?appName=Cluster0")

const COLORS = ["Black", "Brown", "Beige", "White", "Camel"];
const SIZES = ["S", "M", "L"];

function randomImage(id: string) {
  return {
    url: `https://picsum.photos/seed/${id}/600/600`,
    preview: `https://picsum.photos/seed/${id}/80/80`,
    public_id: id,
  };
}

const products = [];

for (let i = 0; i < 100; i++) {
  const basePrice = faker.number.int({ min: 199, max: 699 });
  const listPrice = basePrice + faker.number.int({ min: 30, max: 120 });

  const variants = COLORS.flatMap((color) =>
    SIZES.map((size) => ({
      sku: faker.string.alphanumeric(10).toUpperCase(),
      priceModifier: size === "L" ? 40 : size === "M" ? 20 : 0,
      stock: faker.number.int({ min: 5, max: 40 }),
      attributes: [
        { name: "Color", value: color },
        { name: "Size", value: size },
      ],
      images: [randomImage(`variant-${i}-${color}-${size}`)],
    }))
  );

  const createdAt = faker.date.past({ years: 1 });

  products.push({
    name: `${faker.commerce.productAdjective()} ${faker.commerce.productMaterial()} Bag`,
    description: faker.commerce.productDescription(),
    brand: faker.company.name(),
    category: "Women > Bags",
    status: "ACTIVE",

    basePrice,
    listPrice,

    weeklySales: faker.number.int({ min: 0, max: 120 }),
    dailySales: faker.number.int({ min: 0, max: 30 }),

    priceHistory: [
      {
        price: listPrice,
        date: faker.date.recent({ days: 180 }),
      },
      {
        price: basePrice,
        date: faker.date.recent({ days: 30 }),
      },
    ],

    thumbnail: randomImage(`thumb-${i}`),
    images: [
      randomImage(`img-${i}-1`),
      randomImage(`img-${i}-2`),
      randomImage(`img-${i}-3`),
    ],

    rating: faker.number.float({ min: 3.5, max: 5, fractionDigits: 1 }),
    reviewCount: faker.number.int({ min: 0, max: 500 }),

    variants,

    attributes: [
      { name: "Material", value: faker.helpers.arrayElement(["PU Leather", "Genuine Leather", "Canvas"]) },
      { name: "Closure", value: faker.helpers.arrayElement(["Zipper", "Magnetic", "Button"]) },
    ],

    tags: faker.helpers.uniqueArray(
      () => faker.commerce.productAdjective().toLowerCase(),
      4
    ),

    isFeatured: faker.datatype.boolean({ probability: 0.15 }),
    isBestSeller: faker.datatype.boolean({ probability: 0.2 }),
    isTrendy: faker.datatype.boolean({ probability: 0.25 }),

    stock: 0, // unused because variants exist
    isDeleted: false,
    deletedAt: null,

    createdAt,
    updatedAt: faker.date.between({ from: createdAt, to: new Date() }),
  });
}

await Product.insertMany(products);
console.log("✅ Faker: 100 realistic products inserted");

process.exit();
