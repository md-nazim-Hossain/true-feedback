import React from "react";

function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen items-center justify-center container">
      <div className="w-full max-w-lg p-5 shadow-xl rounded-md">{children}</div>
    </div>
  );
}

export default AuthLayout;
