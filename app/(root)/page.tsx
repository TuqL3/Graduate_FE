'use client';

import React, { useState } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { Line, Bar, Pie } from 'react-chartjs-2';
import { FiSettings, FiShare2, FiAlertCircle } from 'react-icons/fi';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
);

const Dashboard = () => {
  const [widgets, setWidgets] = useState([
    { id: 'reports', type: 'line', title: 'Số lượng báo cáo của các phòng' },
    { id: 'roomUsage', type: 'bar', title: 'Tần suất phòng được sử dụng' },
    { id: 'revenue', type: 'bar', title: 'Revenue Breakdown' },
    { id: 'distribution', type: 'pie', title: 'Market Distribution' },
    { id: 'activity', type: 'table', title: 'Recent Activities' },
    { id: 'userUsage', type: 'bar', title: 'Tần suất người sử dụng' },
  ]);

  const [theme, setTheme] = useState('light');
  const [error, setError] = useState(null);

  const dummyData = [
    { room: 'Phòng A', count: 5 },
    { room: 'Phòng B', count: 15 },
    { room: 'Phòng C', count: 10 },
    { room: 'Phòng D', count: 20 },
    { room: 'Phòng E', count: 8 },
    { room: 'Phòng F', count: 12 },
    { room: 'Phòng G', count: 7 },
    { room: 'Phòng H', count: 13 },
    { room: 'Phòng I', count: 18 },
    { room: 'Phòng J', count: 9 },
    { room: 'Phòng K', count: 14 },
    { room: 'Phòng L', count: 11 },
    { room: 'Phòng M', count: 6 },
    { room: 'Phòng N', count: 17 },
    { room: 'Phòng O', count: 16 },
    { room: 'Phòng P', count: 10 },
    { room: 'Phòng Q', count: 19 },
    { room: 'Phòng R', count: 21 },
    { room: 'Phòng S', count: 22 },
    { room: 'Phòng T', count: 23 },
  ];

  const dummyPieData = [
    { status: 'Broken', count: 30 },
    { status: 'Working', count: 40 },
    { status: 'Maintain', count: 30 },
  ];

  const userUsageData = [
    { name: 'Nguyễn Văn A', count: 3 },
    { name: 'Trần Thị B', count: 5 },
    { name: 'Lê Văn C', count: 2 },
    { name: 'Phạm Thị D', count: 7 },
    { name: 'Ngô Văn E', count: 4 },
  ];

  const userUsageBarData = {
    labels: userUsageData.map((item) => item.name), // Tên người sử dụng làm nhãn
    datasets: [
      {
        label: 'Tần suất người sử dụng',
        data: userUsageData.map((item) => item.count), // Dữ liệu là số lượng người sử dụng
        backgroundColor:
          theme === 'dark' ? '#e9c46a' : 'rgba(53, 162, 235, 0.5)',
      },
    ],
  };

  const transformedLineData = {
    labels: dummyData.map((item) => item.room),
    datasets: [
      {
        label: 'Số lượng báo cáo 2023',
        data: dummyData.map((item) => item.count),
        borderColor: theme === 'dark' ? '#f4a261' : 'rgb(75, 192, 192)',
        backgroundColor:
          theme === 'dark'
            ? 'rgba(244, 162, 97, 0.3)'
            : 'rgba(75, 192, 192, 0.3)',
        tension: 0.1,
      },
    ],
  };

  const roomUsageData = {
    labels: dummyData.map((item) => item.room),
    datasets: [
      {
        label: 'Tần suất phòng được sử dụng',
        data: dummyData.map((item) => item.count),
        backgroundColor:
          theme === 'dark' ? '#e9c46a' : 'rgba(53, 162, 235, 0.5)',
      },
    ],
  };

  const dummyBarData = {
    labels: ['Q1', 'Q2', 'Q3', 'Q4'],
    datasets: [
      {
        label: 'Revenue',
        data: [12000, 19000, 15000, 25000],
        backgroundColor:
          theme === 'dark' ? '#e9c46a' : 'rgba(53, 162, 235, 0.5)',
      },
    ],
  };

  const equipmentUsageData = {
    labels: dummyPieData.map((item) => item.status),
    datasets: [
      {
        label: 'Tình trạng thiết bị',
        data: dummyPieData.map((item) => item.count),
        backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56'],
      },
    ],
  };

  const recentActivities = [
    { id: 1, action: 'New sale recorded', time: '2 minutes ago' },
    { id: 2, action: 'Customer feedback received', time: '10 minutes ago' },
    { id: 3, action: 'System update completed', time: '1 hour ago' },
  ];

  const handleDragEnd = (result) => {
    if (!result.destination) return;

    const items = Array.from(widgets);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    setWidgets(items);
  };

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  const handleShare = () => {
    console.log('Sharing dashboard...');
  };

  const renderWidget = (widget) => {
    switch (widget.type) {
      case 'line':
        return (
          <Line data={transformedLineData} options={{ responsive: true }} />
        );
      case 'bar':
        if (widget.id === 'roomUsage') {
          return <Bar data={roomUsageData} options={{ responsive: true }} />;
        }
        if (widget.id === 'userUsage') {
          return <Bar data={userUsageBarData} options={{ responsive: true }} />;
        }
        return <Bar data={dummyBarData} options={{ responsive: true }} />;
      case 'pie':
        return <Pie data={equipmentUsageData} options={{ responsive: true }} />;
      case 'table':
        return (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white rounded-lg">
              <thead>
                <tr>
                  <th className="px-4 py-2">Action</th>
                  <th className="px-4 py-2">Time</th>
                </tr>
              </thead>
              <tbody>
                {recentActivities.map((activity) => (
                  <tr key={activity.id}>
                    <td className="border px-4 py-2">{activity.action}</td>
                    <td className="border px-4 py-2">{activity.time}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div
      className={`${
        theme === 'dark'
          ? 'bg-gray-900 text-white'
          : 'bg-gray-100 text-gray-900'
      } min-h-screen p-4`}
    >
      {error && (
        <div
          className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4"
          role="alert"
        >
          <FiAlertCircle className="inline mr-2" />
          {error}
        </div>
      )}

      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Analytics Dashboard</h1>
        <div className="flex space-x-4">
          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg bg-blue-500 hover:bg-blue-600 text-white"
            aria-label="Toggle theme"
          >
            <FiSettings className="w-5 h-5" />
          </button>
          <button
            onClick={handleShare}
            className="p-2 rounded-lg bg-green-500 hover:bg-green-600 text-white"
            aria-label="Share dashboard"
          >
            <FiShare2 className="w-5 h-5" />
          </button>
        </div>
      </div>

      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="widgets">
          {(provided) => (
            <div
              {...provided.droppableProps}
              ref={provided.innerRef}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {widgets.map((widget, index) => (
                <Draggable
                  key={widget.id}
                  draggableId={widget.id}
                  index={index}
                >
                  {(provided) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      className="bg-white rounded-lg shadow-md p-4"
                    >
                      <h2 className="text-lg font-semibold mb-4">
                        {widget.title}
                      </h2>
                      {renderWidget(widget)}
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  );
};

export default Dashboard;
