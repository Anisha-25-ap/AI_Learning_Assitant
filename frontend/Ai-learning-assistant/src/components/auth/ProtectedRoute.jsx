import React from 'react'
import { Navigate, Outlet } from 'react-router-dom';
import AppLayout from '../layout/AppLayout';

const ProtectedRoute = () => {

  const {isAuthentiated, loading} = useAuth()



  if(loading){
    return <div>Loading....</div>;
  }
  return isAuthentiated ? (
    <AppLayout>
      <Outlet/>
    </AppLayout>
  ) : (
    <Navigate to ="/login" replace />
  );
  
}

export default ProtectedRoute