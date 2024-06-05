import * as React from "react";

interface VerificationEmailProps {
  username: string;
  otp: string;
}

const VerificationEmail: React.FC<Readonly<VerificationEmailProps>> = ({
  username,
  otp,
}) => (
  <div>
    <h1> Hey {username}</h1>
    <br />
    <p>
      Thank you for signing up for our service. To complete your registration,
      please use the following one-time password (OTP): <strong>{otp}</strong>
    </p>
    <br />
    <p>
      Please enter this verification code within the next 1 hours for
      confirmation of your email address and activate your account.
    </p>
    <br />
    <p>If you did not request this verification, please ignore this email. </p>
    <br />
    <br />
    <p>
      {" "}
      Best regards,
      <br />
      True FeedBAck
    </p>
  </div>
);

export default VerificationEmail;
