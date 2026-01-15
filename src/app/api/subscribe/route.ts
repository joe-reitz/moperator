import { writeClient } from "@/sanity/lib/writeClient";
import { client } from "@/sanity/lib/client";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    if (!email || typeof email !== "string") {
      return NextResponse.json(
        { error: "Email is required" },
        { status: 400 }
      );
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Invalid email format" },
        { status: 400 }
      );
    }

    // Check if already subscribed
    const existing = await client.fetch(
      `*[_type == "subscriber" && email == $email][0]`,
      { email: email.toLowerCase() }
    );

    if (existing) {
      if (existing.active) {
        return NextResponse.json(
          { message: "You're already subscribed!" },
          { status: 200 }
        );
      } else {
        // Reactivate subscription
        await writeClient
          .patch(existing._id)
          .set({ active: true })
          .commit();
        return NextResponse.json(
          { message: "Welcome back! Your subscription has been reactivated." },
          { status: 200 }
        );
      }
    }

    // Create new subscriber
    await writeClient.create({
      _type: "subscriber",
      email: email.toLowerCase(),
      subscribedAt: new Date().toISOString(),
      active: true,
    });

    return NextResponse.json(
      { message: "Thanks for subscribing! You'll hear from us soon." },
      { status: 201 }
    );
  } catch (error) {
    console.error("Subscription error:", error);
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}


