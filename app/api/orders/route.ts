import { NextResponse } from "next/server";
import {
  ordersStore,
  validateOrderInput,
  createOrder,
} from "@/lib/orders";

export async function GET() {
  return NextResponse.json(ordersStore);
}

export async function POST(req: Request) {
  let body: unknown;

  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      { error: "Invalid JSON request body" },
      { status: 400 }
    );
  }

  let input;

  try {
    input = validateOrderInput(body);
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Invalid order data",
      },
      { status: 400 }
    );
  }

  try {
    const newOrder = createOrder(input);

    return NextResponse.json(newOrder, { status: 201 });
  } catch (error) {
    console.error("Failed to create order:", error);

    return NextResponse.json(
      { error: "Unable to create order" },
      { status: 500 }
    );
  }
}