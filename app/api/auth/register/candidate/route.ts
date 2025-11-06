// // import { NextResponse } from 'next/server';
// // import bcrypt from 'bcryptjs';
// // import { connectToDatabase } from '@/utils/db';
// // import User from '@/models/User';
// // import { IRegisterCandidate } from '@/types/auth';

// // export async function POST(request: Request) {
// //   try {
// //     const body: IRegisterCandidate = await request.json();
// //     const {
// //       firstName,
// //       lastName,
// //       email,
// //       password,
// //       confirmPassword,
// //       agreeToTerms,
// //     } = body;

// //     // Validate inputs
// //     if (!firstName || !lastName || !email || !password || !confirmPassword) {
// //       return NextResponse.json(
// //         { error: 'All fields are required' },
// //         { status: 400 }
// //       );
// //     }

// //     if (password !== confirmPassword) {
// //       return NextResponse.json(
// //         { error: 'Passwords do not match' },
// //         { status: 400 }
// //       );
// //     }

// //     if (!agreeToTerms) {
// //       return NextResponse.json(
// //         { error: 'You must agree to the terms and conditions' },
// //         { status: 400 }
// //       );
// //     }

// //     // Password strength validation
// //     const passwordRegex =
// //       /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
// //     if (!passwordRegex.test(password)) {
// //       return NextResponse.json(
// //         {
// //           error:
// //             'Password must be at least 8 characters and include uppercase, lowercase, number, and special character',
// //         },
// //         { status: 400 }
// //       );
// //     }

// //     // Connect to database
// //     await connectToDatabase();

// //     // Check if user already exists
// //     const existingUser = await User.findOne({ email });
// //     if (existingUser) {
// //       return NextResponse.json(
// //         { error: 'Email is already registered' },
// //         { status: 409 }
// //       );
// //     }

// //     // Hash password
// //     const hashedPassword = await bcrypt.hash(password, 10);

// //     // Create new user with role explicitly set to 'candidate'
// //     const newUser = await User.create({
// //       firstName,
// //       lastName,
// //       email,
// //       password: hashedPassword,
// //       role: 'candidate', // Role is automatically set here
// //       isActive: true,
// //     });

// //     // Return success without sending the password
// //     return NextResponse.json(
// //       {
// //         message: 'Registration successful',
// //         user: {
// //           id: newUser._id,
// //           firstName: newUser.firstName,
// //           lastName: newUser.lastName,
// //           email: newUser.email,
// //           role: newUser.role,
// //         },
// //       },
// //       { status: 201 }
// //     );
// //   } catch (error) {
// //     console.error('Registration error:', error);
// //     return NextResponse.json(
// //       { error: 'Failed to register candidate' },
// //       { status: 500 }
// //     );
// //   }
// // }

// import { NextResponse } from 'next/server';
// import bcrypt from 'bcryptjs';
// import { connectToDatabase } from '@/utils/db';
// import User from '@/models/User';
// import { IRegisterCandidate } from '@/types/auth';
// import { sendCandidateRegistrationEmail } from '@/lib/mailer';

// export async function POST(request: Request) {
//   try {
//     const body: IRegisterCandidate = await request.json();
//     const {
//       firstName,
//       lastName,
//       email,
//       password,
//       confirmPassword,
//       agreeToTerms,
//     } = body;

//     // Validate inputs
//     if (!firstName || !lastName || !email || !password || !confirmPassword) {
//       return NextResponse.json(
//         { error: 'All fields are required' },
//         { status: 400 }
//       );
//     }

//     if (password !== confirmPassword) {
//       return NextResponse.json(
//         { error: 'Passwords do not match' },
//         { status: 400 }
//       );
//     }

//     if (!agreeToTerms) {
//       return NextResponse.json(
//         { error: 'You must agree to the terms and conditions' },
//         { status: 400 }
//       );
//     }

