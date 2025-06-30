// ป้องกันคนที่ไม่ล็อกอิน เข้ามาที่หน้า home และ profile
import React from 'react';
import { Navigate } from 'react-router-dom';

const PrivateRoute = ({ children }: { children: JSX.Element }) => {
  const isAuthenticated = !!localStorage.getItem('currentUser');
  return isAuthenticated ? children : <Navigate to="/" />;
};

export default PrivateRoute;
