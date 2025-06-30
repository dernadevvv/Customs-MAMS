import React from 'react';
import { Users, ShoppingCart, CreditCard, TrendingUp, Activity, MessageSquare, FileText, Mail } from 'lucide-react';
import StatCard from './StatCard';
import ChartCard from './ChartCard';
import ActivityFeed from './ActivityFeed';


const Dashboard: React.FC = () => {
  return (
    <div className="px-4 sm:px-6 lg:px-8 py-8 w-full max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">สวัสดี คุณ...</h1>
          <p className="mt-1 text-md text-gray-500 dark:text-gray-400">
            ภาพรวมของคุณ
          </p>
        </div>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Badge Level"
          value="Beginner"
          change={{ value: "12%", positive: true }}
          icon={Users}
          color="blue"
        />
        <StatCard
          title="Coins"
          value="200"
          change={{ value: "8%", positive: true }}
          icon={ShoppingCart}
          color="green"
        />
        <StatCard
          title="Your Events"
          value="23"
          change={{ value: "2%", positive: false }}
          icon={CreditCard}
          color="orange"
        />
        <StatCard
          title="Your Ranking"
          value="3"
          change={{ value: "5%", positive: true }}
          icon={TrendingUp}
          color="purple"
        />
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <ChartCard title="Dashboard Overview" subtitle="Weekly performance">
          <div className="h-72 flex items-center justify-center bg-gray-50 dark:bg-gray-700/30 rounded-lg">
            <p className="text-gray-500 dark:text-gray-400">visualization</p>
          </div>
        </ChartCard>
        <ChartCard title="Events overview" subtitle="Weekly performance">
          <div className="h-72 flex items-center justify-center bg-gray-50 dark:bg-gray-700/30 rounded-lg">
            <p className="text-gray-500 dark:text-gray-400">visualization</p>
          </div>
        </ChartCard>
      </div>

      {/* Activity feed and tasks */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <ChartCard title="Recent Activity">
          <ActivityFeed />
        </ChartCard>
        <ChartCard title="Upcoming Events" subtitle="กิจกรรมเร็วๆนี้">
          <div className="space-y-4">
            <div className="flex items-center p-3 bg-gray-50 dark:bg-gray-700/30 rounded-lg">
              <input 
                type="checkbox" 
                className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500" 
              />
              <div className="ml-3 flex-1">
                <p className="text-sm font-medium text-gray-900 dark:text-white">Complete quarterly report</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">Due in 2 days</p>
              </div>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400">
                Special
              </span>
            </div>
            <div className="flex items-center p-3 bg-gray-50 dark:bg-gray-700/30 rounded-lg">
              <input 
                type="checkbox" 
                className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500" 
              />
              <div className="ml-3 flex-1">
                <p className="text-sm font-medium text-gray-900 dark:text-white">Review new customer applications</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">Due in 3 days</p>
              </div>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400">
                Team
              </span>
            </div>
            <div className="flex items-center p-3 bg-gray-50 dark:bg-gray-700/30 rounded-lg">
              <input 
                type="checkbox" 
                className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500" 
              />
              <div className="ml-3 flex-1">
                <p className="text-sm font-medium text-gray-900 dark:text-white">Update product inventory</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">Due in 1 week</p>
              </div>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                Solo
              </span>
            </div>
          </div>
        </ChartCard>
      </div>
    </div>
  );
};

export default Dashboard;