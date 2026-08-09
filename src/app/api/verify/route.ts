import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const code = String(body?.code || "").trim().toUpperCase();

    if (!code) {
      return NextResponse.json({ error: "Code is required", valid: false }, { status: 400 });
    }

    const codeData = await prisma.verificationCode.findUnique({
      where: { code },
      include: { product: { select: { name: true } } },
    });

    if (!codeData) {
      return NextResponse.json({ error: "Invalid product code", valid: false }, { status: 404 });
    }

    if (
      codeData.status === "Expired" ||
      codeData.validationCount >= codeData.maxValidations
    ) {
      return NextResponse.json({
        valid: false,
        reason: "expired",
        product_name: codeData.product?.name || null,
        customer_name: codeData.customerName,
      });
    }

    const newValidationCount = codeData.validationCount + 1;
    const newStatus =
      newValidationCount >= codeData.maxValidations ? "Expired" : "Active";

    await prisma.verificationCode.update({
      where: { code },
      data: {
        validationCount: newValidationCount,
        status: newStatus,
      },
    });

    return NextResponse.json({
      valid: true,
      product_name: codeData.product?.name || "Unknown Product",
      customer_name: codeData.customerName || "Unknown Customer",
      validation_count: newValidationCount,
      max_validations: codeData.maxValidations,
      status: newStatus,
    });
  } catch (error) {
    console.error("Verify error:", error);
    return NextResponse.json({ error: "Validation failed", valid: false }, { status: 500 });
  }
}
