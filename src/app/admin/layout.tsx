import React from 'react';

export default function AdminLayout({children}: {children: React.ReactNode}) {
  return <div className="bg-secondary min-h-screen">{children}</div>;
}
