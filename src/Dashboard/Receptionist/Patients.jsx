import React, { useState } from 'react';

const PatientsPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showAddPatientModal, setShowAddPatientModal] = useState(false);
  const [showEditPatientModal, setShowEditPatientModal] = useState(false);
  const [patientReports, setPatientReports] = useState({});
  const [showMessageModal, setShowMessageModal] = useState(false);
  const [messageContent, setMessageContent] = useState('');
  const [messageRecipient, setMessageRecipient] = useState('');
  const [showAppointmentModal, setShowAppointmentModal] = useState(false);
  const [appointmentData, setAppointmentData] = useState({
    date: '',
    time: '',
    doctor: '',
    reason: ''
  });

  const [patients, setPatients] = useState([
    {
      id: 1,
      name: 'John Smith',
      email: 'john.smith@email.com',
      phone: 1234567890,
      photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
      age: 45,
      gender: 'male',
      bloodType: 'A+',
      role: 'patient',
      bp: { value: '140/90', known: true },
      diabetic: { value: 'no', known: true },
      hyperthyroidism: { value: 'no', known: true },
      appointments: [
        { id: 'app1', date: '2024-01-15', doctor: 'Dr. Johnson', status: 'completed' },
        { id: 'app2', date: '2024-02-01', doctor: 'Dr. Johnson', status: 'scheduled' }
      ],
      lastAppointment: '2024-01-15',
      nextAppointment: '2024-02-01',
      status: 'Active',
      condition: 'Hypertension',
      address: '123 Main St, City, State 12345',
      emergencyContact: { name: 'Jane Smith', phone: 1234567891, relation: 'Spouse' }
    },
    {
      id: 2,
      name: 'Maria Garcia',
      email: 'maria.garcia@email.com',
      phone: 2345678901,
      photo: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
      age: 32,
      gender: 'female',
      bloodType: 'O-',
      role: 'patient',
      bp: { value: '110/70', known: true },
      diabetic: { value: 'yes', known: true },
      hyperthyroidism: { value: 'no', known: true },
      appointments: [
        { id: 'app3', date: '2024-02-05', doctor: 'Dr. Wilson', status: 'scheduled' }
      ],
      lastAppointment: '2024-01-14',
      nextAppointment: '2024-02-05',
      status: 'Active',
      condition: 'Diabetes',
      address: '456 Oak Ave, City, State 12345',
      emergencyContact: { name: 'Carlos Garcia', phone: 2345678902, relation: 'Husband' }
    },
    {
      id: 3,
      name: 'Robert Johnson',
      email: 'robert.j@email.com',
      phone: 3456789012,
      photo: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
      age: 58,
      gender: 'male',
      bloodType: 'B+',
      role: 'patient',
      bp: { value: '', known: false },
      diabetic: { value: 'yes', known: true },
      hyperthyroidism: { value: 'yes', known: true },
      appointments: [
        { id: 'app4', date: '2024-01-13', doctor: 'Dr. Brown', status: 'completed' },
        { id: 'app5', date: '2024-01-28', doctor: 'Dr. Brown', status: 'scheduled' }
      ],
      lastAppointment: '2024-01-13',
      nextAppointment: '2024-01-28',
      status: 'Follow-up',
      condition: 'Asthma',
      address: '789 Pine Rd, City, State 12345',
      emergencyContact: { name: 'Lisa Johnson', phone: 3456789013, relation: 'Wife' }
    },
    {
      id: 4,
      name: 'Sarah Wilson',
      email: 'sarah.wilson@email.com',
      phone: 4567890123,
      photo: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
      age: 67,
      gender: 'female',
      bloodType: 'AB+',
      role: 'patient',
      bp: { value: '120/80', known: true },
      diabetic: { value: 'no', known: true },
      hyperthyroidism: { value: 'no', known: true },
      appointments: [
        { id: 'app7', date: '2024-02-10', doctor: 'Dr. Davis', status: 'scheduled' }
      ],
      lastAppointment: '2024-01-12',
      nextAppointment: '2024-02-10',
      status: 'Active',
      condition: 'Arthritis',
      address: '321 Elm St, City, State 12345',
      emergencyContact: { name: 'Tom Wilson', phone: 4567890124, relation: 'Husband' }
    },
    {
      id: 5,
      name: 'Michael Brown',
      email: 'michael.b@email.com',
      phone: 5678901234,
      photo: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face',
      age: 29,
      gender: 'male',
      bloodType: 'A-',
      role: 'patient',
      bp: { value: '', known: false },
      diabetic: { value: '', known: false },
      hyperthyroidism: { value: '', known: false },
      appointments: [
        { id: 'app8', date: '2024-02-15', doctor: 'Dr. Miller', status: 'scheduled' }
      ],
      lastAppointment: '2024-01-10',
      nextAppointment: '2024-02-15',
      status: 'New',
      condition: 'Migraine',
      address: '654 Birch Ln, City, State 12345',
      emergencyContact: { name: 'Amy Brown', phone: 5678901235, relation: 'Sister' }
    }
  ]);

  // Filter patients based on search and status
  const filteredPatients = patients.filter(patient => {
    const matchesSearch = patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         patient.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         patient.condition.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || patient.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status) => {
    const statusConfig = {
      'Active': { color: 'bg-green-100 text-green-800', icon: '✅' },
      'Follow-up': { color: 'bg-blue-100 text-blue-800', icon: '🔄' },
      'New': { color: 'bg-purple-100 text-purple-800', icon: '🆕' }
    };
    
    const config = statusConfig[status] || statusConfig.Active;
    return (
      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${config.color}`}>
        <span className="mr-1">{config.icon}</span>
        {status}
      </span>
    );
  };

  const getGenderIcon = (gender) => {
    const icons = {
      male: '👨',
      female: '👩',
      other: '🧑'
    };
    return icons[gender] || '🧑';
  };

  const handleViewDetails = (patient) => {
    setSelectedPatient(patient);
    setShowDetailsModal(true);
  };

  const handleEdit = (patientId) => {
    const patient = patients.find(p => p.id === patientId);
    setSelectedPatient(patient);
    setShowEditPatientModal(true);
  };

  const handleDelete = (patientId) => {
    if (window.confirm('Are you sure you want to delete this patient record?')) {
      setPatients(prev => prev.filter(patient => patient.id !== patientId));
    }
  };

  const handleMessage = (patientId) => {
    const patient = patients.find(p => p.id === patientId);
    setSelectedPatient(patient);
    setMessageRecipient(`Dr. Smith (${patient.name}'s Doctor)`);
    setMessageContent('');
    setShowMessageModal(true);
  };

  const handleAddAppointment = (patientId) => {
    const patient = patients.find(p => p.id === patientId);
    setSelectedPatient(patient);
    setAppointmentData({
      date: '',
      time: '',
      doctor: '',
      reason: ''
    });
    setShowAppointmentModal(true);
  };

  const handleFileUpload = (patientId, files) => {
    setPatientReports(prev => ({
      ...prev,
      [patientId]: [...(prev[patientId] || []), ...Array.from(files).map(file => ({
        id: Date.now() + Math.random(),
        name: file.name,
        type: file.type,
        size: file.size,
        uploadDate: new Date().toLocaleDateString(),
        file: file
      }))]
    }));
  };

  const handleAddPatient = (newPatientData) => {
    const newPatient = {
      id: Math.max(...patients.map(p => p.id)) + 1,
      ...newPatientData,
      appointments: [],
      lastAppointment: '',
      nextAppointment: '',
      status: 'New',
      address: '',
      emergencyContact: { name: '', phone: '', relation: '' }
    };
    setPatients(prev => [...prev, newPatient]);
    setShowAddPatientModal(false);
  };

  const handleUpdatePatient = (updatedPatientData) => {
    setPatients(prev => prev.map(patient => 
      patient.id === updatedPatientData.id ? updatedPatientData : patient
    ));
    setShowEditPatientModal(false);
  };

  const handleSendMessage = () => {
    if (messageContent.trim() === '') {
      alert('Please enter a message');
      return;
    }

    console.log('Message sent to doctor:', {
      recipient: messageRecipient,
      patient: selectedPatient?.name,
      message: messageContent,
      timestamp: new Date().toISOString()
    });

    alert('Message sent successfully to the doctor!');
    setMessageContent('');
    setShowMessageModal(false);
  };

  const handleScheduleAppointment = () => {
    if (!appointmentData.date || !appointmentData.time || !appointmentData.doctor) {
      alert('Please fill in all required appointment details');
      return;
    }

    const newAppointment = {
      id: `app${Date.now()}`,
      date: appointmentData.date,
      time: appointmentData.time,
      doctor: appointmentData.doctor,
      reason: appointmentData.reason,
      status: 'scheduled'
    };

    setPatients(prev => prev.map(patient => {
      if (patient.id === selectedPatient.id) {
        const updatedAppointments = [...patient.appointments, newAppointment];
        return {
          ...patient,
          appointments: updatedAppointments,
          lastAppointment: patient.appointments.length > 0 ? patient.appointments[patient.appointments.length - 1].date : '',
          nextAppointment: appointmentData.date
        };
      }
      return patient;
    }));

    alert('Appointment scheduled successfully!');
    setShowAppointmentModal(false);
  };

  // Appointment Modal Component
  const AppointmentModal = ({ onClose, onSchedule }) => {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-xl shadow-xl max-w-md w-full">
          <div className="p-6 border-b">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">Schedule Appointment</h2>
              <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg">
                <span className="text-2xl">×</span>
              </button>
            </div>
          </div>

          <div className="p-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Patient
              </label>
              <input
                type="text"
                value={selectedPatient?.name || ''}
                disabled
                className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-100 text-gray-600"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Date *
              </label>
              <input
                type="date"
                value={appointmentData.date}
                onChange={(e) => setAppointmentData(prev => ({ ...prev, date: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Time *
              </label>
              <input
                type="time"
                value={appointmentData.time}
                onChange={(e) => setAppointmentData(prev => ({ ...prev, time: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Doctor *
              </label>
              <select
                value={appointmentData.doctor}
                onChange={(e) => setAppointmentData(prev => ({ ...prev, doctor: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="">Select Doctor</option>
                <option value="Dr. Johnson">Dr. Johnson</option>
                <option value="Dr. Wilson">Dr. Wilson</option>
                <option value="Dr. Brown">Dr. Brown</option>
                <option value="Dr. Davis">Dr. Davis</option>
                <option value="Dr. Miller">Dr. Miller</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Reason for Visit
              </label>
              <textarea
                value={appointmentData.reason}
                onChange={(e) => setAppointmentData(prev => ({ ...prev, reason: e.target.value }))}
                rows="3"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Brief reason for the appointment..."
              />
            </div>
          </div>

          <div className="p-6 border-t flex space-x-4">
            <button
              onClick={onSchedule}
              className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
            >
              Schedule Appointment
            </button>
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    );
  };

  // Message Modal Component
  const MessageModal = ({ onClose, onSend }) => {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-xl shadow-xl max-w-md w-full">
          <div className="p-6 border-b">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">Send Message to Doctor</h2>
              <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg">
                <span className="text-2xl">×</span>
              </button>
            </div>
          </div>

          <div className="p-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Recipient (Doctor)
              </label>
              <input
                type="text"
                value={messageRecipient}
                onChange={(e) => setMessageRecipient(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter doctor's name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Patient
              </label>
              <input
                type="text"
                value={selectedPatient?.name || ''}
                disabled
                className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-100 text-gray-600"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Message
              </label>
              <textarea
                value={messageContent}
                onChange={(e) => setMessageContent(e.target.value)}
                rows="6"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Write your message to the doctor regarding this patient..."
              />
            </div>
          </div>

          <div className="p-6 border-t flex space-x-4">
            <button
              onClick={onSend}
              className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
            >
              Send Message
            </button>
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    );
  };

  // Edit Patient Modal Component
  const EditPatientModal = ({ patient, onClose, onUpdate }) => {
    const [formData, setFormData] = useState(patient || {
      name: '',
      email: '',
      phone: '',
      photo: '',
      age: '',
      gender: 'male',
      bloodType: 'A+',
      bp: { value: '', known: false },
      diabetic: { value: '', known: false },
      hyperthyroidism: { value: '', known: false },
      condition: '',
      address: '',
      emergencyContact: { name: '', phone: '', relation: '' }
    });

    const [reports, setReports] = useState([]);

    const handleInputChange = (e) => {
      const { name, value } = e.target;
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    };

    const handleEmergencyContactChange = (field, value) => {
      setFormData(prev => ({
        ...prev,
        emergencyContact: {
          ...prev.emergencyContact,
          [field]: value
        }
      }));
    };

    const handleMedicalInfoChange = (field, value, known = true) => {
      setFormData(prev => ({
        ...prev,
        [field]: { value, known: value !== '' }
      }));
    };

    const handleFileChange = (e) => {
      setReports(Array.from(e.target.files));
    };

    const handleSubmit = (e) => {
      e.preventDefault();
      onUpdate(formData);
      if (reports.length > 0) {
        handleFileUpload(patient.id, reports);
      }
    };

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          <div className="p-6 border-b sticky top-0 bg-white">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">Edit Patient</h2>
              <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg">
                <span className="text-2xl">×</span>
              </button>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Age</label>
                <input
                  type="number"
                  name="age"
                  value={formData.age}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Gender</label>
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Blood Type</label>
                <select
                  name="bloodType"
                  value={formData.bloodType}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="A+">A+</option>
                  <option value="A-">A-</option>
                  <option value="B+">B+</option>
                  <option value="B-">B-</option>
                  <option value="AB+">AB+</option>
                  <option value="AB-">AB-</option>
                  <option value="O+">O+</option>
                  <option value="O-">O-</option>
                </select>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Full address"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Emergency Contact Name</label>
                <input
                  type="text"
                  value={formData.emergencyContact.name}
                  onChange={(e) => handleEmergencyContactChange('name', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Emergency Contact Phone</label>
                <input
                  type="tel"
                  value={formData.emergencyContact.phone}
                  onChange={(e) => handleEmergencyContactChange('phone', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Emergency Contact Relation</label>
                <input
                  type="text"
                  value={formData.emergencyContact.relation}
                  onChange={(e) => handleEmergencyContactChange('relation', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Spouse, Parent, etc."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Blood Pressure</label>
                <input
                  type="text"
                  placeholder="e.g., 120/80"
                  value={formData.bp.value}
                  onChange={(e) => handleMedicalInfoChange('bp', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Diabetic Status</label>
                <select
                  value={formData.diabetic.value}
                  onChange={(e) => handleMedicalInfoChange('diabetic', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select</option>
                  <option value="yes">Yes</option>
                  <option value="no">No</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Hyperthyroidism</label>
                <select
                  value={formData.hyperthyroidism.value}
                  onChange={(e) => handleMedicalInfoChange('hyperthyroidism', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select</option>
                  <option value="yes">Yes</option>
                  <option value="no">No</option>
                </select>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Medical Condition</label>
                <input
                  type="text"
                  name="condition"
                  value={formData.condition}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Upload Medical Reports</label>
                <input
                  type="file"
                  multiple
                  onChange={handleFileChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                />
                <p className="text-sm text-gray-500 mt-1">You can upload multiple reports (PDF, images, documents)</p>
              </div>
            </div>

            <div className="flex space-x-4 pt-6">
              <button
                type="submit"
                className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
              >
                Update Patient
              </button>
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  // Add Patient Modal Component
  const AddPatientModal = ({ onClose, onSave }) => {
    const [formData, setFormData] = useState({
      name: '',
      email: '',
      phone: '',
      photo: '',
      age: '',
      gender: 'male',
      bloodType: 'A+',
      bp: { value: '', known: false },
      diabetic: { value: '', known: false },
      hyperthyroidism: { value: '', known: false },
      condition: '',
      address: '',
      emergencyContact: { name: '', phone: '', relation: '' }
    });

    const [reports, setReports] = useState([]);

    const handleInputChange = (e) => {
      const { name, value } = e.target;
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    };

    const handleEmergencyContactChange = (field, value) => {
      setFormData(prev => ({
        ...prev,
        emergencyContact: {
          ...prev.emergencyContact,
          [field]: value
        }
      }));
    };

    const handleMedicalInfoChange = (field, value, known = true) => {
      setFormData(prev => ({
        ...prev,
        [field]: { value, known }
      }));
    };

    const handleFileChange = (e) => {
      setReports(Array.from(e.target.files));
    };

    const handleSubmit = (e) => {
      e.preventDefault();
      onSave(formData);
      if (reports.length > 0) {
        handleFileUpload(Math.max(...patients.map(p => p.id)) + 1, reports);
      }
    };

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          <div className="p-6 border-b sticky top-0 bg-white">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">Add New Patient</h2>
              <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg">
                <span className="text-2xl">×</span>
              </button>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Age</label>
                <input
                  type="number"
                  name="age"
                  value={formData.age}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Gender</label>
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Blood Type</label>
                <select
                  name="bloodType"
                  value={formData.bloodType}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="A+">A+</option>
                  <option value="A-">A-</option>
                  <option value="B+">B+</option>
                  <option value="B-">B-</option>
                  <option value="AB+">AB+</option>
                  <option value="AB-">AB-</option>
                  <option value="O+">O+</option>
                  <option value="O-">O-</option>
                </select>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Full address"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Emergency Contact Name</label>
                <input
                  type="text"
                  value={formData.emergencyContact.name}
                  onChange={(e) => handleEmergencyContactChange('name', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Emergency Contact Phone</label>
                <input
                  type="tel"
                  value={formData.emergencyContact.phone}
                  onChange={(e) => handleEmergencyContactChange('phone', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Emergency Contact Relation</label>
                <input
                  type="text"
                  value={formData.emergencyContact.relation}
                  onChange={(e) => handleEmergencyContactChange('relation', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Spouse, Parent, etc."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Blood Pressure</label>
                <input
                  type="text"
                  placeholder="e.g., 120/80"
                  value={formData.bp.value}
                  onChange={(e) => handleMedicalInfoChange('bp', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Diabetic Status</label>
                <select
                  value={formData.diabetic.value}
                  onChange={(e) => handleMedicalInfoChange('diabetic', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select</option>
                  <option value="yes">Yes</option>
                  <option value="no">No</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Hyperthyroidism</label>
                <select
                  value={formData.hyperthyroidism.value}
                  onChange={(e) => handleMedicalInfoChange('hyperthyroidism', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select</option>
                  <option value="yes">Yes</option>
                  <option value="no">No</option>
                </select>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Medical Condition</label>
                <input
                  type="text"
                  name="condition"
                  value={formData.condition}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Upload Medical Reports</label>
                <input
                  type="file"
                  multiple
                  onChange={handleFileChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                />
                <p className="text-sm text-gray-500 mt-1">You can upload multiple reports (PDF, images, documents)</p>
              </div>
            </div>

            <div className="flex space-x-4 pt-6">
              <button
                type="submit"
                className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
              >
                Add Patient
              </button>
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  // Patient Details Modal Component
  const PatientDetailsModal = ({ patient, onClose }) => {
    if (!patient) return null;

    const reportsForPatient = patientReports[patient.id] || [];

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
          <div className="p-6 border-b sticky top-0 bg-white">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">Patient Details</h2>
              <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg">
                <span className="text-2xl">×</span>
              </button>
            </div>
          </div>

          <div className="p-6">
            <div className="flex items-start space-x-6 mb-6">
              <img
                src={patient.photo}
                alt={patient.name}
                className="w-24 h-24 rounded-full object-cover border-4 border-blue-100"
              />
              <div className="flex-1">
                <div className="flex items-center space-x-4 mb-2">
                  <h3 className="text-2xl font-bold text-gray-900">{patient.name}</h3>
                  {getStatusBadge(patient.status)}
                </div>
                <p className="text-gray-600 mb-1">{patient.email}</p>
                <p className="text-gray-600">Phone: {patient.phone}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-semibold text-gray-900 mb-3">Personal Information</h4>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Age:</span>
                    <span className="font-medium">{patient.age} years</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Gender:</span>
                    <span className="font-medium">{getGenderIcon(patient.gender)} {patient.gender}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Blood Type:</span>
                    <span className="font-medium">{patient.bloodType}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Medical Condition:</span>
                    <span className="font-medium">{patient.condition}</span>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-semibold text-gray-900 mb-3">Contact Information</h4>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Address:</span>
                    <span className="font-medium text-right max-w-[200px]">{patient.address}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Emergency Contact:</span>
                    <span className="font-medium">{patient.emergencyContact.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Emergency Phone:</span>
                    <span className="font-medium">{patient.emergencyContact.phone}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Relation:</span>
                    <span className="font-medium">{patient.emergencyContact.relation}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="bg-blue-50 p-4 rounded-lg text-center">
                <div className="text-2xl font-bold text-blue-600">{patient.appointments.length}</div>
                <div className="text-sm text-blue-600">Total Appointments</div>
              </div>
              <div className="bg-green-50 p-4 rounded-lg text-center">
                <div className="text-2xl font-bold text-green-600">
                  {patient.appointments.filter(a => a.status === 'completed').length}
                </div>
                <div className="text-sm text-green-600">Completed</div>
              </div>
              <div className="bg-orange-50 p-4 rounded-lg text-center">
                <div className="text-2xl font-bold text-orange-600">
                  {patient.appointments.filter(a => a.status === 'scheduled').length}
                </div>
                <div className="text-sm text-orange-600">Scheduled</div>
              </div>
            </div>

            <div className="mb-6">
              <h4 className="font-semibold text-gray-900 mb-3">Medical Information</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white border border-gray-200 p-3 rounded-lg">
                  <div className="text-sm text-gray-600">Blood Pressure</div>
                  <div className="font-medium">
                    {patient.bp.known ? patient.bp.value : 'Not recorded'}
                  </div>
                </div>
                <div className="bg-white border border-gray-200 p-3 rounded-lg">
                  <div className="text-sm text-gray-600">Diabetic</div>
                  <div className="font-medium">
                    {patient.diabetic.known ? (patient.diabetic.value === 'yes' ? 'Yes' : 'No') : 'Not recorded'}
                  </div>
                </div>
                <div className="bg-white border border-gray-200 p-3 rounded-lg">
                  <div className="text-sm text-gray-600">Hyperthyroidism</div>
                  <div className="font-medium">
                    {patient.hyperthyroidism.known ? (patient.hyperthyroidism.value === 'yes' ? 'Yes' : 'No') : 'Not recorded'}
                  </div>
                </div>
              </div>
            </div>

            <div className="mb-6">
              <h4 className="font-semibold text-gray-900 mb-3">Appointment History</h4>
              <div className="space-y-3">
                {patient.appointments.map((appointment) => (
                  <div key={appointment.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <div className="font-medium">{appointment.date}</div>
                      <div className="text-sm text-gray-600">with {appointment.doctor}</div>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      appointment.status === 'completed' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-orange-100 text-orange-800'
                    }`}>
                      {appointment.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>

           {reportsForPatient.length > 0 && (
        <div>
          <h4 className="font-semibold text-gray-900 mb-3">Medical Reports</h4>
          <div className="space-y-2">
            {reportsForPatient.map((report) => (
              <div key={report.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <span className="text-blue-600">📄</span>
                  <div>
                    <div className="font-medium">{report.name}</div>
                    <div className="text-sm text-gray-600">
                      {report.type} • {Math.round(report.size / 1024)} KB • {report.uploadDate}
                    </div>
                  </div>
                </div>
                <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                  Download
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Patient Management</h1>
          <p className="text-gray-600">Manage patient records, appointments, and communications</p>
        </div>

        {/* Controls */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
            <div className="flex-1 max-w-md">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search patients by name, email, or condition..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                  🔍
                </span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Status</option>
                <option value="Active">Active</option>
                <option value="Follow-up">Follow-up</option>
                <option value="New">New</option>
              </select>

              <button
                onClick={() => setShowAddPatientModal(true)}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors flex items-center space-x-2"
              >
                <span>+</span>
                <span>Add New Patient</span>
              </button>
            </div>
          </div>
        </div>

        {/* Patients Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPatients.map((patient) => (
            <div key={patient.id} className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow">
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-4">
                    <img
                      src={patient.photo}
                      alt={patient.name}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                    <div>
                      <h3 className="font-semibold text-gray-900">{patient.name}</h3>
                      <p className="text-sm text-gray-600">{patient.email}</p>
                    </div>
                  </div>
                  {getStatusBadge(patient.status)}
                </div>

                <div className="space-y-3 mb-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Age / Gender</span>
                    <span className="font-medium">
                      {patient.age} yrs • {getGenderIcon(patient.gender)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Blood Type</span>
                    <span className="font-medium">{patient.bloodType}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Condition</span>
                    <span className="font-medium text-right max-w-[120px] truncate">{patient.condition}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Last Visit</span>
                    <span className="font-medium">{patient.lastAppointment || 'N/A'}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Next Appointment</span>
                    <span className="font-medium">{patient.nextAppointment || 'Not scheduled'}</span>
                  </div>
                </div>

                <div className="flex space-x-2">
                  <button
                    onClick={() => handleViewDetails(patient)}
                    className="flex-1 px-3 py-2 text-sm bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
                  >
                    View
                  </button>
                  <button
                    onClick={() => handleEdit(patient.id)}
                    className="px-3 py-2 text-sm bg-gray-50 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                    title="Edit Patient"
                  >
                    ✏️
                  </button>
                  
                 
                  <button
                    onClick={() => handleDelete(patient.id)}
                    className="px-3 py-2 text-sm bg-red-50 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
                    title="Delete Patient"
                  >
                    🗑️
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredPatients.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">😕</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No patients found</h3>
            <p className="text-gray-600">Try adjusting your search or filter criteria</p>
          </div>
        )}
      </div>

      {/* Modals */}
      {showDetailsModal && (
        <PatientDetailsModal
          patient={selectedPatient}
          onClose={() => setShowDetailsModal(false)}
        />
      )}

      {showAddPatientModal && (
        <AddPatientModal
          onClose={() => setShowAddPatientModal(false)}
          onSave={handleAddPatient}
        />
      )}

      {showEditPatientModal && (
        <EditPatientModal
          patient={selectedPatient}
          onClose={() => setShowEditPatientModal(false)}
          onUpdate={handleUpdatePatient}
        />
      )}

      {showMessageModal && (
        <MessageModal
          onClose={() => setShowMessageModal(false)}
          onSend={handleSendMessage}
        />
      )}

      {showAppointmentModal && (
        <AppointmentModal
          onClose={() => setShowAppointmentModal(false)}
          onSchedule={handleScheduleAppointment}
        />
      )}
    </div>
  );
};

export default PatientsPage;