import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const restaurantsData = [
  { 
    name: "Burger Lounge", location: "Maryland", contactNumber: "08111111111", ratings: 4.8, 
    imageUrl: "https://images.unsplash.com/photo-1550547660-d9450f859349?w=500&q=80",
    menu: [
      { name: "Classic Cheeseburger", price: 4500, type: "Food", img: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500&q=80" },
      { name: "Double Smash Burger", price: 6500, type: "Food", img: "https://images.unsplash.com/photo-1594212202659-33dddb0cdcc8?w=500&q=80" },
      { name: "Crispy Fries", price: 2000, type: "Food", img: "https://images.unsplash.com/photo-1576107232684-1279f390859f?w=500&q=80" },
      { name: "Vanilla Milkshake", price: 3000, type: "Drink", img: "https://images.unsplash.com/photo-1572490122747-3968b75bb8ef?w=500&q=80" },
      { name: "Craft Cola", price: 1500, type: "Drink", img: "https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=500&q=80" }
    ]
  },
  { 
    name: "Sushi Station", location: "Ikoyi", contactNumber: "08122222222", ratings: 4.9, 
    imageUrl: "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=500&q=80",
    menu: [
      { name: "Spicy Tuna Roll", price: 8000, type: "Food", img: "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=500&q=80" },
      { name: "Salmon Sashimi", price: 9500, type: "Food", img: "https://images.unsplash.com/photo-1583623025817-d180a2221d0a?w=500&q=80" },
      { name: "Miso Soup", price: 3000, type: "Food", img: "https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?w=500&q=80" },
      { name: "Green Tea", price: 1500, type: "Drink", img: "https://images.unsplash.com/photo-1627435601369-0e1d0339d1b0?w=500&q=80" },
      { name: "Sake", price: 5000, type: "Drink", img: "https://images.unsplash.com/photo-1563227812-0ea4c22e6cc8?w=500&q=80" }
    ]
  },
  { 
    name: "Pasta Place", location: "V.I", contactNumber: "08133333333", ratings: 4.5, 
    imageUrl: "https://images.unsplash.com/photo-1473093295043-cdd812d0e601?w=500&q=80",
    menu: [
      { name: "Spaghetti Carbonara", price: 6000, type: "Food", img: "https://images.unsplash.com/photo-1612874742237-6526221588e3?w=500&q=80" },
      { name: "Fettuccine Alfredo", price: 6500, type: "Food", img: "https://images.unsplash.com/photo-1645112411341-6c4fd023714a?w=500&q=80" },
      { name: "Garlic Bread", price: 2500, type: "Food", img: "https://images.unsplash.com/photo-1573140247632-f8fd74997d5c?w=500&q=80" },
      { name: "Red Wine Glass", price: 4000, type: "Drink", img: "https://images.unsplash.com/photo-1506377247377-2a5b3b417ebb?w=500&q=80" },
      { name: "Lemonade", price: 2000, type: "Drink", img: "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=500&q=80" }
    ]
  },
  { 
    name: "Vegan Life", location: "Lekki", contactNumber: "08055555555", ratings: 4.9, 
    imageUrl: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=500&q=80",
    menu: [
      { name: "Avocado Toast", price: 4000, type: "Food", img: "https://images.unsplash.com/photo-1541519227354-08fa5d50c44d?w=500&q=80" },
      { name: "Quinoa Salad", price: 4500, type: "Food", img: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=500&q=80" },
      { name: "Vegan Buddha Bowl", price: 5500, type: "Food", img: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500&q=80" },
      { name: "Green Detox Smoothie", price: 3500, type: "Drink", img: "https://images.unsplash.com/photo-1610970881699-44a5a8183011?w=500&q=80" },
      { name: "Kombucha", price: 2500, type: "Drink", img: "https://images.unsplash.com/photo-1589178726521-995f560d2bc4?w=500&q=80" }
    ]
  },
  { 
    name: "Ocean Basket", location: "Victoria Island", contactNumber: "08022222222", ratings: 4.6, 
    imageUrl: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=500&q=80",
    menu: [
      { name: "Grilled Lobster", price: 15000, type: "Food", img: "https://images.unsplash.com/photo-1559742811-822873691df8?w=500&q=80" },
      { name: "Fried Calamari", price: 6000, type: "Food", img: "https://images.unsplash.com/photo-1599487405270-b271d4c3ea4e?w=500&q=80" },
      { name: "Spicy Shrimp Skewers", price: 7500, type: "Food", img: "https://images.unsplash.com/photo-1559717865-a99cac1a95d8?w=500&q=80" },
      { name: "Mojito", price: 4500, type: "Drink", img: "https://images.unsplash.com/photo-1551538827-9c037cb4f32a?w=500&q=80" },
      { name: "Iced Tea", price: 2000, type: "Drink", img: "https://images.unsplash.com/photo-1499638673689-79a0b5115d87?w=500&q=80" }
    ]
  },
  { 
    name: "Suya Spot", location: "Ikoyi", contactNumber: "08077777777", ratings: 4.7, 
    imageUrl: "https://images.unsplash.com/photo-1529193591184-b1d58069ecdd?w=500&q=80",
    menu: [
      { name: "Beef Suya", price: 2500, type: "Food", img: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=500&q=80" },
      { name: "Chicken Suya", price: 3000, type: "Food", img: "https://images.unsplash.com/photo-1598514982205-f36b96d1e8d4?w=500&q=80" },
      { name: "Roasted Plantain (Boli)", price: 1500, type: "Food", img: "https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?w=500&q=80" },
      { name: "Chilled Beer", price: 2000, type: "Drink", img: "https://images.unsplash.com/photo-1575037614876-c385cb805aef?w=500&q=80" },
      { name: "Zobo Drink", price: 1000, type: "Drink", img: "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=500&q=80" }
    ]
  },
  { 
    name: "GB-Chow Flagship", location: "Lagos, Nigeria", contactNumber: "08012345678", ratings: 4.8, 
    imageUrl: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=500&q=80",
    menu: [
      { name: "Jollof Rice & Chicken", price: 3500, type: "Food", img: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500&q=80" },
      { name: "Fried Rice & Beef", price: 3500, type: "Food", img: "https://images.unsplash.com/photo-1512058564366-18510be2db19?w=500&q=80" },
      { name: "Pounded Yam & Egusi", price: 4000, type: "Food", img: "https://images.unsplash.com/photo-1567306301408-9b74779a11af?w=500&q=80" },
      { name: "Chapman", price: 2000, type: "Drink", img: "https://images.unsplash.com/photo-1536935338788-846bb9981813?w=500&q=80" },
      { name: "Fresh Pineapple Juice", price: 1500, type: "Drink", img: "https://images.unsplash.com/photo-1622597467836-f38b4c95d908?w=500&q=80" }
    ]
  },
  { 
    name: "Spice Route", location: "Abuja", contactNumber: "08011111111", ratings: 4.5, 
    imageUrl: "https://images.unsplash.com/photo-1552566626-52f8b828add9?w=500&q=80",
    menu: [
      { name: "Chicken Tikka Masala", price: 5500, type: "Food", img: "https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=500&q=80" },
      { name: "Garlic Naan", price: 1500, type: "Food", img: "https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?w=500&q=80" },
      { name: "Lamb Curry", price: 6000, type: "Food", img: "https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=500&q=80" },
      { name: "Mango Lassi", price: 2500, type: "Drink", img: "https://images.unsplash.com/photo-1544148103-0773bf10d330?w=500&q=80" },
      { name: "Masala Chai", price: 1500, type: "Drink", img: "https://images.unsplash.com/photo-1576092762791-dd9e2220afa1?w=500&q=80" }
    ]
  },
  { 
    name: "Buka Hub", location: "Yaba", contactNumber: "08066666666", ratings: 4.3, 
    imageUrl: "https://images.unsplash.com/photo-1544148103-0773bf10d330?w=500&q=80",
    menu: [
      { name: "Amala & Ewedu", price: 2500, type: "Food", img: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=500&q=80" },
      { name: "Ofada Rice", price: 3000, type: "Food", img: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500&q=80" },
      { name: "Moi Moi", price: 1000, type: "Food", img: "https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?w=500&q=80" },
      { name: "Palm Wine", price: 1500, type: "Drink", img: "https://images.unsplash.com/photo-1575037614876-c385cb805aef?w=500&q=80" }
    ]
  },
  { 
    name: "Golden Grill", location: "Gbagada", contactNumber: "08099999999", ratings: 4.6, 
    imageUrl: "https://images.unsplash.com/photo-1525648199074-cee30ba79a4a?w=500&q=80",
    menu: [
      { name: "Grilled Chicken Quarter", price: 3500, type: "Food", img: "https://images.unsplash.com/photo-1598514982205-f36b96d1e8d4?w=500&q=80" },
      { name: "BBQ Ribs", price: 8000, type: "Food", img: "https://images.unsplash.com/photo-1544025162-811114215570?w=500&q=80" },
      { name: "Coleslaw", price: 1500, type: "Food", img: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=500&q=80" },
      { name: "Fountain Soda", price: 1000, type: "Drink", img: "https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=500&q=80" }
    ]
  }
];

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
    const data = restaurantsData[i];
    const restaurant = await prisma.restaurant.create({
      data: {
        name: data.name,
        location: data.location,
        contactNumber: data.contactNumber,
        ratings: data.ratings,
        imageUrl: data.imageUrl
      }
    });

    await prisma.chef.create({ data: { name: `Chef ${i}A`, qualifications: "Expert", restaurantId: restaurant.id } });
    await prisma.bartender.create({ data: { name: `Bartender ${i}B`, restaurantId: restaurant.id } });
    await prisma.waiter.create({ data: { name: `Waiter ${i}C`, restaurantId: restaurant.id } });

    const menuItems = data.menu.map(m => ({
      itemName: m.name,
      itemPrice: m.price,
      portionSize: "Standard",
      itemType: m.type,
      preparationTime: 5 + Math.floor(Math.random() * 20),
      imageUrl: m.img,
      restaurantId: restaurant.id
    }));

    await prisma.menu.createMany({ data: menuItems });
  }

  console.log("Seed data inserted for all Restaurants with tailored distinct menus!");
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
