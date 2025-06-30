import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from './Navbar';
import Sidebar from './Sidebar';

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
  const navigate = useNavigate();

  useEffect(() => {
    const logout = async (message: string) => {
      const user = JSON.parse(localStorage.getItem('currentUser') || '{}');
      const userID = user?.UserID;
      const timestamp = new Date().toISOString();

      if (userID) {
        try {
          await fetch('http://localhost:5000/api/log-signout', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userID, timestamp })
          });
        } catch (err) {
          console.error('⚠️ Logging sign-out (timeout) failed:', err);
        }
      }

      alert(message);
      localStorage.removeItem('currentUser');
      localStorage.removeItem('sessionStart');
      localStorage.removeItem('lastActivity');
      navigate('/');
    };


    const updateLastActivity = () => {
      localStorage.setItem('lastActivity', Date.now().toString());
    };

    const checkSession = () => {
  const sessionStartStr = localStorage.getItem('sessionStart');
  const lastActivityStr = localStorage.getItem('lastActivity');
  const user = localStorage.getItem('currentUser');

  // ❗ ถ้าไม่มี session หรือ currentUser → ไม่ต้องทำอะไร
  if (!sessionStartStr || !lastActivityStr || !user) return;

  const sessionStart = parseInt(sessionStartStr);
  const lastActivity = parseInt(lastActivityStr);
  const now = Date.now();

  const maxSession = 4 * 60 * 60 * 1000;
  const maxIdle = 1 * 60 * 60 * 1000;

  if (now - sessionStart > maxSession) {
    logout('Session หมดอายุ (ครบ 4 ชั่วโมง)');
    return;
  }

  if (now - lastActivity > maxIdle) {
    logout('Session หมดอายุ (ไม่มีการใช้งานเกิน 1 ชั่วโมง)');
    return;
  }
};

    // ⏱ ตรวจ session ทุก 30 วินาที
    const interval = setInterval(checkSession, 30 * 1000);

    // 🖱 ตรวจ activity ผู้ใช้
    window.addEventListener('mousemove', updateLastActivity);
    window.addEventListener('keydown', updateLastActivity);
    window.addEventListener('click', updateLastActivity);
    window.addEventListener('scroll', updateLastActivity);

    // ตรวจทันทีเมื่อลง component
    updateLastActivity();
    checkSession();

    return () => {
      clearInterval(interval);
      window.removeEventListener('mousemove', updateLastActivity);
      window.removeEventListener('keydown', updateLastActivity);
      window.removeEventListener('click', updateLastActivity);
      window.removeEventListener('scroll', updateLastActivity);
    };
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300 relative overflow-hidden">
      <div
        className={`fixed inset-0 bg-black bg-opacity-40 z-20 transition-all duration-300 ${
          sidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setSidebarOpen(false)}
      />
      <Navbar toggleSidebar={toggleSidebar} />
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div
        className={`pt-16 transition-all duration-300 ${
          sidebarOpen ? 'pl-64 blur-sm' : 'pl-0'
        }`}
      >
        <main>{children}</main>
      </div>
    </div>
  );
};

export default DashboardLayout;
