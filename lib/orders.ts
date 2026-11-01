export interface Order {
  id: string;
  customerName: string;
  phone: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  total: number;
  status: OrderStatus;
}

export type OrderStatus = "Pending" | "Preparing" | "Delivered";

const seedOrders: Order[] = [
    {
  "id": "1", //server-generated-id
  "customerName": "Dima",
  "phone": "01101010",
  "productName": "Vanilla Candle",
  "quantity": 3,
  "unitPrice": 8.00,
  "total": 24,
  "status": "Pending"
},
{
  "id": "2", //server-generated-id
  "customerName": "Khaled",
  "phone": "01200220",
  "productName": "Cedar Candle",
  "quantity": 3,
  "unitPrice": 10.00,
  "total": 30,
  "status": "Pending"
},
{
  "id": "3", //server-generated-id
  "customerName": "Mira",
  "phone": "01300330",
  "productName": "Mini Gift Candle",
  "quantity": 3,
  "unitPrice": 6.00,
  "total": 18,
  "status": "Pending"
}
];
declare global {
  var ordersStore: Order[] | undefined;
}
export const ordersStore = globalThis.ordersStore ??= [...seedOrders];
export function getOrderById(id: string): Order | undefined {
  return ordersStore.find((order) => order.id === id);
}

export type CreateOrderInput = Pick<
  Order,
  "customerName" | "phone" | "productName" | "quantity" | "unitPrice"
>;

export function validateOrderInput(
  data: unknown
): CreateOrderInput {
  if (typeof data !== "object" || data === null || Array.isArray(data)) {
    throw new Error("Invalid order data");
  }

  const body = data as Record<string, unknown>;

  if (
    typeof body.customerName !== "string" ||
    body.customerName.trim() === ""
  ) {
    throw new Error("Customer name is required");
  }

  if (
    typeof body.phone !== "string" ||
    body.phone.trim() === ""
  ) {
    throw new Error("Phone is required");
  }

  if (
    typeof body.productName !== "string" ||
    body.productName.trim() === ""
  ) {
    throw new Error("Product name is required");
  }

  if (
    typeof body.quantity !== "number" ||
    !Number.isInteger(body.quantity) ||
    body.quantity < 1
  ) {
    throw new Error("Quantity must be a positive integer");
  }

  if (
    typeof body.unitPrice !== "number" ||
    !Number.isFinite(body.unitPrice) ||
    body.unitPrice < 0 ||
    !Number.isSafeInteger(Math.round(body.unitPrice * 100)) ||
    Math.abs(body.unitPrice * 100 - Math.round(body.unitPrice * 100)) > 1e-8
  ) {
    throw new Error(
      "Unit price must be a non-negative number with at most two decimal places"
    );
  }

  return {
    customerName: body.customerName.trim(),
    phone: body.phone.trim(),
    productName: body.productName.trim(),
    quantity: body.quantity,
    unitPrice: body.unitPrice,
  };
}

export function createOrder(input: CreateOrderInput): Order {
  const priceInCents = Math.round(input.unitPrice * 100);

  const totalInCents = priceInCents * input.quantity;

  if (!Number.isSafeInteger(totalInCents)) {
    throw new Error("Order total is too large");
  }

  const newOrder: Order = {
    id: crypto.randomUUID(),
    customerName: input.customerName,
    phone: input.phone,
    productName: input.productName,
    quantity: input.quantity,
    unitPrice: input.unitPrice,
    total: totalInCents / 100,
    status: "Pending",
  };

  ordersStore.push(newOrder);

  return newOrder;
}
export type UpdateOrderInput = Partial<
  Pick<
    Order,
    | "customerName"
    | "phone"
    | "productName"
    | "quantity"
    | "unitPrice"
    | "status"
  >
>;
export function validateUpdateInput(data: unknown): UpdateOrderInput {
  if (
    typeof data !== "object" ||
    data === null ||
    Array.isArray(data)
  ) {
    throw new Error("Invalid update data");
  }

  const body = data as Record<string, unknown>;

  const allowedFields = [
    "customerName",
    "phone",
    "productName",
    "quantity",
    "unitPrice",
    "status",
  ];

  const keys = Object.keys(body);

  if (keys.length === 0) {
    throw new Error("Update cannot be empty");
  }

  if (keys.some((key) => !allowedFields.includes(key))) {
    throw new Error("Update contains fields that cannot be edited");
  }

 const update: UpdateOrderInput = {};

  for (const field of ["customerName", "phone", "productName"] as const) {
    if (field in body) {
      const value = body[field];

      if (typeof value !== "string" || value.trim() === "") {
        throw new Error(`${field} must be a non-empty string`);
      }

      update[field] = value.trim();
    }
  }

  if ("quantity" in body) {
    if (
      typeof body.quantity !== "number" ||
      !Number.isInteger(body.quantity) ||
      body.quantity < 1
    ) {
      throw new Error("Quantity must be a positive integer");
    }

    update.quantity = body.quantity;
  }

  if ("unitPrice" in body) {
    const price = body.unitPrice;

    if (
      typeof price !== "number" ||
      !Number.isFinite(price) ||
      price < 0 ||
      !Number.isSafeInteger(Math.round(price * 100)) ||
      Math.abs(price * 100 - Math.round(price * 100)) > 1e-8
    ) {
      throw new Error(
        "Unit price must be a non-negative number with at most two decimal places"
      );
    }

    update.unitPrice = price;
  }

  if ("status" in body) {
    if (
      body.status !== "Pending" &&
      body.status !== "Preparing" &&
      body.status !== "Delivered"
    ) {
      throw new Error("Invalid order status");
    }

    update.status = body.status;
  }

  return update;
}
export function updateOrder(
  id: string,
  input: UpdateOrderInput
): Order | undefined {
  const order = ordersStore.find((order) => order.id === id);

  if (!order) {
    return undefined;
  }

  const quantity = input.quantity ?? order.quantity;
  const unitPrice = input.unitPrice ?? order.unitPrice;

  const priceInCents = Math.round(unitPrice * 100);
  const totalInCents = priceInCents * quantity;

  if (!Number.isSafeInteger(totalInCents)) {
    throw new Error("Order total is too large");
  }

  const updatedOrder: Order = {
    ...order,
    ...input,
    total: totalInCents / 100,
  };

  const index = ordersStore.findIndex((order) => order.id === id);

  ordersStore[index] = updatedOrder;

  return updatedOrder;
}

export function deleteOrder(id: string): boolean {
  const index = ordersStore.findIndex((order) => order.id === id);

  if (index === -1) {
    return false;
  }

  ordersStore.splice(index, 1);

  return true;
}