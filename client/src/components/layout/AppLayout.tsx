import type { ReactNode } from 'react';
import Navbar from './Navbar';
import LeftSidebar from './LeftSidebar';
import './AppLayout.css';

interface AppLayoutProps {
  children: ReactNode;
}

export default function AppLayout({ children }: AppLayoutProps) {
  return (
    <>
      <Navbar minimal />
      <div className="app-layout">
        <LeftSidebar />
        <main className="app-layout-main">
          <div className="app-layout-feed">
            {children}
          </div>
        </main>
      </div>
    </>
  );
}
