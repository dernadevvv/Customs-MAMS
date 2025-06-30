import React from 'react';
import { DivideIcon as LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  change?: {
    value: string | number;
    positive: boolean;
  };
  icon: LucideIcon;
  color: 'blue' | 'green' | 'purple' | 'orange';
}

const StatCard: React.FC<StatCardProps> = ({ title, value, change, icon: Icon, color }) => {
  const colorClasses = {
    blue: 'bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400',
    green: 'bg-green-50 text-green-600 dark:bg-green-900/20 dark:text-green-400',
    purple: 'bg-purple-50 text-purple-600 dark:bg-purple-900/20 dark:text-purple-400',
    orange: 'bg-orange-50 text-orange-600 dark:bg-orange-900/20 dark:text-orange-400',
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-md transition-all p-6 backdrop-blur-sm dark:backdrop-blur-lg backdrop-saturate-150 border border-gray-100 dark:border-gray-700">
      <div className="flex items-center">
        <div className={`p-3 rounded-lg ${colorClasses[color]}`}>
          <Icon size={24} />
        </div>
        <div className="ml-5 w-0 flex-1">
          <dl>
            <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">{title}</dt>
            <dd>
              <div className="text-lg font-semibold text-gray-900 dark:text-white">{value}</div>
            </dd>
          </dl>
        </div>
      </div>
      {change && (
        <div className="mt-4">
          <div className={`flex items-center text-sm ${change.positive ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
            <span>{change.positive ? '↑' : '↓'} {change.value}</span>
            <span className="ml-1 text-gray-500 dark:text-gray-400">from last period</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default StatCard;