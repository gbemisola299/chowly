import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const restaurantsData = [
  { name: "GB-Chow Flagship", location: "Lagos, Nigeria", contactNumber: "08012345678", ratings: 4.8, imageUrl: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=500&q=80" },
  { name: "Spice Route", location: "Abuja", contactNumber: "08011111111", ratings: 4.5, imageUrl: "https://images.unsplash.com/photo-1552566626-52f8b828add9?w=500&q=80" },
  { name: "Ocean Basket", location: "Victoria Island", contactNumber: "08022222222", ratings: 4.6, imageUrl: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=500&q=80" },
  { name: "Mega Bites", location: "Ikeja", contactNumber: "08033333333", ratings: 4.2, imageUrl: "https://images.unsplash.com/photo-1498654896293-37aacf113fd9?w=500&q=80" },
  { name: "Tasties", location: "Surulere", contactNumber: "08044444444", ratings: 4.4, imageUrl: "https://images.unsplash.com/photo-1559339352-11d035aa65de?w=500&q=80" },
  { name: "Vegan Life", location: "Lekki", contactNumber: "08055555555", ratings: 4.9, imageUrl: "https://images.unsplash.com/photo-1490818387583-1b5ba41f9801?w=500&q=80" },
  { name: "Buka Hub", location: "Yaba", contactNumber: "08066666666", ratings: 4.3, imageUrl: "https://images.unsplash.com/photo-1544148103-0773bf10d330?w=500&q=80" },
  { name: "Suya Spot", location: "Ikoyi", contactNumber: "08077777777", ratings: 4.7, imageUrl: "https://images.unsplash.com/photo-1529193591184-b1d58069ecdd?w=500&q=80" },
  { name: "Mama Put", location: "Festac", contactNumber: "08088888888", ratings: 4.1, imageUrl: "https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?w=500&q=80" },
  { name: "Golden Grill", location: "Gbagada", contactNumber: "08099999999", ratings: 4.6, imageUrl: "https://images.unsplash.com/photo-1525648199074-cee30ba79a4a?w=500&q=80" }
];

const foodImages = [
  "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500&q=80",
  "https://images.unsplash.com/photo-1567306301408-9b74779a11af?w=500&q=80",
  "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=500&q=80",
  "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=500&q=80",
  "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=500&q=80"
];

const menuNames = ["Jollof Rice & Chicken", "Suya Platter", "Pounded Yam & Egusi Soup", "Grilled Fish", "Chapman", "Zobo Drink", "Chilled Beer", "Fresh Orange Juice", "Plantain & Beans", "Moi Moi", "Beef Stew"];

async function main() {
  await prisma.orderItem.deleteMany({});
  await prisma.review.deleteMany({});
  await prisma.payment.deleteMany({});
  await prisma.order.deleteMany({});
  await prisma.menu.deleteMany({});
  await prisma.chef.deleteMany({});
  await prisma.bartender.deleteMany({});
  await prisma.waiter.deleteMany({});
  await prisma.restaurant.deleteMany({});

  for (let i = 0; i < restaurantsData.length; i++) {
    const restaurant = await prisma.restaurant.create({
      data: restaurantsData[i]
    });

    await prisma.chef.create({ data: { name: `Chef ${i}A`, qualifications: "Expert", restaurantId: restaurant.id } });
    await prisma.bartender.create({ data: { name: `Bartender ${i}B`, restaurantId: restaurant.id } });
    await prisma.waiter.create({ data: { name: `Waiter ${i}C`, restaurantId: restaurant.id } });

    const menuItems = [];
    for (let j = 0; j < 6; j++) {
      const nameIndex = (i * 2 + j) % menuNames.length;
      const imgIndex = (i + j) % foodImages.length;
      menuItems.push({
        itemName: menuNames[nameIndex],
        itemPrice: 1500 + Math.floor(Math.random() * 3000),
        portionSize: "Standard",
        itemType: j < 4 ? "Food" : "Drink",
        preparationTime: 5 + Math.floor(Math.random() * 20),
        imageUrl: foodImages[imgIndex],
        restaurantId: restaurant.id
      });
    }

    await prisma.menu.createMany({ data: menuItems });
  }

  console.log("Seed data inserted for 10 Restaurants with distinct menus.");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
