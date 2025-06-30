import React from 'react';
import ActivityItem from './ActivityItem';
import { ShoppingCart, UserPlus, FileText, MessageSquare, Mail } from 'lucide-react';

const ActivityFeed: React.FC = () => {
  const activities = [
    {
      icon: ShoppingCart,
      color: 'green',
      title: 'New order received',
      description: 'Order #12345 - $230.00',
      time: '2 min ago',
    },
    {
      icon: UserPlus,
      color: 'blue',
      title: 'New customer registered',
      description: 'John Smith joined as a new customer',
      time: '1 hour ago',
    },
    {
      icon: FileText,
      color: 'purple',
      title: 'Report generated',
      description: 'Monthly sales report was generated',
      time: '3 hours ago',
    },
    {
      icon: MessageSquare,
      color: 'orange',
      title: 'New comment',
      description: 'Lisa commented on a recent post',
      time: '5 hours ago',
    },
    {
      icon: Mail,
      color: 'red',
      title: 'New message',
      description: 'You have a new message from support',
      time: '1 day ago',
    },
  ];

  return (
    <div className="flow-root">
      <ul className="divide-y divide-gray-200 dark:divide-gray-700">
        {activities.map((activity, index) => (
          <li key={index} className="py-2">
            <ActivityItem {...activity} />
          </li>
        ))}
      </ul>
      <div className="mt-4 text-center">
        <button className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors">
          View all activity
        </button>
      </div>
    </div>
  );
};

export default ActivityFeed;