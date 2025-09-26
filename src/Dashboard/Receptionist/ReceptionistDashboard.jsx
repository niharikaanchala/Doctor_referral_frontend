import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

const ReceptionistDashboard = () => {
  // Mock data for stat cards
  const stats = [
    //{ title: 'Appointments Today', value: '24', change: '+3', icon: '📅', color: 'blue' },
    { title: 'New Patients', value: '8', change: '+2', icon: '👤', color: 'green' },
    { title: 'Pending Approvals', value: '5', change: '-1', icon: '⏳', color: 'orange' },
    { title: 'Messages', value: '12', change: '+4', icon: '💬', color: 'purple' },
    { title: 'Insurance Claims', value: '7', change: '+1', icon: '📄', color: 'teal' },
    { title: 'Follow-ups', value: '15', change: '+2', icon: '🔄', color: 'indigo' },
  ];

  // Mock data for pie chart - Appointment Types
  const appointmentTypeData = [
    { name: 'Check-up', value: 40, color: '#10B981' },
    { name: 'Consultation', value: 35, color: '#3B82F6' },
    { name: 'Emergency', value: 15, color: '#EF4444' },
    { name: 'Follow-up', value: 10, color: '#F59E0B' },
  ];

  // Mock data for today's appointments
  const todaysAppointments = [
    { id: 1, patient: 'John Smith', doctor: 'Dr. Sarah Wilson', time: '09:00 AM', status: 'Confirmed', type: 'Check-up' },
    { id: 2, patient: 'Maria Garcia', doctor: 'Dr. Robert Kim', time: '10:30 AM', status: 'Confirmed', type: 'Consultation' },
    { id: 3, patient: 'David Johnson', doctor: 'Dr. Emily Chen', time: '11:15 AM', status: 'Pending', type: 'Follow-up' },
    { id: 4, patient: 'Sarah Williams', doctor: 'Dr. Michael Brown', time: '02:00 PM', status: 'Confirmed', type: 'Emergency' },
    { id: 5, patient: 'James Miller', doctor: 'Dr. Lisa Taylor', time: '03:30 PM', status: 'Cancelled', type: 'Check-up' },
  ];

  // Mock data for pending tasks
  const pendingTasks = [
    { id: 1, task: 'Verify insurance for patient #1234', priority: 'High', due: 'Today' },
    { id: 2, task: 'Schedule follow-up for Maria Garcia', priority: 'Medium', due: 'Tomorrow' },
    { id: 3, task: 'Update patient records', priority: 'Low', due: 'This week' },
    { id: 4, task: 'Order medical supplies', priority: 'Medium', due: 'Tomorrow' },
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'Confirmed': return 'bg-green-100 text-green-800';
      case 'Pending': return 'bg-yellow-100 text-yellow-800';
      case 'Cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'High': return 'bg-red-100 text-red-800';
      case 'Medium': return 'bg-yellow-100 text-yellow-800';
      case 'Low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-300 p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
                <p className={`text-sm ${stat.change.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>
                  {stat.change} from yesterday
                </p>
              </div>
              <div className={`p-3 rounded-full ${
                stat.color === 'blue' ? 'bg-blue-100' : 
                stat.color === 'green' ? 'bg-green-100' : 
                stat.color === 'orange' ? 'bg-orange-100' :
                stat.color === 'purple' ? 'bg-purple-100' :
                stat.color === 'teal' ? 'bg-teal-100' :
                'bg-indigo-100'
              }`}>
                <span className="text-2xl">{stat.icon}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Charts and Today's Appointments */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Pie Chart Card - Appointment Types */}
        <div className="lg:col-span-1 bg-white rounded-lg border border-gray-200 shadow-sm p-6">
          <div className="border-b border-gray-200 pb-4 mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Appointment Types</h3>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={appointmentTypeData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={5}
                dataKey="value"
              >
                {appointmentTypeData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Today's Appointments Card */}
        <div className="lg:col-span-2 bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-gray-200 px-6 py-4">
            <h3 className="text-lg font-semibold text-gray-900">Today's Appointments(15)</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-gray-600">
              <thead className="bg-gray-50 text-gray-700">
                <tr>
                  <th scope="col" className="px-6 py-3 font-medium">Patient</th>
                  <th scope="col" className="px-6 py-3 font-medium">Doctor</th>
                  <th scope="col" className="px-6 py-3 font-medium">Time</th>
                  <th scope="col" className="px-6 py-3 font-medium">Type</th>
                  <th scope="col" className="px-6 py-3 font-medium">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {todaysAppointments.map((appointment) => (
                  <tr 
                    key={appointment.id} 
                    className="hover:bg-blue-50 cursor-pointer transition-colors"
                  >
                    <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">
                      {appointment.patient}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-900">
                      {appointment.doctor}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-900">
                      {appointment.time}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800">
                        {appointment.type}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(appointment.status)}`}>
                        {appointment.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Pending Tasks and Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Pending Tasks Card */}
        <div className="lg:col-span-1 bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
          <div className="bg-gradient-to-r from-orange-50 to-red-50 border-b border-gray-200 px-6 py-4">
            <h3 className="text-lg font-semibold text-gray-900">Pending Tasks</h3>
          </div>
          <div className="p-4">
            <div className="space-y-4">
              {pendingTasks.map((task) => (
                <div key={task.id} className="p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="flex justify-between items-start mb-2">
                    <span className="font-medium text-gray-900">{task.task}</span>
                    <span className={`px-2 py-1 text-xs rounded-full ${getPriorityColor(task.priority)}`}>
                      {task.priority}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-sm text-gray-600">
                    <span>Due: {task.due}</span>
                    <button className="text-blue-600 hover:text-blue-800 text-xs font-medium">
                      Mark Complete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Quick Actions Section */}
        <div className="lg:col-span-2 bg-white rounded-lg border border-gray-200 shadow-sm">
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-gray-200 px-6 py-4">
            <h3 className="text-lg font-semibold text-gray-900">Quick Actions</h3>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <button className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <span className="text-blue-600">📅</span>
                </div>
                <div className="text-left">
                  <div className="font-medium text-gray-900">Schedule Appointment</div>
                  <div className="text-sm text-gray-600">Book new appointment</div>
                </div>
              </button>
              
              <button className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                <div className="p-2 bg-green-100 rounded-lg">
                  <span className="text-green-600">👤</span>
                </div>
                <div className="text-left">
                  <div className="font-medium text-gray-900">Register Patient</div>
                  <div className="text-sm text-gray-600">New patient registration</div>
                </div>
              </button>
              
              <button className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <span className="text-purple-600">💬</span>
                </div>
                <div className="text-left">
                  <div className="font-medium text-gray-900">Send Message</div>
                  <div className="text-sm text-gray-600">Contact patient/doctor</div>
                </div>
              </button>
              
              <button className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                <div className="p-2 bg-teal-100 rounded-lg">
                  <span className="text-teal-600">📄</span>
                </div>
                <div className="text-left">
                  <div className="font-medium text-gray-900">Process Insurance</div>
                  <div className="text-sm text-gray-600">Insurance claims</div>
                </div>
              </button>

              <button className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                <div className="p-2 bg-orange-100 rounded-lg">
                  <span className="text-orange-600">💰</span>
                </div>
                <div className="text-left">
                  <div className="font-medium text-gray-900">Billing</div>
                  <div className="text-sm text-gray-600">Payment processing</div>
                </div>
              </button>

              <button className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                <div className="p-2 bg-indigo-100 rounded-lg">
                  <span className="text-indigo-600">📊</span>
                </div>
                <div className="text-left">
                  <div className="font-medium text-gray-900">Reports</div>
                  <div className="text-sm text-gray-600">View daily reports</div>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReceptionistDashboard;