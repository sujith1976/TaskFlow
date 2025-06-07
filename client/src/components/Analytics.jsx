import React from 'react';
import { Bar, Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const Analytics = ({ tasks }) => {
  // Group tasks by status
  const tasksByStatus = {
    todo: tasks.filter(task => task.status === 'todo').length,
    inProgress: tasks.filter(task => task.status === 'in-progress').length,
    completed: tasks.filter(task => task.status === 'completed').length,
  };

  // Group tasks by priority
  const tasksByPriority = {
    high: tasks.filter(task => task.priority === 'high').length,
    medium: tasks.filter(task => task.priority === 'medium').length,
    low: tasks.filter(task => task.priority === 'low').length,
  };

  const barChartData = {
    labels: ['To Do', 'In Progress', 'Completed'],
    datasets: [
      {
        label: 'Tasks by Status',
        data: [tasksByStatus.todo, tasksByStatus.inProgress, tasksByStatus.completed],
        backgroundColor: ['#ff6b6b', '#339af0', '#51cf66'],
      },
    ],
  };

  const pieChartData = {
    labels: ['High', 'Medium', 'Low'],
    datasets: [
      {
        data: [tasksByPriority.high, tasksByPriority.medium, tasksByPriority.low],
        backgroundColor: ['#ff6b6b', '#ffd43b', '#51cf66'],
      },
    ],
  };

  const barOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Task Status Distribution',
      },
    },
  };

  const pieOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Task Priority Distribution',
      },
    },
  };

  return (
    <div className="analytics-container">
      <h2>Task Analytics</h2>
      <div className="charts-grid">
        <div className="chart-box">
          <Bar data={barChartData} options={barOptions} />
        </div>
        <div className="chart-box">
          <Pie data={pieChartData} options={pieOptions} />
        </div>
      </div>
    </div>
  );
};

export default Analytics;
