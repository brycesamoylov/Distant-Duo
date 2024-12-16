import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase-admin";
import { authOptions } from "@/lib/auth";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const { partnerEmail } = await req.json();

  // Don't allow linking to self
  if (session.user.email === partnerEmail) {
    return new NextResponse("Cannot link to yourself", { status: 400 });
  }

  try {
    const usersRef = adminDb.collection('users');
    
    // Find current user and partner
    const [currentUserDoc, partnerDoc] = await Promise.all([
      usersRef.where('email', '==', session.user.email).get(),
      usersRef.where('email', '==', partnerEmail).get()
    ]);

    if (currentUserDoc.empty || partnerDoc.empty) {
      return new NextResponse("User not found", { status: 404 });
    }

    const currentUser = currentUserDoc.docs[0];
    const partner = partnerDoc.docs[0];

    // Check if either user is already linked
    if (currentUser.data().partnerId || partner.data().partnerId) {
      return new NextResponse("One or both users are already linked to a partner", { status: 400 });
    }

    // Update both users with their partner's ID
    await Promise.all([
      usersRef.doc(currentUser.id).update({ partnerId: partner.id }),
      usersRef.doc(partner.id).update({ partnerId: currentUser.id })
    ]);

    return new NextResponse("Success", { status: 200 });
  } catch (error) {
    console.error('Error linking partner:', error);
    return new NextResponse("Error", { status: 500 });
  }
} 