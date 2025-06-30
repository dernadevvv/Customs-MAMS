import React from 'react';
import { DivideIcon as LucideIcon } from 'lucide-react';

interface ActivityItemProps {
  icon: LucideIcon;
  color: 'blue' | 'green' | 'purple' | 'orange' | 'red';
  title: string;
  description: string;
  time: string;
}

const ActivityItem: React.FC<ActivityItemProps> = ({
  icon: Icon,
  color,
  title,
  description,
  time,
}) => {
  const colorClasses = {
    blue: 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400',
    green: 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400',
    purple: 'bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400',
    orange: 'bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400',
    red: 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400',
  };

  return (
    <div className="flex py-3">
      <div className={`h-9 w-9 rounded-full ${colorClasses[color]} flex items-center justify-center flex-shrink-0`}>
        <Icon size={18} />
      </div>
      <div className="ml-4 flex-1">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-medium text-gray-900 dark:text-white">{title}</h3>
          <p className="text-xs text-gray-500 dark:text-gray-400">{time}</p>
        </div>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{description}</p>
      </div>
    </div>
  );
};

export default ActivityItem;