//     // Password strength validation
//     const passwordRegex =
//       /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
//     if (!passwordRegex.test(password)) {
//       return NextResponse.json(
//         {
//           error:
//             'Password must be at least 8 characters and include uppercase, lowercase, number, and special character',
//         },
//         { status: 400 }
//       );
//     }

//     // Connect to database
//     await connectToDatabase();

//     // Check if user already exists
//     const existingUser = await User.findOne({ email });
//     if (existingUser) {
//       return NextResponse.json(
//         { error: 'Email is already registered' },
//         { status: 409 }
//       );
//     }

//     // Hash password
//     const hashedPassword = await bcrypt.hash(password, 10);

//     // Create new user with role explicitly set to 'candidate'
//     const newUser = await User.create({
//       firstName,
//       lastName,
//       email,
//       password: hashedPassword,
//       role: 'candidate', // Role is automatically set here
//       isActive: true,
//     });

//     // Send confirmation email
//     try {
//       await sendCandidateRegistrationEmail(email, firstName);
//       console.log(`Registration confirmation email sent to ${email}`);
//     } catch (emailError) {
//       // Log the error but don't fail the registration
//       console.error(
//         'Error sending registration confirmation email:',
//         emailError
//       );
//     }

//     // Return success without sending the password
//     return NextResponse.json(
//       {
//         message: 'Registration successful! Check your email for confirmation.',
//         user: {
//           id: newUser._id,
//           firstName: newUser.firstName,
//           lastName: newUser.lastName,
//           email: newUser.email,
//           role: newUser.role,
//         },
//       },
//       { status: 201 }
//     );
//   } catch (error) {
//     console.error('Registration error:', error);
//     return NextResponse.json(
//       { error: 'Failed to register candidate' },
//       { status: 500 }
//     );
//   }
// }

// app/api/auth/register/candidate/route.ts
import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { connectToDatabase } from '@/utils/db';
import User from '@/models/User';
import { IRegisterCandidate } from '@/types/auth';
import { sendCandidateRegistrationEmail } from '@/lib/mailer';

export async function POST(request: Request) {
  try {
    const body: IRegisterCandidate = await request.json();
    const {
      firstName,
      lastName,
      email,
      password,
      confirmPassword,
      agreeToTerms,
    } = body;

    // Validate inputs
    if (!firstName || !lastName || !email || !password || !confirmPassword) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      );
    }

    if (password !== confirmPassword) {
      return NextResponse.json(
        { error: 'Passwords do not match' },
        { status: 400 }
      );
    }

    if (!agreeToTerms) {
      return NextResponse.json(
        { error: 'You must agree to the terms and conditions' },
        { status: 400 }
      );
    }

    // Password strength validation
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!passwordRegex.test(password)) {
      return NextResponse.json(
        {
          error:
            'Password must be at least 8 characters and include uppercase, lowercase, number, and special character',
        },
        { status: 400 }
      );
    }

    // Connect to database
    await connectToDatabase();

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { error: 'Email is already registered' },
        { status: 409 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user with role explicitly set to 'candidate'
    const newUser = await User.create({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      role: 'candidate', // Role is automatically set here
      isActive: true,
    });

    // Send confirmation email
    try {
      await sendCandidateRegistrationEmail(email, firstName);
      console.log(`Registration confirmation email sent to ${email}`);
    } catch (emailError) {
      // Log the error but don't fail the registration
      console.error(
        'Error sending registration confirmation email:',
        emailError
      );
    }

    // Return success with auth flag to trigger automatic login on client side
    return NextResponse.json(
      {
        message: 'Registration successful! Logging you in...',
        user: {
          id: newUser._id,
          firstName: newUser.firstName,
          lastName: newUser.lastName,
          email: newUser.email,
          role: newUser.role,
        },
        autoSignIn: true, // Flag to trigger auto sign-in on the client
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { error: 'Failed to register candidate' },
      { status: 500 }
    );
  }
}
