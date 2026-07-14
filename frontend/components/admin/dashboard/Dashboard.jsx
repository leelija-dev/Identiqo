// components/admin/dashboard/Dashboard.jsx
import React from 'react';

const DashboardPage = () => {
  return (
    <div className="p-8">
      <div className="bg-white rounded-2xl shadow-sm p-8 border border-gray-100">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Welcome to Dashboard</h1>
        <p className="text-gray-600">You are successfully logged in. Your dashboard content will appear here.</p>
        
        <div className="mt-6 p-4 bg-blue-50 rounded-xl border border-blue-100">
          <p className="text-blue-700">
            <span className="font-medium">Status:</span> Everything is running smoothly.
          </p>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;