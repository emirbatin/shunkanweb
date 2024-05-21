// src/pages/AdminPage.jsx
import React from 'react';
import Sidebar from '../components/Sidebar/Sidebar';
import SimpleChart from '../components/UserGrowthChart/UserGrowthChart';
import ErrorBoundary from '../components/ErrorBoundary';

const AdminPage = () => {
  return (
    <ErrorBoundary>
      <div className="flex h-full">
        <Sidebar />
        <div className="w-full flex flex-col h-auto m-10 text-left">
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <div className="flex flex-col bg-white">
            <div className="flex flex-row bg-white">
              <div className="flex w-full p-2 justify-between">
                <div className="bg-blue-500 w-60 text-white p-4 rounded-lg">
                  <h1 className="text-2xl font-bold">Courses</h1>
                  <p className="text-2xl font-bold">10</p>
                </div>
                <div className="bg-blue-500 w-60 text-white p-4 rounded-lg">
                  <h1 className="text-2xl font-bold">Questions</h1>
                  <p className="text-2xl font-bold">10</p>
                </div>
                <div className="bg-blue-500 w-60 text-white p-4 rounded-lg">
                  <h1 className="text-2xl font-bold">Words</h1>
                  <p className="text-2xl font-bold">10</p>
                </div>
                <div className="bg-blue-500 w-60 text-white p-4 rounded-lg">
                  <h1 className="text-2xl font-bold">Users</h1>
                  <p className="text-2xl font-bold">10</p>
                </div>
              </div>
            </div>
            <div className="mt-10">
              <h2 className="text-2xl font-bold mb-4">User Growth Over Time</h2>
              
            </div>
          </div>
        </div>
      </div>
    </ErrorBoundary>
  );
};

export default AdminPage;
