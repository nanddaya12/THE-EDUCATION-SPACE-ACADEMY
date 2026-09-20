import React, { useState } from 'react';
import { ErpTopBar } from './ErpTopBar';
import { ErpSidebar } from './ErpSidebar';
import { Breadcrumbs } from './Breadcrumbs';
import { MobileNavigation } from './MobileNavigation';

export const ErpLayout = ({ children }) => {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-surface text-on-surface font-body">
      <ErpTopBar onToggleSidebar={() => setMobileSidebarOpen(prev => !prev)} />

      <div className="flex-1 flex overflow-hidden relative">
        <ErpSidebar 
          mobileOpen={mobileSidebarOpen} 
          onCloseMobile={() => setMobileSidebarOpen(false)} 
        />

        <main className="flex-1 p-4 md:p-6 lg:p-8 overflow-y-auto max-w-[1440px] mx-auto w-full pb-20 lg:pb-8">
          <Breadcrumbs />
          {children}
        </main>
      </div>

      <MobileNavigation onOpenMore={() => setMobileSidebarOpen(true)} />
    </div>
  );
};
