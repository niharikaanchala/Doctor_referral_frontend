import React, { useMemo } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

const isOnDay = (value, dayStart) => {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return false;
  const nextDay = new Date(dayStart);
  nextDay.setDate(nextDay.getDate() + 1);
  return date >= dayStart && date < nextDay;
};

const DoctorDashboard = ({ appointments = [] }) => {
  const { totalAppointments, appointmentsYesterday, totalPatients, patientsYesterday } = useMemo(() => {
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);
    const startOfYesterday = new Date(startOfToday);
    startOfYesterday.setDate(startOfYesterday.getDate() - 1);

    const firstSeen = new Map();
    appointments.forEach((item) => {
      if (item.status === 'cancelled') return;
      const patientId = item.user?._id;
      if (!patientId) return;
      const created = new Date(item.createdAt || 0).getTime();
      const current = firstSeen.get(String(patientId));
      if (current === undefined || created < current) {
        firstSeen.set(String(patientId), created);
      }
    });

    return {
      totalAppointments: appointments.length,
      appointmentsYesterday: appointments.filter((item) => isOnDay(item.createdAt, startOfYesterday)).length,
      totalPatients: firstSeen.size,
      patientsYesterday: [...firstSeen.values()].filter((time) => isOnDay(time, startOfYesterday)).length,
    };
  }, [appointments]);

  const stats = [
    { title: 'Referrals Sent', value: '8', change: '+1', icon: '👥', color: 'green' },
    { title: 'Referrals Received', value: '10', change: '+1', icon: '👥', color: 'green' },
    { title: 'Total Appointments', value: String(totalAppointments), change: `+${appointmentsYesterday}`, icon: '📅', color: 'blue' },
    { title: 'Total Patients', value: String(totalPatients), change: `+${patientsYesterday}`, icon: '👤', color: 'purple' },
  ];

  // Mock data for pie chart
  const appointmentData = [
    { name: 'Completed', value: 45, color: '#10B981' },
    { name: 'Pending', value: 30, color: '#3B82F6' },
    { name: 'Cancelled', value: 25, color: '#EF4444' },
  ];
  const appointmentTypeData = [
    { name: 'Check-up', value: 40, color: '#10B981' },
    { name: 'Consultation', value: 35, color: '#3B82F6' },
    { name: 'Emergency', value: 15, color: '#EF4444' },
    { name: 'Follow-up', value: 10, color: '#F59E0B' },
  ];
  // Mock data for recent patients
  const recentPatients = [
    { id: 1, name: 'John Smith', condition: 'Hypertension', lastVisit: '2024-01-15', nextAppointment: '2024-02-01' },
    { id: 2, name: 'Maria Garcia', condition: 'Diabetes', lastVisit: '2024-01-14', nextAppointment: '2024-02-05' },
    { id: 3, name: 'Robert Johnson', condition: 'Asthma', lastVisit: '2024-01-13', nextAppointment: '2024-01-28' },
    { id: 4, name: 'Sarah Wilson', condition: 'Arthritis', lastVisit: '2024-01-12', nextAppointment: '2024-02-10' },
  ];

  return (
    <div className="space-y-6">
      {/* Stats Cards - Updated to keep all cards in one line */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-300 p-6"
          >
            <div className="flex items-center justify-between">
              <div >
                <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
                <p className={`text-sm ${stat.change.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>
                  {stat.change} from yesterday
                </p>
              </div>
              <div className={`p-3 rounded-full ${
                stat.color === 'blue' ? 'bg-blue-100' : 
                stat.color === 'green' ? 'bg-green-100' : 
                stat.color === 'purple' ? 'bg-purple-100' :
                stat.color === 'orange' ? 'bg-orange-100' :
                'bg-teal-100'
              }`}>
                <span className="text-2xl">{stat.icon}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Charts and Recent Patients - Updated styling */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Pie Chart Card */}
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
       

        {/* Recent Patients Card */}
        <div className="lg:col-span-2 bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-gray-200 px-6 py-4">
            <h3 className="text-lg font-semibold text-gray-900">Appointments Today (8)</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-gray-600">
              <thead className="bg-gray-50 text-gray-700">
                <tr>
                  <th scope="col" className="px-6 py-3 font-medium">Patient</th>
                  <th scope="col" className="px-6 py-3 font-medium">Condition</th>
                  <th scope="col" className="px-6 py-3 font-medium">Last Visit</th>
                  <th scope="col" className="px-6 py-3 font-medium">Next Appointment</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {recentPatients.map((patient) => (
                  <tr 
                    key={patient.id} 
                    className="hover:bg-blue-50 cursor-pointer transition-colors"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                          <span className="text-sm font-medium text-blue-600">
                            {patient.name.split(' ').map(n => n[0]).join('')}
                          </span>
                        </div>
                        <div className="ml-3">
                          <div className="font-medium text-gray-900">{patient.name}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800">
                        {patient.condition}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-900">
                      {patient.lastVisit}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">
                        {patient.nextAppointment}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Quick Actions Section */}
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-gray-200 px-6 py-4">
          <h3 className="text-lg font-semibold text-gray-900">Quick Actions</h3>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
              <div className="p-2 bg-blue-100 rounded-lg">
                <span className="text-blue-600">📅</span>
              </div>
              <div className="text-left">
                <div className="font-medium text-gray-900">Schedule Appointment</div>
                <div className="text-sm text-gray-600">Create new booking</div>
              </div>
            </button>
            
            <button className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
              <div className="p-2 bg-green-100 rounded-lg">
                <span className="text-green-600">👥</span>
              </div>
              <div className="text-left">
                <div className="font-medium text-gray-900">Send Referral</div>
                <div className="text-sm text-gray-600">Refer a patient</div>
              </div>
            </button>
            
            <button className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
              <div className="p-2 bg-purple-100 rounded-lg">
                <span className="text-purple-600">📊</span>
              </div>
              <div className="text-left">
                <div className="font-medium text-gray-900">View Reports</div>
                <div className="text-sm text-gray-600">Analytics & insights</div>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorDashboard;
