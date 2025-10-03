import React, { useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { PlayerBar } from './PlayerBar';
import { Header } from './Header';
import { useUserStore } from '@/stores/user-store';

export function AppLayout() {
  useEffect(() => {
    // Fetch initial user data like playlists and liked tracks
    useUserStore.getState().fetchInitialData();
  }, []);

  return (
    <div className="relative h-screen w-full overflow-hidden">
      <div className="flex h-full">
        <Sidebar />
        <div className="flex-1 flex flex-col overflow-hidden">
          <Header />
          <main className="flex-1 overflow-y-auto pb-24">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
              <Outlet />
            </div>
          </main>
        </div>
      </div>
      <PlayerBar />
    </div>
  );
}