'use client';

import React, { useEffect, useState } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { Line, Bar, Pie } from 'react-chartjs-2';
import { FiAlertCircle } from 'react-icons/fi';
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
import { newRequest } from '@/lib/newRequest';
import { Bug, Hammer, School, User } from 'lucide-react';
import { useAppSelector } from '@/lib/redux/hooks';

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
  const token = useAppSelector((state: any) => state.auth.token);

  const [widgets, setWidgets] = useState([
    { id: 'reports', type: 'line', title: 'Số lượng báo cáo của các phòng' },
    { id: 'roomUsage', type: 'bar', title: 'Tần suất phòng được sử dụng' },
    { id: 'distribution', type: 'pie', title: 'Trạng thái thiết bị' },
    { id: 'userUsage', type: 'bar', title: 'Tần suất người sử dụng' },
  ]);

  const [theme, setTheme] = useState('light');
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  
  const [dummyData, setDummyData] = useState([]);
  const [countScheduleRoom, setCountScheduleRoom] = useState([]);
  const [countScheduleUser, setCountScheduleUser] = useState([]);
  const [countStatus, setCountStatus] = useState([]);
  
  const [countRoom, setCountRoom] = useState(0);
  const [countReport, setCountReport] = useState(0);
  const [countUser, setCountUser] = useState(0);
  const [countEquipment, setCountEquipment] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const headers = {
          Authorization: `Bearer ${token}`
        };

        const [
          reportCountRoom,
          scheduleRoom,
          scheduleUser,
          statusCount,
          userCount,
          roomCount,
          reportCount,
          equipmentCount
        ] = await Promise.all([
          newRequest.get('/api/v1/report/getCountReportOfRoom', { headers }),
          newRequest.get('/api/v1/schedule/countScheduleRoom', { headers }),
          newRequest.get('/api/v1/schedule/countScheduleUser', { headers }),
          newRequest.get('/api/v1/equipment/equipmentstatus', { headers }),
          newRequest.get('/api/v1/user/getcountuser', { headers }),
          newRequest.get('/api/v1/room/getcountroom', { headers }),
          newRequest.get('/api/v1/report/getCountReport', { headers }),
          newRequest.get('/api/v1/equipment/getCountEquipment', { headers })
        ]);

        setDummyData(reportCountRoom.data.data || []);
        setCountScheduleRoom(scheduleRoom.data.data || []);
        setCountScheduleUser(scheduleUser.data.data || []);
        setCountStatus(statusCount.data.data || []);
        setCountUser(userCount.data.data || 0);
        setCountRoom(roomCount.data.data || 0);
        setCountReport(reportCount.data.data || 0);
        setCountEquipment(equipmentCount.data.data || 0);

      } catch (err: any) {
        setError(err.response?.data?.message || 'An error occurred while fetching data');
      } finally {
        setIsLoading(false);
      }
    };

    if (token) {
      fetchData();
    }
  }, [token]);

  const userUsageBarData = {
    labels: countScheduleUser.map((item: any) => item.name),
    datasets: [
      {
        label: 'Tần suất người sử dụng',
        data: countScheduleUser.map((item: any) => item.count),
        backgroundColor: theme === 'dark' ? '#e9c46a' : 'rgba(53, 162, 235, 0.5)',
      },
    ],
  };

  const transformedLineData = {
    labels: dummyData.map((item: any) => item.room),
    datasets: [
      {
        label: 'Số lượng báo cáo 2023',
        data: dummyData.map((item: any) => item.count),
        borderColor: theme === 'dark' ? '#f4a261' : 'rgb(75, 192, 192)',
        backgroundColor: theme === 'dark' ? 'rgba(244, 162, 97, 0.3)' : 'rgba(75, 192, 192, 0.3)',
        tension: 0.1,
      },
    ],
  };

  const roomUsageData = {
    labels: countScheduleRoom.map((item: any) => item.room),
    datasets: [
      {
        label: 'Tần suất phòng được sử dụng',
        data: countScheduleRoom.map((item: any) => item.count),
        backgroundColor: theme === 'dark' ? '#e9c46a' : 'rgba(53, 162, 235, 0.5)',
      },
    ],
  };

  const equipmentUsageData = {
    labels: countStatus.map((item: any) => item.status),
    datasets: [
      {
        label: 'Tình trạng thiết bị',
        data: countStatus.map((item: any) => item.count),
        backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56'],
      },
    ],
  };

  const dummyMetrics = [
    { title: 'Total Room', value: countRoom, icon: <School /> },
    { title: 'Active Users', value: countUser, icon: <User /> },
    { title: 'Total Report', value: countReport, icon: <Bug /> },
    { title: 'Total Equipment', value: countEquipment, icon: <Hammer /> },
  ];

  const handleDragEnd = (result: any) => {
    if (!result.destination) return;

    const items = Array.from(widgets);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    setWidgets(items);
  };

  const pieOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      tooltip: {
        enabled: true,
      },
    },
    maintainAspectRatio: false,
  };

  const renderWidget = (widget: any) => {
    if (isLoading) {
      return <div className="animate-pulse h-64 bg-gray-200 dark:bg-gray-700 rounded"></div>;
    }

    switch (widget.type) {
      case 'line':
        return <Line data={transformedLineData} options={{ responsive: true }} />;
      case 'bar':
        if (widget.id === 'roomUsage') {
          return <Bar data={roomUsageData} options={{ responsive: true }} />;
        }
        if (widget.id === 'userUsage') {
          return <Bar data={userUsageBarData} options={{ responsive: true }} />;
        }
        return null;
      case 'pie':
        return (
          <div className="flex mt-10 h-80 w-full">
            <Pie data={equipmentUsageData} options={pieOptions} />
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div>
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
          <FiAlertCircle className="inline mr-2" />
          {error}
        </div>
      )}

      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-gray-800 dark:text-white">
          Analytics Dashboard
        </h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        {dummyMetrics.map((metric, index) => (
          <div
            key={index}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 flex items-center justify-between"
          >
            <div>
              <h3 className="text-gray-500 dark:text-gray-400 text-sm font-medium">
                {metric.title}
              </h3>
              <p className="text-2xl font-semibold mt-1">
                {isLoading ? (
                  <div className="animate-pulse h-8 w-16 bg-gray-200 dark:bg-gray-700 rounded"></div>
                ) : (
                  metric.value
                )}
              </p>
            </div>
            <div className="text-purple-500 text-2xl">{metric.icon}</div>
          </div>
        ))}
      </div>

      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="widgets">
          {(provided) => (
            <div
              {...provided.droppableProps}
              ref={provided.innerRef}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6"
            >
              {widgets.map((widget, index) => (
                <Draggable key={widget.id} draggableId={widget.id} index={index}>
                  {(provided) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 transition-all duration-200"
                    >
                      <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
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