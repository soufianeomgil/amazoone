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

export async function sendVerificationEmail(email: string, token: string) {
  const verificationUrl = `${process.env.NEXTAUTH_URL}/verify-email?token=${token}`;
  
  const mailOptions = {
    from: 'soufianehmamou92@gmail.com',
    to: email,
    subject: "Verify your email address",
    html: `
      <h1>Your Verification Code is</h1>
      <h2>${token}</h2>
       <p>This code expires in 10 minutes. If you did not request this, please ignore.</p>
    `,
  };

  await transporter.sendMail(mailOptions);
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