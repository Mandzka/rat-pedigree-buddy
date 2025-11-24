import React from 'react';

interface ModernTabsProps {
  tabs: { id: string; label: string; icon?: React.ReactNode; count?: number }[];
  activeTab: string;
  onTabChange: (tabId: string) => void;
}

export function ModernTabs({ tabs, activeTab, onTabChange }: ModernTabsProps) {
  return (
    <div className="p-2">
      <div className="flex space-x-1 overflow-x-auto scrollbar-hide">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`
              flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium text-sm transition-all duration-200 whitespace-nowrap
              ${activeTab === tab.id 
                ? 'text-white shadow-lg bg-gradient-to-r from-red-600 to-black' 
                : 'text-slate-600 hover:text-red-700 hover:bg-red-50'
              }
            `}
          >
            {tab.icon}
            <span>{tab.label}</span>
            {tab.count !== undefined && (
              <span className={`
                px-2 py-0.5 rounded-full text-xs font-semibold
                ${activeTab === tab.id 
                  ? 'bg-white/30 text-white backdrop-blur-sm' 
                  : 'bg-red-100 text-red-700'
                }
              `}
              >
                {tab.count}
              </span>
            )}
          </button>
        ))}
      </div>
      <style>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
}
