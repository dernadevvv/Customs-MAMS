import React from 'react';
import { MoreHorizontal } from 'lucide-react';

interface ChartCardProps {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}

const ChartCard: React.FC<ChartCardProps> = ({ title, subtitle, children }) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 backdrop-blur-sm dark:backdrop-blur-lg backdrop-saturate-150 border border-gray-100 dark:border-gray-700">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">{title}</h3>
          {subtitle && <p className="text-sm text-gray-500 dark:text-gray-400">{subtitle}</p>}
        </div>
        <button className="p-2 text-gray-400 rounded-full hover:text-gray-500 dark:hover:text-gray-300 focus:outline-none">
          <MoreHorizontal size={20} />
        </button>
      </div>
      <div>{children}</div>
    </div>
  );
};

export default ChartCard;