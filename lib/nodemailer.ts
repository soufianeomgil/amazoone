import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
    port: 587,
    service: "gmail",
    auth: {
        user: "soufianehmamou92@gmail.com",
        pass: "hmzivlerbulgzsyu"
    },
    secure: false,
    host: "smtp.gmail.com"
})

export async function sendVerificationEmail(email: string, code: string) {
  await transporter.sendMail({
    from: 'soufianehmamou92@gmail.com',
    to: email,
    subject: "Confirm your new email address",
    html: `
      <div style="font-family:Arial">
        <h2>Confirm your email</h2>
        <p>Use the code below to confirm your new email address:</p>
        <h1 style="letter-spacing:3px">${code}</h1>
        <p>This code expires in <strong>10 minutes</strong>.</p>
        <p>If you did not request this change, ignore this email.</p>
      </div>
    `,
  });
}

export async function sendSetPasswordCode(email:string,plainToken:string) {
  const mailOptions = {
    from: 'soufianehmamou92@gmail.com',
    to: email,
    subject: "Your Password Reset Code.",
    html: `
      <h1>Your Password Reset Code</h1>
     
      <p>Your code is <strong>${plainToken}</strong>.</p>
        <p>This code expires in 10 minutes. If you did not request this, please ignore.</p>
    `,
  };

  await transporter.sendMail(mailOptions);
}
interface ConfirmationOrderProps {
   orderId:string;
   email:string;
   shippingAddress: {
     postalCode:string;
     address:string;
     city:string;
    
   }
   order: {

   }
}
export async function sendOrderConfirmationEmail({orderId,shippingAddress,order,email}:ConfirmationOrderProps) {
  const mailOptions = {
    from: 'soufianehmamou92@gmail.com',
    to: email,
    subject: "Your Password Reset Code.",
    html: `
      <h1>Your Password Reset Code</h1>
      <p>Click the link below to verify your email address:</p>
      <p>something goes here</p>
    `,
  };

  await transporter.sendMail(mailOptions);
}



export async function sendResetEmail({
  to,
  code,
}: {
  to: string;
  code: string;
}) {
   const mailOptions = {
    from: 'soufianehmamou92@gmail.com',
    to,
    subject: "Your Password Reset Code.",
    html: `
      <h1>Your Password Reset Code</h1>
     
      <p>Your code is <strong>${code}</strong>.</p>
        <p>This code expires in 10 minutes. If you did not request this, please ignore.</p>
    `,
  };

  await transporter.sendMail(mailOptions);

  // Plug in:
  // - Resend
  // - AWS SES
  // - SendGrid
}




type SendPasswordChangedEmailParams = {
  to: string;
  fullName?: string;
  device?: string;
  ip?: string;
};

export async function sendPasswordChangedEmail({
  to,
  fullName,
  device,
  ip,
}: SendPasswordChangedEmailParams) {
  const name = fullName || "there";

  await transporter.sendMail({
    to,
    subject: "Your password has been changed",
    html: `
      <div style="font-family: Arial, sans-serif; color: #111;">
        <h2>Password changed</h2>
        <p>Hi ${name},</p>

        <p>
          This is a confirmation that the password for your account was
          successfully changed.
        </p>

        ${
          device || ip
            ? `<p><strong>Details:</strong><br/>
               ${device ? `Device: ${device}<br/>` : ""}
               ${ip ? `IP Address: ${ip}` : ""}
               </p>`
            : ""
        }

        <p>
          If you did not make this change, please reset your password immediately
          and contact our support team.
        </p>

        <p style="margin-top: 24px;">
          Stay safe,<br/>
          <strong>Security Team</strong>
        </p>
      </div>
    `,
  });
}



export const sendGoodbyeEmail = async (to: string, userName: string) => {
  const htmlTemplate = `
    <div style="font-family: sans-serif; max-width: 600px; margin: auto; border: 1px solid #eee; padding: 20px; border-radius: 10px;">
      <h2 style="color: #333;">We're sad to see you go, ${userName}</h2>
      <p style="color: #666; line-height: 1.6;">
        This email confirms that your account at <strong>Omgil Store</strong> has been successfully deleted. 
        All your personal data, saved items, and order history have been removed from our systems.
      </p>
      <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />
      <p style="font-size: 14px; color: #999;">
        If this wasn't you, or if you change your mind, you can always create a new account 
        on our website. We'd love to have you back!
      </p>
      <p style="margin-top: 30px; font-weight: bold; color: #333;">— The Omgil's Team</p>
    </div>
  `;

  const mailOptions = {
    from: process.env.EMAIL_FROM,
    to,
    subject: "Account Deleted - Omgil",
    html: htmlTemplate,
  };

  return await transporter.sendMail(mailOptions);
};