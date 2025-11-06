// app/login/layout.tsx
import React from 'react';

export const metadata = {
  title: 'Login - PioneerIT',
  description:
    'Access your PioneerIT account to manage your profile and services.',
};

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className=" bg-slate-50">
      {/* Decorative elements */}
      <div className="fixed top-0 right-0 w-1/3 h-screen bg-gradient-to-b from-globixs-primary/5 to-globixs-secondary/5 -z-10"></div>
      <div className="fixed top-20 left-10 w-64 h-64 bg-globixs-primary/10 rounded-full filter blur-3xl animate-float -z-10"></div>
      <div
        className="fixed bottom-20 right-10 w-64 h-64 bg-globixs-secondary/10 rounded-full filter blur-3xl animate-float -z-10"
        style={{ animationDelay: '2s' }}
      ></div>

      {children}
    </div>
  );
}
