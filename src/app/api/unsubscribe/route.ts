import { writeClient } from "@/sanity/lib/writeClient";
import { client } from "@/sanity/lib/client";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const encodedEmail = searchParams.get("email");
  const action = searchParams.get("action") || "unsubscribe"; // "unsubscribe" or "delete"

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

    if (action === "delete") {
      // Permanently delete the subscriber record (Right to be Forgotten)
      await writeClient.delete(subscriber._id);
      return NextResponse.redirect(new URL("/unsubscribe?deleted=true", request.url));
    } else {
      // Just deactivate the subscription
      await writeClient
        .patch(subscriber._id)
        .set({ active: false })
        .commit();
      
      // Pass encoded email so user can request deletion from the success page
      return NextResponse.redirect(
        new URL(`/unsubscribe?success=true&email=${encodedEmail}`, request.url)
      );
    }
  } catch (error) {
    console.error("Unsubscribe error:", error);
    return NextResponse.redirect(new URL("/unsubscribe?error=failed", request.url));
  }
}

