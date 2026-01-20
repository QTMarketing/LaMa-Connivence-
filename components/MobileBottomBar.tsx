'use client';

import Link from 'next/link';
import { Home, Tag, Gift, MapPin, Menu } from 'lucide-react';
import { usePathname } from 'next/navigation';

interface MobileBottomBarProps {
    onMenuClick: () => void;
}

export default function MobileBottomBar({ onMenuClick }: MobileBottomBarProps) {
    const pathname = usePathname();

    const isActive = (path: string) => pathname === path;

    return (
        <div className="md:hidden fixed bottom-0 left-0 w-full bg-white border-t border-gray-200 z-50 pb-safe">
            <div className="grid grid-cols-5 h-16 items-center">
                <Link href="/" className={`flex flex-col items-center justify-center space-y-1 ${isActive('/') ? 'text-primary' : 'text-neutral'}`} style={{ color: isActive('/') ? '#FF6B35' : '#4A5568' }}>
                    <Home size={24} />
                    <span className="text-[10px] font-medium">Home</span>
                </Link>

                <Link href="/deals" className={`flex flex-col items-center justify-center space-y-1 ${isActive('/deals') ? 'text-primary' : 'text-neutral'}`} style={{ color: isActive('/deals') ? '#FF6B35' : '#4A5568' }}>
                    <Tag size={24} />
                    <span className="text-[10px] font-medium">Deals</span>
                </Link>

                <div className="relative -top-5">
                    <Link href="/#store-locator">
                        <div className="bg-primary text-white p-4 rounded-lg shadow-lg border-4 border-gray-50 flex items-center justify-center transform transition-transform active:scale-95" style={{ backgroundColor: '#FF6B35' }}>
                            <MapPin size={28} fill="currentColor" />
                        </div>
                    </Link>
                </div>

                <Link href="/rewards" className={`flex flex-col items-center justify-center space-y-1 ${isActive('/rewards') ? 'text-primary' : 'text-neutral'}`} style={{ color: isActive('/rewards') ? '#FF6B35' : '#4A5568' }}>
                    <Gift size={24} />
                    <span className="text-[10px] font-medium">Rewards</span>
                </Link>

                <button
                    onClick={onMenuClick}
                    className="flex flex-col items-center justify-center space-y-1 text-neutral hover:text-primary focus:outline-none transition-colors"
                    style={{ color: '#4A5568' }}
                >
                    <Menu size={24} />
                    <span className="text-[10px] font-medium">Menu</span>
                </button>
            </div>
        </div>
    );
}




