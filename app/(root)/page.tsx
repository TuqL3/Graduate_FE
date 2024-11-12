'use client';

import React, { useEffect, useState } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { Line, Bar, Pie } from 'react-chartjs-2';
import {
  FiSettings,
  FiShare2,
  FiAlertCircle,
  FiBarChart2,
  FiPieChart,
  FiTrendingUp,
  FiUser,
} from 'react-icons/fi';
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
    { id: 'distribution', type: 'pie', title: 'Trạng thái thiết bị' },
    { id: 'userUsage', type: 'bar', title: 'Tần suất người sử dụng' },
  ]);

  const [theme, setTheme] = useState('light');
  const [error, setError] = useState(null);
  const [dummyData, setDummyData] = useState([
    { room: 'phong 1', count: 1 },
    { room: 'phong 2', count: 2 },
    { room: 'phong 3', count: 3 },
  ]);
  const [countScheduleRoom, setCountScheduleRoom] = useState([
    { room: 'phong 1', count: 1 },
    { room: 'phong 2', count: 3 },
    { room: 'phong 3', count: 2 },
  ]);
  const [countScheduleUser, setCountScheduleUser] = useState([
    { name: 'Nguyễn Văn A', count: 3 },
    { name: 'Trần Thị B', count: 5 },
    { name: 'Lê Văn C', count: 2 },
    { name: 'Phạm Thị D', count: 7 },
    { name: 'Ngô Văn E', count: 4 },
  ]);
  const [countStatus, setCountStatus] = useState([
    { status: 'Broken', count: 30 },
    { status: 'Working', count: 40 },
    { status: 'Maintain', count: 30 },
  ]);

  const [countRoom, setCountRoom] = useState()
  const [countReport, setCountReport] = useState()
  const [countUser, setCountUser] = useState()
  const [countEquipment, setCountEquipment] = useState()

  const dummyMetrics = [
    { title: 'Total Room', value: countRoom, icon: <FiTrendingUp /> },
    { title: 'Active Users', value: countUser, icon: <FiUser /> },
    { title: 'Total Report', value: countReport, icon: <FiBarChart2 /> },
    { title: 'Total Equipment', value: countEquipment, icon: <FiPieChart /> },
  ];

  useEffect(() => {
    const getReportCountRoom = async () => {
      const res = await newRequest.get('/api/v1/report/getCountReportOfRoom');
      setDummyData(res.data.data);
    };

    const getCountScheduleOfRoom = async () => {
      const res = await newRequest.get('/api/v1/schedule/countScheduleRoom');
      setCountScheduleRoom(res.data.data);
    };

    const getCountScheduleOfUser = async () => {
      const res = await newRequest.get('/api/v1/schedule/countScheduleUser');
      setCountScheduleUser(res.data.data);
    };

    const getCountStatus = async () => {
      const res = await newRequest.get('/api/v1/equipment/equipmentstatus');
      setCountStatus(res.data.data);
    };

    const getCountUser = async () => {
      const res = await newRequest.get("/api/v1/user/getcountuser")
      setCountUser(res.data.data)
    }

    const getCountRoom = async () => {
      const res = await newRequest.get("/api/v1/room/getcountroom")
      setCountRoom(res.data.data)
    }
    const getCountReport = async () => {
      const res = await newRequest.get("/api/v1/report/getCountReport")
      setCountReport(res.data.data)
    }
    const getCountEquipment = async () => {
      const res = await newRequest.get("/api/v1/equipment/getCountEquipment")
      setCountEquipment(res.data.data)
    }
    getCountUser()
    getCountReport()
    getCountRoom()
    getCountEquipment()
    getCountStatus();
    getReportCountRoom();
    getCountScheduleOfUser();
    getCountScheduleOfRoom();
  }, []);

  const userUsageBarData = {
    labels: countScheduleUser?.map((item: any) => item.name),
    datasets: [
      {
        label: 'Tần suất người sử dụng',
        data: countScheduleUser?.map((item: any) => item.count),
        backgroundColor:
          theme === 'dark' ? '#e9c46a' : 'rgba(53, 162, 235, 0.5)',
      },
    ],
  };

  const transformedLineData = {
    labels: dummyData?.map((item) => item.room),
    datasets: [
      {
        label: 'Số lượng báo cáo 2023',
        data: dummyData?.map((item) => item.count),
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
    labels: countScheduleRoom?.map((item) => item.room),
    datasets: [
      {
        label: 'Tần suất phòng được sử dụng',
        data: countScheduleRoom?.map((item) => item.count),
        backgroundColor:
          theme === 'dark' ? '#e9c46a' : 'rgba(53, 162, 235, 0.5)',
      },
    ],
  };

  const equipmentUsageData = {
    labels: countStatus?.map((item: any) => item.status),
    datasets: [
      {
        label: 'Tình trạng thiết bị',
        data: countStatus?.map((item: any) => item.count),
        backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56'],
      },
    ],
  };

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
        position: 'top',
      },
      tooltip: {
        enabled: true,
      },
    },
    maintainAspectRatio: false,
  };
  const renderWidget = (widget: any) => {
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
      // return <Bar data={dummyBarData} options={{ responsive: true }} />;
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
              <p className="text-2xl font-semibold mt-1">{metric.value}</p>
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
