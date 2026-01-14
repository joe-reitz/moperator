import { writeClient } from "@/sanity/lib/writeClient";
import { client } from "@/sanity/lib/client";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const encodedEmail = searchParams.get("email");

  if (!encodedEmail) {
    return NextResponse.redirect(new URL("/unsubscribe?error=missing", request.url));
  }

  try {
    // Decode the email from base64
    const email = Buffer.from(encodedEmail, "base64").toString("utf-8");

    // Find the subscriber
    const subscriber = await client.fetch(
      `*[_type == "subscriber" && email == $email][0]`,
      { email: email.toLowerCase() }
    );

    if (!subscriber) {
      return NextResponse.redirect(new URL("/unsubscribe?error=notfound", request.url));
    }

    // Deactivate the subscription
    await writeClient
      .patch(subscriber._id)
      .set({ active: false })
      .commit();

    return NextResponse.redirect(new URL("/unsubscribe?success=true", request.url));
  } catch (error) {
    console.error("Unsubscribe error:", error);
    return NextResponse.redirect(new URL("/unsubscribe?error=failed", request.url));
  }
}

