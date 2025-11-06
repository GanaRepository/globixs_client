// // app/api/contact/route.ts
// import { NextRequest, NextResponse } from 'next/server';
// import { connectToDatabase } from '@/utils/db';
// import Contact from '@/models/Contact';

// export async function POST(req: NextRequest) {
//   try {
//     await connectToDatabase();

//     const formData = await req.formData();
//     const firstName = formData.get('firstName') as string | null;
//     const lastName = formData.get('lastName') as string | null;
//     const email = formData.get('email') as string | null;
//     const phone = formData.get('phone') as string | null;
//     const message = formData.get('message') as string | null;

//     // Validate required fields
//     if (!firstName || !lastName || !email || !phone || !message) {
//       return NextResponse.json(
//         { success: false, message: 'All required fields must be filled.' },
//         { status: 400 }
//       );
//     }

//     // Create contact entry
//     const contact = await Contact.create({
//       firstName,
//       lastName,
//       email,
//       phone,
//       message,
//     });

//     return NextResponse.json({
//       success: true,
//       message: 'Your message has been sent successfully.',
//       contact,
//     });
//   } catch (error) {
//     console.error('Error in contact form submission:', error);
//     return NextResponse.json(
//       {
//         success: false,
//         message: 'Failed to send message. Please try again.',
//         error: error instanceof Error ? error.message : 'Unknown error',
//       },
//       { status: 500 }
//     );
//   }
// }

// app/api/contact/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/utils/db';
import Contact from '@/models/Contact';
import { sendContactFormConfirmationEmail } from '@/lib/mailer'; // Import from correct path

export async function POST(req: NextRequest) {
  try {
    await connectToDatabase();

    const formData = await req.formData();
    const firstName = formData.get('firstName') as string | null;
    const lastName = formData.get('lastName') as string | null;
    const email = formData.get('email') as string | null;
    const phone = formData.get('phone') as string | null;
    const message = formData.get('message') as string | null;

    // Validate required fields
    if (!firstName || !lastName || !email || !phone || !message) {
      return NextResponse.json(
        { success: false, message: 'All required fields must be filled.' },
        { status: 400 }
      );
    }

    // Create contact entry
    const contact = await Contact.create({
      firstName,
      lastName,
      email,
      phone,
      message,
    });

    // Send confirmation email to the user
    try {
      await sendContactFormConfirmationEmail(email, firstName);
      console.log('Contact form confirmation email sent successfully');
    } catch (emailError) {
      // Log the error but don't fail the request
      console.error('Error sending contact form email:', emailError);
    }

    return NextResponse.json({
      success: true,
      message: 'Your message has been sent successfully.',
      contact,
    });
  } catch (error) {
    console.error('Error in contact form submission:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to send message. Please try again.',
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
