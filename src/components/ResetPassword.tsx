import { useSearchParams, useNavigate } from 'react-router-dom';
import { useState } from 'react';

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const [newPassword, setNewPassword] = useState('');
  const navigate = useNavigate();
  const [passwordError, setPasswordError] = useState('');


  const handleReset = async () => {
  setPasswordError('');

  if (!newPassword.trim()) {
    setPasswordError('กรุณากรอกรหัสผ่านใหม่');
    return;
  }

  // ✅ ตรวจสอบรูปแบบรหัสผ่าน
  const isValid = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{12,}$/.test(newPassword);
  if (!isValid) {
    setPasswordError('Password ต้องมีอักษร ตัวเลข และอักขระพิเศษ รวม ≥12 ตัว');
    return;
  }

  // 🔁 ดำเนินการ reset
  const res = await fetch('http://localhost:5000/api/reset-password', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ token, newPassword })
  });

  const data = await res.json();
  if (res.ok) {
    alert('รีเซ็ตรหัสผ่านสำเร็จ');
    navigate('/');
  } else {
    alert(data.error || 'เกิดข้อผิดพลาด');
  }
};


  return (
    <div className="p-4 max-w-md mx-auto">
      <h1>รีเซ็ตรหัสผ่าน</h1>
      <input
          type="password"
          value={newPassword}
          onChange={e => setNewPassword(e.target.value)}
          placeholder="รหัสผ่านใหม่"
          className="border px-2 py-1 w-full mt-2"
        />
        {passwordError && <p className="text-red-500 text-sm mt-1">{passwordError}</p>}
      <button onClick={handleReset} className="mt-4 bg-blue-500 text-white px-4 py-2 rounded">
        รีเซ็ตรหัสผ่าน
      </button>
    </div>
  );
};

export default ResetPassword;