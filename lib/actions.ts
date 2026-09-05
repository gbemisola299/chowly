"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export type OrderItemInput = {
  menuId: string;
  name: string;
  price: number;
  quantity: number;
  preparationTime: number;
};

// ---------- READ actions ----------

export async function getMenu() {
  const menus = await prisma.menu.findMany({ orderBy: { itemName: "asc" } });
  return menus.map(m => ({
    id: m.id,
    name: m.itemName,
    price: m.itemPrice,
    preparationTime: m.preparationTime,
  }));
}

export async function getStaff() {
  const chefs = await prisma.chef.findMany({ orderBy: { name: "asc" } });
  const bartenders = await prisma.bartender.findMany({ orderBy: { name: "asc" } });
  
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
    assignedChef: order.chef?.name || null,
    assignedBartender: order.bartender?.name || null,
    complaint: order.review?.content || null,
    rating: order.review?.rating || null,
    isPaid: !!order.payment,
    items: order.items.map((i: any) => ({
      menuId: i.menuItem.id,
      name: i.menuItem.itemName,
      price: i.menuItem.itemPrice,
      quantity: i.quantity,
      preparationTime: i.menuItem.preparationTime,
    }))
  }));
}

export async function getAllOrders() {
  const orders = await prisma.order.findMany({
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

export async function getPendingOrders() {
  const orders = await prisma.order.findMany({
    where: { status: "pending" },
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

export async function placeOrder(items: OrderItemInput[]) {
  if (!items || items.length === 0) {
    throw new Error("Cannot place an empty order.");
  }

  // Waiting time = the longest single item prep time
  const waitingTime = Math.max(...items.map((i) => i.preparationTime));
  
  const restaurant = await prisma.restaurant.findFirst();
  if (!restaurant) throw new Error("No restaurant found");

  const order = await prisma.order.create({
    data: {
      waitTime: waitingTime,
      status: "pending",
      restaurantId: restaurant.id,
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

  revalidatePath("/");
  const mapped = await mapOrders([order]);
  return mapped[0];
}

export async function assignOrder(orderId: string, chefName: string, bartenderName: string) {
  // Find staff IDs by name since UI sends names
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
    data: {
      chefId: chefId,
      bartenderId: bartenderId,
    },
  });

  revalidatePath("/");
  return order;
}

export async function markOrderServed(orderId: string) {
  const order = await prisma.order.update({
    where: { id: orderId },
    data: { status: "served" },
  });
  revalidatePath("/");
  return order;
}

export async function submitComplaint(orderId: string, complaint: string, rating: number) {
  if (rating < 1 || rating > 5) {
    throw new Error("Rating must be between 1 and 5.");
  }

  const review = await prisma.review.upsert({
    where: { orderId: orderId },
    update: {
      content: complaint,
      rating: rating,
      dateSubmitted: new Date().toISOString()
    },
    create: {
      content: complaint,
      rating: rating,
      dateSubmitted: new Date().toISOString(),
      orderId: orderId
    }
  });

  revalidatePath("/");
  return review;
}

export async function processPayment(orderId: string) {
  // calculate total
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

  await prisma.order.update({
    where: { id: orderId },
    data: { status: "paid" }
  });

  revalidatePath("/");
  return payment;
}
