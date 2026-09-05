import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // First, create a restaurant
  const restaurant = await prisma.restaurant.create({
    data: {
      name: "Chowly Flagship",
      location: "Lagos, Nigeria",
      contactNumber: "08012345678",
      ratings: 4.8,
    }
  });

  // Create Staff
  await prisma.chef.createMany({
    data: [
      { name: "Ada Okafor", qualifications: "Expert", restaurantId: restaurant.id },
      { name: "Femi Adeyemi", qualifications: "Senior", restaurantId: restaurant.id },
      { name: "Chidi Umeh", qualifications: "Junior", restaurantId: restaurant.id },
    ],
  });

  await prisma.bartender.createMany({
    data: [
      { name: "Bola Johnson", restaurantId: restaurant.id },
      { name: "Ngozi Eze", restaurantId: restaurant.id },
      { name: "Tunde Bakare", restaurantId: restaurant.id },
    ],
  });

  await prisma.waiter.createMany({
    data: [
      { name: "Kemi Balogun", restaurantId: restaurant.id },
    ]
  });

  // Create Menu Items
  await prisma.menu.createMany({
    data: [
      { itemName: "Jollof Rice & Chicken", itemPrice: 3500, portionSize: "Large", itemType: "Food", preparationTime: 20, restaurantId: restaurant.id },
      { itemName: "Suya Platter", itemPrice: 4000, portionSize: "Medium", itemType: "Food", preparationTime: 15, restaurantId: restaurant.id },
      { itemName: "Pounded Yam & Egusi Soup", itemPrice: 3800, portionSize: "Large", itemType: "Food", preparationTime: 25, restaurantId: restaurant.id },
      { itemName: "Grilled Fish", itemPrice: 5000, portionSize: "Large", itemType: "Food", preparationTime: 30, restaurantId: restaurant.id },
      { itemName: "Chapman", itemPrice: 1500, portionSize: "Standard", itemType: "Drink", preparationTime: 5, restaurantId: restaurant.id },
      { itemName: "Zobo Drink", itemPrice: 1000, portionSize: "Standard", itemType: "Drink", preparationTime: 3, restaurantId: restaurant.id },
      { itemName: "Chilled Beer", itemPrice: 1200, portionSize: "Standard", itemType: "Drink", preparationTime: 2, restaurantId: restaurant.id },
      { itemName: "Fresh Orange Juice", itemPrice: 1300, portionSize: "Standard", itemType: "Drink", preparationTime: 5, restaurantId: restaurant.id },
    ],
  });

  console.log("Seed data inserted for Restaurant, Staff, and Menu.");
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
