import { NextResponse } from "next/server";
import { getOrderById, validateUpdateInput, updateOrder,type UpdateOrderInput, deleteOrder} from "@/lib/orders";
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const order = getOrderById(id);

  if (!order) {
    return NextResponse.json(
      { error: "Order not found" },
      { status: 404 }
    );
  }

  return NextResponse.json(order, { status: 200 });
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const existingOrder = getOrderById(id);

  if (!existingOrder) {
    return NextResponse.json(
      { error: "Order not found" },
      { status: 404 }
    );
  }

  let body: unknown;

  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      { error: "Invalid JSON request body" },
      { status: 400 }
    );
  }

  let input: UpdateOrderInput;

  try {
    input = validateUpdateInput(body);
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Invalid update data",
      },
      { status: 400 }
    );
  }

  try {
    const updatedOrder = updateOrder(id, input);

    if (!updatedOrder) {
      return NextResponse.json(
        { error: "Order not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(updatedOrder, { status: 200 });
  } catch (error) {
    console.error("Failed to update order:", error);

    return NextResponse.json(
      { error: "Unable to update order" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const deleted = deleteOrder(id);

  if (!deleted) {
    return NextResponse.json(
      { error: "Order not found" },
      { status: 404 }
    );
  }

  return new Response(null, { status: 204 });
}