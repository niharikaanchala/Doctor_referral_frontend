import React, { useState } from 'react';

const PatientsPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  
  // NEW STATE VARIABLES - Added for new functionality
  const [showAddPatientModal, setShowAddPatientModal] = useState(false);
  const [showEditPatientModal, setShowEditPatientModal] = useState(false);
  const [patientReports, setPatientReports] = useState({});
  const [showMessageModal, setShowMessageModal] = useState(false); // NEW STATE for message modal
  const [messageContent, setMessageContent] = useState(''); // NEW STATE for message content
  const [messageRecipient, setMessageRecipient] = useState(''); // NEW STATE for recipient
  const [patients, setPatients] = useState([
    // ... existing patients data remains exactly the same ...
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
      appointments: ['app1', 'app2'],
      lastAppointment: '2024-01-15',
      nextAppointment: '2024-02-01',
      status: 'Active',
      condition: 'Hypertension'
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
      appointments: ['app3'],
      lastAppointment: '2024-01-14',
      nextAppointment: '2024-02-05',
      status: 'Active',
      condition: 'Diabetes'
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
      appointments: ['app4', 'app5', 'app6'],
      lastAppointment: '2024-01-13',
      nextAppointment: '2024-01-28',
      status: 'Follow-up',
      condition: 'Asthma'
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
      appointments: ['app7'],
      lastAppointment: '2024-01-12',
      nextAppointment: '2024-02-10',
      status: 'Active',
      condition: 'Arthritis'
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
      appointments: ['app8'],
      lastAppointment: '2024-01-10',
      nextAppointment: '2024-02-15',
      status: 'New',
      condition: 'Migraine'
    },
    {
      id: 6,
      name: 'Emily Davis',
      email: 'emily.davis@email.com',
      phone: 6789012345,
      photo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=face',
      age: 41,
      gender: 'female',
      bloodType: 'O+',
      role: 'patient',
      bp: { value: '130/85', known: true },
      diabetic: { value: 'no', known: true },
      hyperthyroidism: { value: 'yes', known: true },
      appointments: ['app9', 'app10'],
      lastAppointment: '2024-01-08',
      nextAppointment: '2024-02-20',
      status: 'Active',
      condition: 'Hypertension'
    }
  ]);

  // ... ALL EXISTING FUNCTIONS REMAIN EXACTLY THE SAME ...

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

  // ENHANCED HANDLE EDIT FUNCTION
  const handleEdit = (patientId) => {
    const patient = patients.find(p => p.id === patientId);
    setSelectedPatient(patient);
    setShowEditPatientModal(true);
  };

  const handleDelete = (patientId) => {
    if (window.confirm('Are you sure you want to delete this patient record?')) {
      console.log('Delete patient:', patientId);
      // Delete logic
    }
  };

  // UPDATED HANDLE MESSAGE FUNCTION
  const handleMessage = (patientId) => {
    const patient = patients.find(p => p.id === patientId);
    setSelectedPatient(patient);
    setMessageRecipient(`Dr. Smith (${patient.name}'s Doctor)`); // Default recipient
    setMessageContent(''); // Clear previous message
    setShowMessageModal(true);
  };

  const handleAddAppointment = (patientId) => {
    console.log('Add appointment for:', patientId);
    // Open appointment modal
  };

  // NEW FUNCTIONALITY - File upload handler
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

  // NEW FUNCTIONALITY - Add new patient
  const handleAddPatient = (newPatientData) => {
    const newPatient = {
      id: Math.max(...patients.map(p => p.id)) + 1,
      ...newPatientData,
      appointments: [],
      lastAppointment: '',
      nextAppointment: '',
      status: 'New'
    };
    setPatients(prev => [...prev, newPatient]);
    setShowAddPatientModal(false);
  };

  // NEW FUNCTIONALITY - Update patient
  const handleUpdatePatient = (updatedPatientData) => {
    setPatients(prev => prev.map(patient => 
      patient.id === updatedPatientData.id ? updatedPatientData : patient
    ));
    setShowEditPatientModal(false);
  };

  // NEW FUNCTIONALITY - Send message to doctor
  const handleSendMessage = () => {
    if (messageContent.trim() === '') {
      alert('Please enter a message');
      return;
    }

    // Simulate sending message to doctor
    console.log('Message sent to doctor:', {
      recipient: messageRecipient,
      patient: selectedPatient?.name,
      message: messageContent,
      timestamp: new Date().toISOString()
    });

    // Show success message
    alert('Message sent successfully to the doctor!');
    
    // Reset and close modal
    setMessageContent('');
    setShowMessageModal(false);
  };

  // NEW COMPONENT - Message Modal
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

  // ... ALL EXISTING COMPONENTS (EditPatientModal, AddPatientModal, PatientDetailsModal) REMAIN EXACTLY THE SAME ...

  // NEW COMPONENT - Edit Patient Modal (unchanged)
  const EditPatientModal = ({ patient, onClose, onUpdate }) => {
    // ... existing EditPatientModal code remains exactly the same ...
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
      condition: ''
    });

    const [reports, setReports] = useState([]);

    const handleInputChange = (e) => {
      e.preventDefault()
      const { name, value } = e.target;
      setFormData(prev => ({
        ...prev,
        [name]: value
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

  // NEW COMPONENT - Add Patient Modal (unchanged)
  const AddPatientModal = ({ onClose, onSave }) => {
    // ... existing AddPatientModal code remains exactly the same ...
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
      condition: ''
    });

    const [reports, setReports] = useState([]);

    const handleInputChange = (e) => {
      const { name, value } = e.target;
      setFormData(prev => ({
        ...prev,
        [name]: value
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
                Save Patient
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

  // ENHANCED Patient Details Modal Component with Reports Section (unchanged)
  const PatientDetailsModal = ({ patient, onClose }) => {
    if (!patient) return null;

    const getHealthStatus = () => {
      const conditions = [];
      if (patient.diabetic.value === 'yes') conditions.push('Diabetic');
      if (patient.hyperthyroidism.value === 'yes') conditions.push('Hyperthyroid');
      if (patient.bp.value && parseInt(patient.bp.value.split('/')[0]) > 130) conditions.push('Hypertensive');
      
      return conditions.length > 0 ? conditions.join(', ') : 'Good Health';
    };

    const patientReportsList = patientReports[patient.id] || [];

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
          {/* Modal Header */}
          <div className="p-6 border-b sticky top-0 bg-white">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">Patient Details</h2>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <span className="text-2xl">×</span>
              </button>
            </div>
          </div>

          {/* Modal Content */}
          <div className="p-6 space-y-6">
            {/* Basic Information */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 mb-3">Personal Information</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Full Name:</span>
                    <span className="font-medium">{patient.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Email:</span>
                    <span className="font-medium">{patient.email}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Phone:</span>
                    <span className="font-medium">{patient.phone}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Age:</span>
                    <span className="font-medium">{patient.age} years</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Gender:</span>
                    <span className="font-medium capitalize">{patient.gender}</span>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 mb-3">Medical Profile</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Blood Type:</span>
                    <span className="font-medium">{patient.bloodType}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Primary Condition:</span>
                    <span className="font-medium text-blue-600">{patient.condition}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Health Status:</span>
                    <span className={`font-medium px-2 py-1 rounded-full text-xs ${
                      getHealthStatus() === 'Good Health' 
                        ? 'bg-green-100 text-green-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {getHealthStatus()}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Detailed Medical Information */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="font-semibold text-gray-900 mb-3">Detailed Medical Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Blood Pressure</h4>
                  <p className="text-gray-600">
                    {patient.bp.known ? patient.bp.value || 'Normal' : 'Not Known'}
                  </p>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Diabetic Status</h4>
                  <p className="text-gray-600">
                    {patient.diabetic.known ? patient.diabetic.value || 'No' : 'Not Known'}
                  </p>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Hyperthyroidism</h4>
                  <p className="text-gray-600">
                    {patient.hyperthyroidism.known ? patient.hyperthyroidism.value || 'No' : 'Not Known'}
                  </p>
                </div>
              </div>
            </div>

            {/* Appointment History */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="font-semibold text-gray-900 mb-3">Appointment History</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Last Appointment:</span>
                  <span className="font-medium">{patient.lastAppointment || 'No previous appointments'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Next Appointment:</span>
                  <span className="font-medium text-green-600">{patient.nextAppointment || 'Not scheduled'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Appointments:</span>
                  <span className="font-medium">{patient.appointments.length}</span>
                </div>
              </div>
            </div>

            {/* Medical Reports Section */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="font-semibold text-gray-900 mb-3">Medical Reports</h3>
              {patientReportsList.length > 0 ? (
                <div className="space-y-2">
                  {patientReportsList.map((report) => (
                    <div key={report.id} className="flex items-center justify-between p-3 bg-white rounded-lg border">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                          <span className="text-blue-600 text-sm">📄</span>
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{report.name}</p>
                          <p className="text-sm text-gray-500">
                            {report.type} • {Math.round(report.size / 1024)} KB • {report.uploadDate}
                          </p>
                        </div>
                      </div>
                      <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                        Download
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-4">No medical reports uploaded yet.</p>
              )}
            </div>
          </div>

          {/* Modal Footer with Action Buttons */}
          <div className="p-6 border-t bg-gray-50">
            <div className="flex flex-wrap gap-3">
              {/* NEW: Send Message Button */}
              <button
                onClick={() => handleMessage(patient.id)}
                className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors flex items-center space-x-2"
              >
                <span>📩</span>
                <span>Send Message to Doctor</span>
              </button>
              
             
              
              
              
              <button
                onClick={() => handleDelete(patient.id)}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors flex items-center space-x-2"
              >
                <span>🗑️</span>
                <span>Delete Patient</span>
              </button>
              
              <button
                onClick={onClose}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header Section */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Patient Management</h1>
        <p className="text-gray-600">Manage your patients, view details, and track their health records</p>
      </div>

      {/* Search and Filter Section */}
      <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="flex-1">
            <div className="relative max-w-md">
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
          
          <div className="flex items-center space-x-4">
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
              <span>➕</span>
              <span>Add New Patient</span>
            </button>
          </div>
        </div>
      </div>

      {/* Patients Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPatients.map((patient) => (
          <div key={patient.id} className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow">
            {/* Patient Header */}
            <div className="p-6 border-b">
              <div className="flex items-center space-x-4">
                <img
                  src={patient.photo}
                  alt={patient.name}
                  className="w-16 h-16 rounded-full object-cover"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-gray-900 truncate">{patient.name}</h3>
                    {getStatusBadge(patient.status)}
                  </div>
                  <p className="text-gray-600 text-sm truncate">{patient.email}</p>
                  <p className="text-gray-500 text-sm flex items-center space-x-1">
                    <span>{getGenderIcon(patient.gender)}</span>
                    <span>{patient.age} years • {patient.bloodType}</span>
                  </p>
                </div>
              </div>
            </div>

            {/* Patient Details */}
            <div className="p-6 space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Condition:</span>
                <span className="font-medium text-blue-600">{patient.condition}</span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Last Visit:</span>
                <span className="font-medium">{patient.lastAppointment || 'No visits'}</span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Next Appointment:</span>
                <span className="font-medium text-green-600">{patient.nextAppointment || 'Not scheduled'}</span>
              </div>

              {/* Health Indicators */}
              <div className="pt-3 border-t">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Health Indicators:</span>
                  <div className="flex space-x-2">
                    {patient.bp.known && (
                      <span className="bg-red-100 text-red-800 px-2 py-1 rounded-full text-xs">BP</span>
                    )}
                    {patient.diabetic.known && patient.diabetic.value === 'yes' && (
                      <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs">Diabetes</span>
                    )}
                    {patient.hyperthyroidism.known && patient.hyperthyroidism.value === 'yes' && (
                      <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded-full text-xs">Thyroid</span>
                    )}
                    {!patient.bp.known && !patient.diabetic.known && !patient.hyperthyroidism.known && (
                      <span className="text-gray-500 text-xs">No data</span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="p-6 border-t bg-gray-50 rounded-b-xl">
              <div className="flex space-x-3">
                <button
                  onClick={() => handleViewDetails(patient)}
                  className="flex-1 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-lg transition-colors"
                >
                  View Details
                </button>
                <button
                  onClick={() => handleEdit(patient.id)}
                  className="px-3 py-2 border border-gray-300 text-gray-700 text-sm rounded-lg hover:bg-gray-100 transition-colors"
                >
                  Edit
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* No Results Message */}
      {filteredPatients.length === 0 && (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">🔍</div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No patients found</h3>
          <p className="text-gray-600">Try adjusting your search or filter criteria</p>
        </div>
      )}

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

      {/* NEW: Message Modal */}
      {showMessageModal && (
        <MessageModal
          onClose={() => setShowMessageModal(false)}
          onSend={handleSendMessage}
        />
      )}
    </div>
  );
};

export default PatientsPage;