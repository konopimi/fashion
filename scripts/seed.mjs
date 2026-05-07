// scripts/seed.js
// Run with: node scripts/seed.js
// Make sure your Next.js dev server is running (npm run dev) so the API is live.
import axios from "axios";

const BASE = "http://localhost:3000/api/CORE"; // adjust port if needed

const defaultProducts = [
  {
    handle: "sabina-dress",
    name: "Sabina Dress",
    src: "https://co.silviatcherassi.com/cdn/shop/files/91_SabinaDress_White__PRESPRING2026_FRONT.jpg?v=1771536063&width=1000",
    price: 2100000,
    variants: [],
    collectionId: null,
  },
  {
    handle: "rowan-dress",
    name: "Rowan Dress",
    src: "https://co.silviatcherassi.com/cdn/shop/files/89_RowanDress_White__PRESPRING2026_FRONT.jpg?v=1771535925&width=1000",
    price: 2100000,
    variants: [],
    collectionId: null,
  },
  {
    handle: "norma-dress",
    name: "Norma Dress",
    src: "https://co.silviatcherassi.com/cdn/shop/files/80___Norma_Dress___Vanilla___PRE_SPRING_2026_FRONT_4b5ba98e-1241-4ad1-a9e1-05181b9a069e.jpg?v=1757978129&width=1000",
    price: 2100000,
    variants: [],
    collectionId: null,
  },
  {
    handle: "naga-dress",
    name: "Naga Dress",
    src: "https://co.silviatcherassi.com/cdn/shop/files/55___Naga_Dress___Tangerine___PRE_SPRING_2026_FRONT.jpg?v=1757883456&width=1000",
    price: 2100000,
    variants: [],
    collectionId: null,
  },
  {
    handle: "asher-dress",
    name: "Asher Dress",
    src: null,
    price: 2100000,
    variants: [],
    collectionId: null,
  },
];

const defaultCollections = [
  {
    handle: "collection-1",
    name: "Collection 1",
    href: "/collections/collection-1",
    src: "https://co.silviatcherassi.com/cdn/shop/files/1402-3_1.jpg?v=1775769358&width=1500",
  },
  {
    handle: "collection-2",
    name: "Collection 2",
    href: "/collections/collection-2",
    src: "https://co.silviatcherassi.com/cdn/shop/files/2_f3b3831b-f41c-4f32-8a48-d5b3c045bac4.jpg?v=1775754993&width=1500",
  },
  {
    handle: "collection-3",
    name: "Collection 3",
    href: "/collections/collection-3",
    src: "https://co.silviatcherassi.com/cdn/shop/files/SPRING_2026_-_HERO_IMAGES_13_b2600db3-62f4-4632-b8e2-b433de7b77ee.jpg?v=1775489708&width=1500",
  },
  {
    handle: "collection-4",
    name: "Collection 4",
    href: "/collections/collection-4",
    src: "https://co.silviatcherassi.com/cdn/shop/files/SPRING_2026_-_HERO_IMAGES_19_e3e6e248-ee80-432f-a4be-114ceebf414b.jpg?v=1775489710&width=832",
  },
];

async function seed() {
  console.log("🌱 Seeding products...");
  for (const product of defaultProducts) {
    try {
      const { data } = await axios.post(`${BASE}/products`, product);
      console.log(
        `✅ Product created: ${product.name} (handle: ${product.handle})`,
      );
    } catch (err) {
      console.error(
        `❌ Failed to create ${product.name}:`,
        err.response?.data || err.message,
      );
    }
  }

  console.log("\n🌱 Seeding collections...");
  for (const collection of defaultCollections) {
    try {
      const { data } = await axios.post(`${BASE}/collections`, collection);
      console.log(
        `✅ Collection created: ${collection.name} (handle: ${collection.handle})`,
      );
    } catch (err) {
      console.error(
        `❌ Failed to create ${collection.name}:`,
        err.response?.data || err.message,
      );
    }
  }

  console.log("\n🎉 Seeding complete!");
}

seed().catch(console.error);
