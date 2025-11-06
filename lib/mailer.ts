// mailer.ts - COMPLETE FILE WITH ALL ADMIN NOTIFICATIONS
import nodemailer from 'nodemailer';
import { UserRole } from '@/types/auth';

/**
 * Send password reset email to user AND notify admin
 * @param email User's email address
 * @param resetUrl Password reset URL with token
 * @param role User role (optional) for customized email content
 */
export const sendPasswordResetEmail = async (
  email: string,
  resetUrl: string,
  role?: UserRole
): Promise<nodemailer.SentMessageInfo> => {
  // Only send emails for candidate and business roles
  if (role !== 'candidate' && role !== 'business') {
    console.log(
      'Password reset email not sent: role is not candidate or business'
    );
    return {} as nodemailer.SentMessageInfo; // Return empty object as SentMessageInfo
  }

  // Configure email transporter
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.EMAIL_PORT || '587'),
    secure: process.env.EMAIL_SECURE === 'true',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  // Customize salutation based on user role
  let salutation = 'Dear user';
  let roleSpecificText = '';

  if (role === 'candidate') {
    salutation = 'Dear candidate';
    roleSpecificText =
      'You can reset your password to regain access to your candidate profile and continue with your job applications.';
  } else if (role === 'business') {
    salutation = 'Dear business partner';
    roleSpecificText =
      'You can reset your password to regain access to your business portal and continue with your recruitment services.';
  }

  // USER EMAIL - Password reset for user
  const userMailOptions = {
    from: `"Globixs Technology Solutions Support" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: 'Password Reset Request - Globixs Technology Solutions',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; border: 1px solid #ddd; padding: 20px; border-radius: 10px;">
        <div style="text-align: center; padding: 20px 0;">
          <div style="background: linear-gradient(to right, #7e22ce, #14b8a6); color: white; padding: 15px; border-radius: 10px; font-size: 22px; font-weight: bold;">
            Globixs Technology Solutions
          </div>
        </div>
        <h2 style="color: #7e22ce; text-align: center; font-family: 'Arial', sans-serif;">
          Password Reset Request
        </h2>
        <p style="font-size: 16px; color: #333;">
          ${salutation},
        </p>
        <p style="font-size: 16px; color: #333;">
          We received a request to reset your password for your Globixs Technology Solutions account. If you didn't make this request, you can safely ignore this email.
        </p>
        <p style="font-size: 16px; color: #333;">
          ${roleSpecificText}
        </p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${resetUrl}" style="background: linear-gradient(to right, #7e22ce, #14b8a6); color: white; padding: 12px 25px; text-decoration: none; font-size: 16px; border-radius: 5px; display: inline-block;">Reset Password</a>
        </div>
        <p style="font-size: 16px; color: #333;">
          This link will expire in 15 minutes for security reasons. If you need a new reset link, please visit the forgot password page again.
        </p>
        <p style="font-size: 14px; color: #777; word-wrap: break-word;">
          If you're having trouble with the button, copy and paste this link into your browser:
          <br />
          <a href="${resetUrl}" style="color: #7e22ce;">${resetUrl}</a>
        </p>
        <p style="font-size: 16px; color: #333;">
          Thanks,
          <br />
          Globixs Technology Solutions Support Team
        </p>
        <hr style="border: 1px solid #ddd; margin: 30px 0;" />
        <p style="font-size: 12px; color: #777; text-align: center;">
          This email was sent by Globixs Technology Solutions. If you did not request a password reset, please ignore this message.
          <br>
          © ${new Date().getFullYear()} Globixs Technology Solutions. All rights reserved.
        </p>
      </div>
    `,
  };

  // ADMIN EMAIL - Password reset notification
  const adminMailOptions = {
    from: `"Globixs Technology Solutions System" <${process.env.EMAIL_USER}>`,
    to: process.env.EMAIL_USER, // Goes to Connect@Globixs.com
    subject: 'Password Reset Request - Globixs Technology Solutions',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; border: 1px solid #ddd; padding: 20px; border-radius: 10px;">
        <h2 style="color: #7e22ce;">🔐 Password Reset Request</h2>
        <div style="background: #f8f9fa; padding: 15px; border-radius: 5px; margin: 20px 0;">
          <p style="margin: 5px 0;"><strong>👤 User:</strong> ${email}</p>
          <p style="margin: 5px 0;"><strong>🎭 Role:</strong> ${role || 'Unknown'}</p>
          <p style="margin: 5px 0;"><strong>🕐 Time:</strong> ${new Date().toLocaleString()}</p>
          <p style="margin: 5px 0;"><strong>🔗 Action:</strong> Password reset requested</p>
        </div>
  <p style="font-size: 14px; color: #777;">This is an automated notification from the Globixs Technology Solutions system.</p>
      </div>
    `,
  };

  // Send both emails simultaneously
  try {
    const [userInfo, adminInfo] = await Promise.all([
      transporter.sendMail(userMailOptions),
      transporter.sendMail(adminMailOptions),
    ]);

    console.log('Password reset emails sent successfully:', {
      userMessageId: userInfo.messageId,
      adminMessageId: adminInfo.messageId,
    });

    return userInfo;
  } catch (error) {
    console.error('Error sending password reset emails:', error);
    throw error;
  }
};

/**
 * Send registration confirmation email to candidate AND notify admin
 * @param email User's email address
 * @param firstName User's first name
 */
export const sendCandidateRegistrationEmail = async (
  email: string,
  firstName: string
): Promise<nodemailer.SentMessageInfo> => {
  // Configure email transporter
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.EMAIL_PORT || '587'),
    secure: process.env.EMAIL_SECURE === 'true',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  // Enable debugging
  transporter.on('error', (error) => {
    console.error('SMTP Error:', error);
  });

  // USER EMAIL - Confirmation to candidate
  const userMailOptions = {
    from: `"Globixs Technology Solutions Careers" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: 'Welcome to Globixs Technology Solutions Talent Network',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; border: 1px solid #ddd; padding: 20px; border-radius: 10px;">
        <div style="text-align: center; padding: 20px 0;">
          <div style="background: linear-gradient(to right, #7e22ce, #14b8a6); color: white; padding: 15px; border-radius: 10px; font-size: 22px; font-weight: bold;">
            Globixs Technology Solutions
          </div>
        </div>
        <h2 style="color: #7e22ce; text-align: center; font-family: 'Arial', sans-serif;">
          Welcome to Our Talent Network!
        </h2>
        <p style="font-size: 16px; color: #333;">
          Dear ${firstName},
        </p>
        <p style="font-size: 16px; color: #333;">
          Thank you for registering with Globixs Technology Solutions Talent Network. Your candidate account has been successfully created.
        </p>
        <p style="font-size: 16px; color: #333;">
          You can now:
        </p>
        <ul style="font-size: 16px; color: #333;">
          <li>Browse and apply for job opportunities</li>
          <li>Track your applications</li>
          <li>Update your profile and resume</li>
          <li>Receive personalized job recommendations</li>
        </ul>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${process.env.NEXT_PUBLIC_BASE_URL}/login/candidate" style="background: linear-gradient(to right, #7e22ce, #14b8a6); color: white; padding: 12px 25px; text-decoration: none; font-size: 16px; border-radius: 5px; display: inline-block;">Login to Your Account</a>
        </div>
        <p style="font-size: 16px; color: #333;">
          We're excited to help you find the perfect opportunity that matches your skills and career goals.
        </p>
        <p style="font-size: 16px; color: #333;">
          Thanks,
          <br />
          Globixs Technology Solutions Talent Acquisition Team
        </p>
        <hr style="border: 1px solid #ddd; margin: 30px 0;" />
        <p style="font-size: 12px; color: #777; text-align: center;">
          © ${new Date().getFullYear()} Globixs Technology Solutions. All rights reserved.
        </p>
      </div>
    `,
  };

  // ADMIN EMAIL - Notification to admin
  const adminMailOptions = {
    from: `"Globixs Technology Solutions System" <${process.env.EMAIL_USER}>`,
    to: process.env.EMAIL_USER, // Goes to Connect@Globixs.com
    subject: 'New Candidate Registration - Globixs Technology Solutions',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; border: 1px solid #ddd; padding: 20px; border-radius: 10px;">
        <h2 style="color: #7e22ce;">🎯 New Candidate Registration</h2>
        <div style="background: #f8f9fa; padding: 15px; border-radius: 5px; margin: 20px 0;">
          <p style="margin: 5px 0;"><strong>👤 Name:</strong> ${firstName}</p>
          <p style="margin: 5px 0;"><strong>📧 Email:</strong> ${email}</p>
          <p style="margin: 5px 0;"><strong>🕐 Time:</strong> ${new Date().toLocaleString()}</p>
          <p style="margin: 5px 0;"><strong>🔗 Profile Link:</strong> <a href="${process.env.NEXT_PUBLIC_BASE_URL}/admin/candidates">View All Candidates</a></p>
        </div>
  <p style="font-size: 14px; color: #777;">This is an automated notification from the Globixs Technology Solutions system.</p>
      </div>
    `,
  };

  // Send both emails simultaneously
  try {
    const [userInfo, adminInfo] = await Promise.all([
      transporter.sendMail(userMailOptions),
      transporter.sendMail(adminMailOptions),
    ]);

    console.log('Candidate registration emails sent successfully:', {
      userMessageId: userInfo.messageId,
      adminMessageId: adminInfo.messageId,
      userResponse: userInfo.response,
      adminResponse: adminInfo.response,
      accepted: userInfo.accepted,
      rejected: userInfo.rejected,
    });

    return userInfo;
  } catch (error) {
    console.error('Error sending candidate registration emails:', error);
    throw error;
  }
};

