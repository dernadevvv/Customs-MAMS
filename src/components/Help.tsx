import React from 'react';

const Help: React.FC = () => {
  return (
    <div className="p-6">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Help & Support</h2>
        <p className="mt-1 text-md text-gray-500 dark:text-gray-400">ข้อมูลติดต่อ</p>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
        <div className="text-center py-12">
          <p className="text-gray-500 dark:text-gray-400">ใส่คอนแทค</p>
        </div>
      </div>
    </div>
  );
};

export default Help;