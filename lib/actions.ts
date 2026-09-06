"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath, unstable_noStore as noStore } from "next/cache";

export type OrderItemInput = {
  menuId: string;
  name: string;
  price: number;
  quantity: number;
  preparationTime: number;
};

// ---------- READ actions ----------

export async function getRestaurants() {
  return prisma.restaurant.findMany({ orderBy: { ratings: "desc" } });
}

export async function getRestaurantById(id: string) {
  return prisma.restaurant.findUnique({ where: { id } });
}

export async function getMenu(restaurantId?: string) {
  if (restaurantId) {
    const menus = await prisma.menu.findMany({
      where: { restaurantId },
      orderBy: { itemName: "asc" }
    });
    return menus.map(m => ({
      id: m.id,
      name: m.itemName,
      price: m.itemPrice,
      preparationTime: m.preparationTime,
      imageUrl: m.imageUrl,
    }));
  }
  return [];
}

export async function getStaff(restaurantId?: string) {
  const chefs = await prisma.chef.findMany({ where: restaurantId ? { restaurantId } : {}, orderBy: { name: "asc" } });
  const bartenders = await prisma.bartender.findMany({ where: restaurantId ? { restaurantId } : {}, orderBy: { name: "asc" } });
  
  return [
    ...chefs.map(c => ({ id: c.id, name: c.name, role: "chef" })),
    ...bartenders.map(b => ({ id: b.id, name: b.name, role: "bartender" }))
  ];
}

async function mapOrders(orders: any[]) {
  return orders.map(order => ({
    id: order.id,
    createdAt: order.createdAt,
    status: order.status,
    waitingTime: order.waitTime,
    note: order.note || null,
    restaurantId: order.restaurantId,
    assignedChef: order.chef?.name || null,
    assignedBartender: order.bartender?.name || null,
    complaint: order.review?.content || null,
    rating: order.review?.rating || null,
    isPaid: !!order.payment, tipAmount: order.payment?.tip || null,
    items: order.items.map((i: any) => ({
      menuId: i.menuItem.id,
      name: i.menuItem.itemName, itemType: i.menuItem.itemType,
      price: i.menuItem.itemPrice,
      quantity: i.quantity,
      preparationTime: i.menuItem.preparationTime,
      imageUrl: i.menuItem.imageUrl,
    }))
  }));
}

export async function getAllOrders(restaurantId?: string) {
  noStore();
  const orders = await prisma.order.findMany({
    where: restaurantId ? { restaurantId } : {},
    orderBy: { createdAt: "desc" },
    include: {
      chef: true,
      bartender: true,
      review: true,
      payment: true,
      items: { include: { menuItem: true } }
    }
  });
  return mapOrders(orders);
}

export async function getPendingOrders(restaurantId?: string) {
  noStore();
  const orders = await prisma.order.findMany({
    where: { status: "pending", ...(restaurantId ? { restaurantId } : {}) },
    orderBy: { createdAt: "asc" },
    include: {
      chef: true,
      bartender: true,
      review: true,
      payment: true,
      items: { include: { menuItem: true } }
    }
  });
  return mapOrders(orders);
}

export async function getCompletedOrders(restaurantId?: string) {
  noStore();
  const orders = await prisma.order.findMany({
    where: { status: "served", ...(restaurantId ? { restaurantId } : {}) },
    orderBy: { createdAt: "desc" },
    take: 20,
    include: {
      chef: true,
      bartender: true,
      review: true,
      payment: true,
      items: { include: { menuItem: true } }
    }
  });
  return mapOrders(orders);
}

export async function getOrder(orderId: string) {
  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: {
      chef: true,
      bartender: true,
      review: true,
      payment: true,
      items: { include: { menuItem: true } }
    }
  });
  if (!order) return null;
  const mapped = await mapOrders([order]);
  return mapped[0];
}

// ---------- WRITE actions ----------

export async function placeOrder(restaurantId: string, items: OrderItemInput[], note?: string) {
  if (!items || items.length === 0) {
    throw new Error("Cannot place an empty order.");
  }

  const waitingTime = Math.max(...items.map((i) => i.preparationTime));

  const order = await prisma.order.create({
    data: {
      waitTime: waitingTime,
      status: "pending",
      note: note || null,
      restaurantId: restaurantId,
      items: {
        create: items.map(i => ({
          quantity: i.quantity,
          menuItemId: i.menuId
        }))
      }
    },
    include: {
      chef: true,
      bartender: true,
      review: true,
      payment: true,
      items: { include: { menuItem: true } }
    }
  });

  revalidatePath("/", "layout");
  const mapped = await mapOrders([order]);
  return mapped[0];
}

export async function assignOrder(orderId: string, chefName: string, bartenderName: string) {
  let chefId = null;
  if (chefName) {
    const chef = await prisma.chef.findFirst({ where: { name: chefName } });
    if (chef) chefId = chef.id;
  }
  
  let bartenderId = null;
  if (bartenderName) {
    const bartender = await prisma.bartender.findFirst({ where: { name: bartenderName } });
    if (bartender) bartenderId = bartender.id;
  }

  const order = await prisma.order.update({
    where: { id: orderId },
    data: { chefId, bartenderId },
  });

  revalidatePath("/", "layout");
  return order;
}

export async function markOrderServed(orderId: string) {
  const order = await prisma.order.update({
    where: { id: orderId },
    data: { status: "served" },
  });
  revalidatePath("/", "layout");
  return order;
}

export async function submitComplaint(orderId: string, complaint: string, rating: number) {
  if (rating < 1 || rating > 5) throw new Error("Rating must be between 1 and 5.");
  const review = await prisma.review.upsert({
    where: { orderId: orderId },
    update: { content: complaint, rating: rating, dateSubmitted: new Date().toISOString() },
    create: { content: complaint, rating: rating, dateSubmitted: new Date().toISOString(), orderId: orderId }
  });
  revalidatePath("/", "layout");
  return review;
}

export async function processPayment(orderId: string) {
  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: { items: { include: { menuItem: true } } }
  });
  if (!order) return null;
  
  const total = order.items.reduce((sum, item) => sum + (item.menuItem.itemPrice * item.quantity), 0);

  const payment = await prisma.payment.upsert({
    where: { orderId: orderId },
    update: { amount: total, paymentMethod: "PRETEND", paymentTime: new Date().toISOString() },
    create: { amount: total, paymentMethod: "PRETEND", paymentTime: new Date().toISOString(), orderId: orderId }
  });

  revalidatePath("/", "layout");
  return payment;
}

export async function failOrder(orderId: string, reason: string) {
  const order = await prisma.order.update({
    where: { id: orderId },
    data: { status: "failed", failedReason: reason },
  });
  revalidatePath("/", "layout");
  return order;
}