/**
 * Send registration confirmation email to business AND notify admin
 * @param email User's email address
 * @param companyName Company name
 */
export const sendBusinessRegistrationEmail = async (
  email: string,
  companyName: string
): Promise<nodemailer.SentMessageInfo> => {
  // Configure email transporter
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.EMAIL_PORT || '587'),
    secure: process.env.EMAIL_SECURE === 'true',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  // Enable debugging
  transporter.on('error', (error) => {
    console.error('SMTP Error:', error);
  });

  // USER EMAIL - Confirmation to business
  const userMailOptions = {
    from: `"Globixs Technology Solutions Business Portal" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: 'Welcome to Globixs Technology Solutions Business Portal',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; border: 1px solid #ddd; padding: 20px; border-radius: 10px;">
        <div style="text-align: center; padding: 20px 0;">
          <div style="background: linear-gradient(to right, #7e22ce, #14b8a6); color: white; padding: 15px; border-radius: 10px; font-size: 22px; font-weight: bold;">
            PioneerIT
          </div>
        </div>
        <h2 style="color: #7e22ce; text-align: center; font-family: 'Arial', sans-serif;">
          Welcome to Our Business Portal!
        </h2>
        <p style="font-size: 16px; color: #333;">
          Dear ${companyName} Team,
        </p>
        <p style="font-size: 16px; color: #333;">
          Thank you for registering with Globixs Technology Solutions Business Portal. Your business account has been successfully created.
        </p>
        <p style="font-size: 16px; color: #333;">
          As a business partner, you can now:
        </p>
        <ul style="font-size: 16px; color: #333;">
          <li>Post job openings and manage applications</li>
          <li>Access our talent pool of qualified candidates</li>
          <li>Track recruitment progress</li>
          <li>Collaborate with our staffing specialists</li>
        </ul>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${process.env.NEXT_PUBLIC_BASE_URL}/login/business" style="background: linear-gradient(to right, #7e22ce, #14b8a6); color: white; padding: 12px 25px; text-decoration: none; font-size: 16px; border-radius: 5px; display: inline-block;">Login to Business Portal</a>
        </div>
        <p style="font-size: 16px; color: #333;">
          Our team is dedicated to helping you find the right talent for your organization. If you have any questions, please don't hesitate to contact us.
        </p>
        <p style="font-size: 16px; color: #333;">
          Thanks,
          <br />
          Globixs Technology Solutions Business Solutions Team
        </p>
        <hr style="border: 1px solid #ddd; margin: 30px 0;" />
        <p style="font-size: 12px; color: #777; text-align: center;">
          © ${new Date().getFullYear()} Globixs Technology Solutions. All rights reserved.
        </p>
      </div>
    `,
  };

  // ADMIN EMAIL - Notification to admin
  const adminMailOptions = {
    from: `"Globixs Technology Solutions System" <${process.env.EMAIL_USER}>`,
    to: process.env.EMAIL_USER, // Goes to Connect@Globixs.com
    subject: 'New Business Registration - Globixs Technology Solutions',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; border: 1px solid #ddd; padding: 20px; border-radius: 10px;">
        <h2 style="color: #7e22ce;">🏢 New Business Registration</h2>
        <div style="background: #f8f9fa; padding: 15px; border-radius: 5px; margin: 20px 0;">
          <p style="margin: 5px 0;"><strong>🏢 Company:</strong> ${companyName}</p>
          <p style="margin: 5px 0;"><strong>📧 Email:</strong> ${email}</p>
          <p style="margin: 5px 0;"><strong>🕐 Time:</strong> ${new Date().toLocaleString()}</p>
          <p style="margin: 5px 0;"><strong>🔗 Profile Link:</strong> <a href="${process.env.NEXT_PUBLIC_BASE_URL}/admin/businesses">View All Businesses</a></p>
        </div>
  <p style="font-size: 14px; color: #777;">This is an automated notification from the Globixs Technology Solutions system.</p>
      </div>
    `,
  };

  // Send both emails simultaneously
  try {
    const [userInfo, adminInfo] = await Promise.all([
      transporter.sendMail(userMailOptions),
      transporter.sendMail(adminMailOptions),
    ]);

    console.log('Business registration emails sent successfully:', {
      userMessageId: userInfo.messageId,
      adminMessageId: adminInfo.messageId,
      userResponse: userInfo.response,
      adminResponse: adminInfo.response,
      accepted: userInfo.accepted,
      rejected: userInfo.rejected,
    });

    return userInfo;
  } catch (error) {
    console.error('Error sending business registration emails:', error);
    throw error;
  }
};

/**
 * Send job application confirmation email to applicant AND notify admin
 * @param email Applicant's email address
 * @param fullName Applicant's full name
 * @param jobTitle Title of the job applied for
 */
export const sendJobApplicationConfirmationEmail = async (
  email: string,
  fullName: string,
  jobTitle: string
): Promise<nodemailer.SentMessageInfo> => {
  // Configure email transporter
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.EMAIL_PORT || '587'),
    secure: process.env.EMAIL_SECURE === 'true',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  // Enable debugging
  transporter.on('error', (error) => {
    console.error('SMTP Error:', error);
  });

  // Format first name (use only the first part of the full name)
  const firstName = fullName.split(' ')[0];

  // USER EMAIL - Confirmation to applicant
  const userMailOptions = {
    from: `"Globixs Technology Solutions Careers" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: `Your Application for ${jobTitle} - Globixs Technology Solutions`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; border: 1px solid #ddd; padding: 20px; border-radius: 10px;">
        <div style="text-align: center; padding: 20px 0;">
          <div style="background: linear-gradient(to right, #7e22ce, #14b8a6); color: white; padding: 15px; border-radius: 10px; font-size: 22px; font-weight: bold;">
            Globixs Technology Solutions
          </div>
        </div>
        <h2 style="color: #7e22ce; text-align: center; font-family: 'Arial', sans-serif;">
          Application Received
        </h2>
        <p style="font-size: 16px; color: #333;">
          Dear ${firstName},
        </p>
        <p style="font-size: 16px; color: #333;">
          Thank you for applying for the <strong>${jobTitle}</strong> position at Globixs Technology Solutions. We've received your application and are excited to review your qualifications.
        </p>
        <p style="font-size: 16px; color: #333;">
          Here's what happens next:
        </p>
        <ol style="font-size: 16px; color: #333;">
          <li>Our recruitment team will review your application within the next 5-7 business days</li>
          <li>If your qualifications match our requirements, we'll contact you to schedule an interview</li>
          <li>If we determine that your skills and experience aren't the right fit for this particular role, we'll keep your information on file for future opportunities</li>
        </ol>
        <p style="font-size: 16px; color: #333;">
          In the meantime, we encourage you to:
        </p>
        <ul style="font-size: 16px; color: #333;">
          <li>Visit our <a href="${process.env.NEXT_PUBLIC_BASE_URL}/careers" style="color: #7e22ce;">careers page</a> to explore other opportunities</li>
          <li>Follow us on <a href="https://www.linkedin.com/company/pioneerit" style="color: #7e22ce;">LinkedIn</a> for company updates and new job postings</li>
        </ul>
        <p style="font-size: 16px; color: #333;">
          If you have any questions about your application or our hiring process, please don't hesitate to contact our recruitment team.
        </p>
        <p style="font-size: 16px; color: #333;">
          Best regards,
          <br />
          Globixs Technology Solutions Talent Acquisition Team
        </p>
        <hr style="border: 1px solid #ddd; margin: 30px 0;" />
        <p style="font-size: 12px; color: #777; text-align: center;">
          © ${new Date().getFullYear()} Globixs Technology Solutions. All rights reserved.
        </p>
      </div>
    `,
  };

  return await transporter.sendMail(userMailOptions);
};

/**
 * Send job application admin notification email
 * @param email Applicant's email
 * @param fullName Applicant's full name  
 * @param jobTitle Job title applied for
 */
export const sendJobApplicationAdminNotification = async (
  email: string,
  fullName: string,
  jobTitle: string
): Promise<nodemailer.SentMessageInfo> => {
  // Configure email transporter
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.EMAIL_PORT || '587'),
    secure: process.env.EMAIL_SECURE === 'true',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  // ADMIN EMAIL - Notification to admin
  const adminMailOptions = {
    from: `"Globixs Technology Solutions System" <${process.env.EMAIL_USER}>`,
    to: process.env.EMAIL_USER, // Goes to info@globixs.com
    subject: `New Job Application: ${jobTitle} - Globixs Technology Solutions`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; border: 1px solid #ddd; padding: 20px; border-radius: 10px;">
        <h2 style="color: #7e22ce;">📋 New Job Application</h2>
        <div style="background: #f8f9fa; padding: 15px; border-radius: 5px; margin: 20px 0;">
          <p style="margin: 5px 0;"><strong>💼 Position:</strong> ${jobTitle}</p>
          <p style="margin: 5px 0;"><strong>👤 Applicant:</strong> ${fullName}</p>
          <p style="margin: 5px 0;"><strong>📧 Email:</strong> ${email}</p>
          <p style="margin: 5px 0;"><strong>🕐 Applied On:</strong> ${new Date().toLocaleString()}</p>
          <p style="margin: 5px 0;"><strong>🔗 Applications:</strong> <a href="${process.env.NEXT_PUBLIC_BASE_URL}/admin/applications">View All Applications</a></p>
        </div>
  <p style="font-size: 14px; color: #777;">This is an automated notification from the Globixs Technology Solutions system.</p>
      </div>
    `,
  };

  // Send admin email
  try {
    const adminInfo = await transporter.sendMail(adminMailOptions);

    console.log('Job application admin notification sent successfully:', {
      adminMessageId: adminInfo.messageId,
      adminResponse: adminInfo.response,
      accepted: adminInfo.accepted,
      rejected: adminInfo.rejected,
    });

    return adminInfo;
  } catch (error) {
    console.error('Error sending job application admin notification:', error);
    throw error;
  }
};

