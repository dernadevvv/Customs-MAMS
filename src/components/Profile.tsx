import React, { useState, useEffect } from 'react';
import { Mail, Phone, MapPin, Briefcase, Calendar, Medal, Coins, Clock, Cake, Link as LinkIcon } from 'lucide-react';

const Profile: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [email, setEmail] = useState('user@example.com');
  const [phone, setPhone] = useState('0812345678');
  useEffect(() => {
  const storedUser = localStorage.getItem('currentUser');
  if (storedUser) {
    setCurrentUser(JSON.parse(storedUser));
  }
  }, []);

  // ลบบัญชี
  const handleDeactivateAccount = async () => {
  const userId = currentUser?.UserID;

  if (!userId) {
    alert('ไม่พบข้อมูลผู้ใช้');
    return;
  }

  const confirmed = window.confirm('คุณแน่ใจหรือไม่ว่าต้องการลบบัญชีนี้?');
  if (!confirmed) return;

  try {
    const res = await fetch('http://localhost:5000/api/deactivate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId }),
    });

    const data = await res.json();
    if (res.ok) {
      alert('บัญชีถูกลบเรียบร้อย');

      localStorage.removeItem('currentUser');
      window.location.href = '/'; // redirect ไปหน้าแรก
    } else {
      alert(data.error || 'เกิดข้อผิดพลาด');
    }
  } catch (err) {
    console.error(err);
    alert('ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์');
  }
};
  const recentActivities = [
    {
      action: "Event A",
      timestamp: "2 ชม. ที่แล้ว",
      details: "กำลังทำ"
    },
    {
      action: "Event B",
      timestamp: "1 วัน ที่แล้ว",
      details: "ไม่สำเร็จ"
    },
    {
      action: "Event C",
      timestamp: "2 วัน ที่แล้ว",
      details: "สำเร็จ ได้รับ 100 Coins"
    }
  ];

  // เปลี่ยนแปลงข้อมูล Email Tel
  const handleSave = async () => {
  const userId = currentUser?.UserID;
  if (!userId) {
    alert('ไม่พบข้อมูลผู้ใช้');
    return;
  }

  try {
    const res = await fetch('http://localhost:5000/api/update-profile', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, email, tel: phone }),
    });

    const data = await res.json();
    if (res.ok) {
      alert('บันทึกสำเร็จ');
      setCurrentUser({ ...currentUser, Email: email, Tel: phone });
      localStorage.setItem('currentUser', JSON.stringify({ ...currentUser, Email: email, Tel: phone }));
      setIsEditing(false);
    } else {
      alert(data.error || 'บันทึกล้มเหลว');
    }
  } catch (err) {
    console.error(err);
    alert('ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์');
  }
};

  
  return (
    <div className="p-6">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Profile</h2>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">โปรฟล์ของคุณ</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* ข้อมูลเปลี่ยนแปลงไม่ได้ */}
        <div className="lg:col-span-1">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
            <div className="text-center">
              <div className="relative inline-block">
                <img
                  src="https://ih1.redbubble.net/image.2539872835.1769/bg,f8f8f8-flat,750x,075,f-pad,750x1000,f8f8f8.jpg"
                  alt="Profile"
                  className="h-32 w-32 rounded-full object-cover mx-auto ring-4 ring-blue-100 dark:ring-blue-900"
                />
              </div>
              <h3 className="mt-4 text-xl font-semibold text-gray-900 dark:text-white">ID:</h3>
              <p className="text-gray-500 dark:text-gray-400">ชื่อ นามสกุล</p>
            </div>

            <div className="mt-6 space-y-4">
              <div className="flex items-center text-gray-500 dark:text-gray-400">
                <Briefcase size={18} className="mr-3" />
                <span>หน่วยงาน</span>
              </div>
              <div className="flex items-center text-gray-500 dark:text-gray-400">
                <Cake size={18} className="mr-3" />
                <span>วันเกิด</span>
              </div>
              <div className="flex items-center text-gray-500 dark:text-gray-400">
                <Mail size={18} className="mr-3 flex-shrink-0" />
                {isEditing ? (
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="flex-1 px-2 py-1 border rounded-md dark:bg-gray-700 dark:border-gray-600"
                    placeholder="อีเมล์"
                  />
                ) : (
                  <span>{email}</span>
                )}
              </div>
              <div className="flex items-center text-gray-500 dark:text-gray-400">
                <Phone size={18} className="mr-3 flex-shrink-0" />
                {isEditing ? (
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="flex-1 px-2 py-1 border rounded-md dark:bg-gray-700 dark:border-gray-600"
                    placeholder="โทร"
                  />
                ) : (
                  <span>{phone}</span>
                )}
              </div>
              <div className="flex items-center text-gray-500 dark:text-gray-400">
                <LinkIcon size={18} className="mr-3" />
                <span>เข้าร่วมเมื่อ</span>
              </div>
            </div>

            <div className="mt-6">
              {isEditing ? (
                <button
                  onClick={handleSave}
                  className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                >
                  บันทึก
                </button>
              ) : (
                <button
                  onClick={() => setIsEditing(true)}
                  className="w-full px-4 py-2 bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                >
                  แก้ไข
                </button>
              )}
              <div className="mt-3">
                <button
                  onClick={handleDeactivateAccount}
                  className="w-full px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
                >
                  ลบบัญชีผู้ใช้
                </button>
              </div>
            </div>
          
            {/* Badge and Coins Section */}
            <div className="grid grid-cols-2 gap-4 mt-6">
              <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
                <div className="flex items-center space-x-3">
                  <Medal className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Badge Level</p>
                    <p className="text-xl font-semibold text-blue-600 dark:text-blue-400">Beginner</p>
                  </div>
                </div>
              </div>
              <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-lg p-4">
                <div className="flex items-center space-x-3">
                  <Coins className="h-8 w-8 text-yellow-600 dark:text-yellow-400" />
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Coins</p>
                    <p className="text-xl font-semibold text-yellow-600 dark:text-yellow-400">300</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Achievement Stats */}
        <div className="lg:col-span-1">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Achievements</h3>
            <div className="space-y-4">
              <div className="p-4 bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 rounded-lg">
                <p className="text-sm text-gray-500 dark:text-gray-400">Solo Mission</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">12</p>
              </div>
              <div className="p-4 bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 rounded-lg">
                <p className="text-sm text-gray-500 dark:text-gray-400">Team Mission</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">24</p>
              </div>
              <div className="p-4 bg-gradient-to-r from-green-50 to-teal-50 dark:from-green-900/20 dark:to-teal-900/20 rounded-lg">
                <p className="text-sm text-gray-500 dark:text-gray-400">Special</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">8</p>
              </div>
              <div>
                <button onClick={handleDeactivateAccount}>ลบบัญชีผู้ใช้</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;