/**
 * Send contact form confirmation email to sender AND notify admin
 * @param email Contact's email address
 * @param firstName Contact's first name
 * @param subject Message subject (optional)
 * @param message Message content (optional)
 */
export const sendContactFormConfirmationEmail = async (
  email: string,
  firstName: string,
  subject?: string,
  message?: string
): Promise<nodemailer.SentMessageInfo> => {
  // Configure email transporter
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.EMAIL_PORT || '587'),
    secure: process.env.EMAIL_SECURE === 'true',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  // Enable debugging
  transporter.on('error', (error) => {
    console.error('SMTP Error:', error);
  });

  // USER EMAIL - Confirmation to contact
  const userMailOptions = {
    from: `"Globixs Technology Solutions Support" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: 'Thanks for Contacting Globixs Technology Solutions',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; border: 1px solid #ddd; padding: 20px; border-radius: 10px;">
        <div style="text-align: center; padding: 20px 0;">
          <div style="background: linear-gradient(to right, #7e22ce, #14b8a6); color: white; padding: 15px; border-radius: 10px; font-size: 22px; font-weight: bold;">
            Globixs
          </div>
        </div>
        <h2 style="color: #7e22ce; text-align: center; font-family: 'Arial', sans-serif;">
          Message Received
        </h2>
        <p style="font-size: 16px; color: #333;">
          Dear ${firstName},
        </p>
        <p style="font-size: 16px; color: #333;">
          Thank you for reaching out to Globixs Technology Solutions. We've received your message and appreciate your interest in our services.
        </p>
        <p style="font-size: 16px; color: #333;">
          Our team is reviewing your inquiry and will respond within 1-2 business days. If your matter requires immediate attention, please call our support line at ${process.env.SUPPORT_PHONE || '+1 (123) 456-7890'}.
        </p>
        <p style="font-size: 16px; color: #333;">
          While you wait, you might find these resources helpful:
        </p>
        <ul style="font-size: 16px; color: #333;">
          <li><a href="${process.env.NEXT_PUBLIC_BASE_URL}/about-us" style="color: #7e22ce;">About Us</a> - Learn more about our company</li>
          <li><a href="${process.env.NEXT_PUBLIC_BASE_URL}/careers" style="color: #7e22ce;">Careers</a> - Explore career opportunities with us</li>
          <li><a href="${process.env.NEXT_PUBLIC_BASE_URL}" style="color: #7e22ce;">Home</a> - Explore our main website</li>
        </ul>
        <p style="font-size: 16px; color: #333;">
          We look forward to connecting with you soon.
        </p>
        <p style="font-size: 16px; color: #333;">
          Best regards,
          <br />
          Globixs Technology Solutions Customer Support Team
        </p>
        <hr style="border: 1px solid #ddd; margin: 30px 0;" />
        <p style="font-size: 12px; color: #777; text-align: center;">
          © ${new Date().getFullYear()} Globixs Technology Solutions. All rights reserved.
        </p>
      </div>
    `,
  };

  // ADMIN EMAIL - Notification to admin
  const adminMailOptions = {
    from: `"Globixs Technology Solutions System" <${process.env.EMAIL_USER}>`,
    to: process.env.EMAIL_USER, // Goes to info@globixs.com
    subject: `New Contact Form: ${subject || 'General Inquiry'} - Globixs Technology Solutions`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; border: 1px solid #ddd; padding: 20px; border-radius: 10px;">
        <h2 style="color: #7e22ce;">📧 New Contact Form Submission</h2>
        <div style="background: #f8f9fa; padding: 15px; border-radius: 5px; margin: 20px 0;">
          <p style="margin: 5px 0;"><strong>👤 Name:</strong> ${firstName}</p>
          <p style="margin: 5px 0;"><strong>📧 Email:</strong> ${email}</p>
          <p style="margin: 5px 0;"><strong>📝 Subject:</strong> ${subject || 'No subject provided'}</p>
          <p style="margin: 5px 0;"><strong>🕐 Submitted:</strong> ${new Date().toLocaleString()}</p>
        </div>
        ${
          message
            ? `
        <div style="background: #ffffff; border: 1px solid #ddd; padding: 15px; border-radius: 5px; margin: 20px 0;">
          <p style="margin: 0 0 10px 0;"><strong>💬 Message:</strong></p>
          <p style="margin: 0; white-space: pre-wrap; word-wrap: break-word;">${message}</p>
        </div>
        `
            : ''
        }
        <div style="text-align: center; margin: 20px 0;">
          <a href="mailto:${email}?subject=Re: ${subject || 'Your inquiry'}" style="background: linear-gradient(to right, #7e22ce, #14b8a6); color: white; padding: 10px 20px; text-decoration: none; font-size: 14px; border-radius: 5px; display: inline-block;">Reply to ${firstName}</a>
        </div>
  <p style="font-size: 14px; color: #777;">This is an automated notification from the Globixs Technology Solutions system.</p>
      </div>
    `,
  };

  // Send both emails simultaneously
  try {
    const [userInfo, adminInfo] = await Promise.all([
      transporter.sendMail(userMailOptions),
      transporter.sendMail(adminMailOptions),
    ]);

    console.log('Contact form emails sent successfully:', {
      userMessageId: userInfo.messageId,
      adminMessageId: adminInfo.messageId,
      userResponse: userInfo.response,
      adminResponse: adminInfo.response,
      accepted: userInfo.accepted,
      rejected: userInfo.rejected,
    });

    return userInfo;
  } catch (error) {
    console.error('Error sending contact form emails:', error);
    throw error;
  }
};
