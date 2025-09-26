import React, { useState } from 'react';

const ReferralsPage = () => {
  const [activeTab, setActiveTab] = useState('referring'); // 'referring' or 'received'
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedHospital, setSelectedHospital] = useState('');
  const [showPatientSelection, setShowPatientSelection] = useState(false);
  const [doctorToRefer, setDoctorToRefer] = useState(null);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [showPatientReferralModal, setShowPatientReferralModal] = useState(false);
  const [showPatientDetailsModal, setShowPatientDetailsModal] = useState(false);
  const [selectedPatientDetails, setSelectedPatientDetails] = useState(null);
  const [showNewReferralModal, setShowNewReferralModal] = useState(false);
  const [newReferralData, setNewReferralData] = useState({
    patientId: '',
    doctorId: '',
    condition: '',
    priority: 'medium',
    notes: ''
  });

  // Mock data for patients
  const patients = [
    {
      id: 1,
      full_name: 'John Smith',
      email: 'john.smith@email.com',
      mobile_no: '+1-555-0123',
      gender: 'Male',
      age: 45,
      condition: 'Hypertension',
      address: '123 Main St, New York, NY',
      emergency_contact: '+1-555-0124',
      blood_type: 'A+',
      allergies: ['Penicillin', 'Shellfish'],
      medical_history: ['Diabetes Type 2', 'High Cholesterol'],
      current_medications: ['Lisinopril 10mg', 'Metformin 500mg'],
      last_visit: '2024-01-10',
      insurance_provider: 'Blue Cross',
      insurance_number: 'BC-123456789'
    },
    {
      id: 2,
      full_name: 'Sarah Johnson',
      email: 'sarah.johnson@email.com',
      mobile_no: '+1-555-0125',
      gender: 'Female',
      age: 32,
      condition: 'Migraine',
      address: '456 Oak Ave, Boston, MA',
      emergency_contact: '+1-555-0126',
      blood_type: 'O-',
      allergies: ['Ibuprofen'],
      medical_history: ['Anxiety', 'Asthma'],
      current_medications: ['Propranolol 20mg', 'Sumatriptan 50mg'],
      last_visit: '2024-01-15',
      insurance_provider: 'Aetna',
      insurance_number: 'AET-987654321'
    },
    {
      id: 3,
      full_name: 'Robert Brown',
      email: 'robert.brown@email.com',
      mobile_no: '+1-555-0127',
      gender: 'Male',
      age: 58,
      condition: 'Arthritis',
      address: '789 Pine St, Chicago, IL',
      emergency_contact: '+1-555-0128',
      blood_type: 'B+',
      allergies: ['Codeine'],
      medical_history: ['Hypertension', 'Osteoporosis'],
      current_medications: ['Celecoxib 200mg', 'Calcium Supplement'],
      last_visit: '2024-01-18',
      insurance_provider: 'Cigna',
      insurance_number: 'CIG-456123789'
    },
    {
      id: 4,
      full_name: 'Emily Davis',
      email: 'emily.davis@email.com',
      mobile_no: '+1-555-0129',
      gender: 'Female',
      age: 29,
      condition: 'Asthma',
      address: '321 Elm St, Los Angeles, CA',
      emergency_contact: '+1-555-0130',
      blood_type: 'AB+',
      allergies: ['Dust Mites', 'Pollen'],
      medical_history: ['Childhood Asthma', 'Allergic Rhinitis'],
      current_medications: ['Albuterol Inhaler', 'Fluticasone Nasal Spray'],
      last_visit: '2024-01-20',
      insurance_provider: 'United Health',
      insurance_number: 'UHC-789456123'
    }
  ];

  const referringDoctors = [
    {
      id: 1,
      full_name: 'Dr. Michael Chen',
      email: 'michael.chen@cardiology.com',
      mobile_no: '+1-555-0101',
      medical_license_number: 'MED-LIC-12345',
      specialization: 'Cardiology',
      hospital: 'City General Hospital',
      location: 'New York, NY',
      year_of_registration: '2015',
      state_medical_council: 'New York State Medical Council',
      state_medical_license_number: 'NY-MED-789',
      qualification: 'MD, Cardiology Board Certified',
      experience: '12 years',
      commission_percentage: 15,
      op_consultation_fee: 200,
      surgical_referral_fee: 500,
      chronic_fee: 150,
      equipment: ['ECG Machine', 'Echocardiogram', 'Cardiac Monitor'],
      photo: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=150&h=150&fit=crop&crop=face',
      status: 'accepted',
      patientsReferred: 8,
      lastReferral: '2024-01-15'
    },
    {
      id: 2,
      full_name: 'Dr. Emily Rodriguez',
      email: 'emily.rodriguez@neurology.com',
      mobile_no: '+1-555-0102',
      medical_license_number: 'MED-LIC-12346',
      specialization: 'Neurology',
      hospital: 'Neuro Care Center',
      location: 'Boston, MA',
      year_of_registration: '2018',
      state_medical_council: 'Massachusetts Medical Society',
      state_medical_license_number: 'MA-MED-456',
      qualification: 'MD, Neurology Specialist',
      experience: '8 years',
      commission_percentage: 12,
      op_consultation_fee: 180,
      surgical_referral_fee: 450,
      chronic_fee: 120,
      equipment: ['EEG Machine', 'MRI Scanner', 'Nerve Conduction Study'],
      photo: 'https://images.unsplash.com/photo-1594824694996-8b3c4fe43d44?w=150&h=150&fit=crop&crop=face',
      status: 'pending',
      patientsReferred: 3,
      lastReferral: '2024-01-18'
    },
    {
      id: 3,
      full_name: 'Dr. James Wilson',
      email: 'james.wilson@ortho.com',
      mobile_no: '+1-555-0103',
      medical_license_number: 'MED-LIC-12347',
      specialization: 'Orthopedics',
      hospital: 'Bone & Joint Clinic',
      location: 'Chicago, IL',
      year_of_registration: '2012',
      state_medical_council: 'Illinois State Medical Society',
      state_medical_license_number: 'IL-MED-321',
      qualification: 'MD, Orthopedic Surgery',
      experience: '15 years',
      commission_percentage: 18,
      op_consultation_fee: 220,
      surgical_referral_fee: 600,
      chronic_fee: 160,
      equipment: ['X-Ray Machine', 'Arthroscopy System', 'Bone Densitometer'],
      photo: 'https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=150&h=150&fit=crop&crop=face',
      status: 'completed',
      patientsReferred: 12,
      lastReferral: '2024-01-20'
    },
    {
      id: 4,
      full_name: 'Dr. Lisa Brown',
      email: 'lisa.brown@dermatology.com',
      mobile_no: '+1-555-0104',
      medical_license_number: 'MED-LIC-12348',
      specialization: 'Dermatology',
      hospital: 'Skin Health Institute',
      location: 'Los Angeles, CA',
      year_of_registration: '2019',
      state_medical_council: 'California Medical Association',
      state_medical_license_number: 'CA-MED-654',
      qualification: 'MD, Dermatology Board Certified',
      experience: '7 years',
      commission_percentage: 10,
      op_consultation_fee: 160,
      surgical_referral_fee: 400,
      chronic_fee: 110,
      equipment: ['Dermatoscope', 'Laser Therapy', 'Cryotherapy Unit'],
      photo: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=150&h=150&fit=crop&crop=face',
      status: 'accepted',
      patientsReferred: 5,
      lastReferral: '2024-01-22'
    }
  ];

  // Mock data for received referrals (patients referred to your doctors)
  const [receivedReferrals, setReceivedReferrals] = useState([
    {
      id: 1,
      patientName: 'David Lee',
      patientId: 'PAT-005',
      condition: 'Chest Pain',
      referredBy: 'Dr. Amanda White',
      department: 'General Medicine',
      dateReferred: '2024-01-16',
      status: 'pending',
      priority: 'high',
      notes: 'Patient experiencing intermittent chest pain with ECG abnormalities',
      assignedDoctor: 'Dr. Michael Chen',
      patientDetails: {
        id: 5,
        full_name: 'David Lee',
        email: 'david.lee@email.com',
        mobile_no: '+1-555-0131',
        gender: 'Male',
        age: 52,
        condition: 'Chest Pain',
        address: '654 Maple St, Houston, TX',
        emergency_contact: '+1-555-0132',
        blood_type: 'O+',
        allergies: ['Aspirin', 'Peanuts'],
        medical_history: ['Hypertension', 'High Cholesterol', 'Smoking History'],
        current_medications: ['Aspirin 81mg', 'Atorvastatin 20mg'],
        last_visit: '2024-01-16',
        insurance_provider: 'Blue Shield',
        insurance_number: 'BS-456789123'
      }
    },
    {
      id: 2,
      patientName: 'Jennifer Martinez',
      patientId: 'PAT-006',
      condition: 'Arrhythmia',
      referredBy: 'Dr. Kevin Taylor',
      department: 'Emergency Medicine',
      dateReferred: '2024-01-19',
      status: 'pending',
      priority: 'urgent',
      notes: 'Suspected atrial fibrillation, requires cardiac monitoring',
      assignedDoctor: 'Dr. Emily Rodriguez',
      patientDetails: {
        id: 6,
        full_name: 'Jennifer Martinez',
        email: 'jennifer.martinez@email.com',
        mobile_no: '+1-555-0133',
        gender: 'Female',
        age: 41,
        condition: 'Arrhythmia',
        address: '987 Cedar Ave, Miami, FL',
        emergency_contact: '+1-555-0134',
        blood_type: 'A-',
        allergies: ['Latex', 'Sulfa Drugs'],
        medical_history: ['Anxiety', 'Obesity', 'Sleep Apnea'],
        current_medications: ['Metoprolol 25mg', 'Xanax 0.5mg'],
        last_visit: '2024-01-19',
        insurance_provider: 'Aetna',
        insurance_number: 'AET-654987321'
      }
    },
    {
      id: 3,
      patientName: 'Thomas Anderson',
      patientId: 'PAT-007',
      condition: 'Heart Murmur',
      referredBy: 'Dr. Rachel Green',
      department: 'Pediatrics',
      dateReferred: '2024-01-21',
      status: 'pending',
      priority: 'medium',
      notes: 'New onset heart murmur in pediatric patient',
      assignedDoctor: 'Dr. James Wilson',
      patientDetails: {
        id: 7,
        full_name: 'Thomas Anderson',
        email: 'thomas.anderson@email.com',
        mobile_no: '+1-555-0135',
        gender: 'Male',
        age: 8,
        condition: 'Heart Murmur',
        address: '321 Birch Ln, Seattle, WA',
        emergency_contact: '+1-555-0136',
        blood_type: 'B+',
        allergies: ['Dairy', 'Eggs'],
        medical_history: ['Asthma', 'Allergies'],
        current_medications: ['Albuterol Inhaler', 'Cetirizine 10mg'],
        last_visit: '2024-01-21',
        insurance_provider: 'United Health',
        insurance_number: 'UHC-321654987'
      }
    }
  ]);

  // Get unique hospitals for dropdown
  const hospitals = [...new Set(referringDoctors.map(doctor => doctor.hospital))];

  // Filter doctors based on search term and hospital
  const filteredDoctors = referringDoctors.filter(doctor =>
    (doctor.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    doctor.specialization.toLowerCase().includes(searchTerm.toLowerCase()) ||
    doctor.hospital.toLowerCase().includes(searchTerm.toLowerCase()) ||
    doctor.location.toLowerCase().includes(searchTerm.toLowerCase())) &&
    (selectedHospital === '' || doctor.hospital === selectedHospital)
  );

  const getStatusBadge = (status, priority = null) => {
    const statusConfig = {
      pending: { color: 'bg-yellow-100 text-yellow-800', icon: '⏳' },
      accepted: { color: 'bg-blue-100 text-blue-800', icon: '✅' },
      completed: { color: 'bg-green-100 text-green-800', icon: '✔️' },
      rejected: { color: 'bg-red-100 text-red-800', icon: '❌' }
    };

    const priorityConfig = {
      low: 'bg-gray-100 text-gray-800',
      medium: 'bg-orange-100 text-orange-800',
      high: 'bg-red-100 text-red-800',
      urgent: 'bg-red-100 text-red-800 animate-pulse'
    };

    const config = statusConfig[status] || statusConfig.pending;
    
    return (
      <div className="flex items-center space-x-2">
        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${config.color}`}>
          <span className="mr-1">{config.icon}</span>
          {status.charAt(0).toUpperCase() + status.slice(1)}
        </span>
        {priority && (
          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${priorityConfig[priority]}`}>
            {priority.charAt(0).toUpperCase() + priority.slice(1)}
          </span>
        )}
      </div>
    );
  };

  const handleAcceptReferral = (referralId) => {
    console.log('Accept referral:', referralId);
    setReceivedReferrals(prevReferrals => 
      prevReferrals.map(referral => 
        referral.id === referralId ? { ...referral, status: 'accepted' } : referral
      )
    );
    alert(`Referral #${referralId} accepted successfully!`);
  };

  const handleRejectReferral = (referralId) => {
    if (window.confirm('Are you sure you want to reject this referral?')) {
      console.log('Reject referral:', referralId);
      setReceivedReferrals(prevReferrals => 
        prevReferrals.map(referral => 
          referral.id === referralId ? { ...referral, status: 'rejected' } : referral
        )
      );
      alert(`Referral #${referralId} rejected.`);
    }
  };

  const handleViewDoctorDetails = (doctor) => {
    setSelectedDoctor(doctor);
    setShowDetailsModal(true);
  };

  const handleViewPatientDetails = (patientId, type) => {
    console.log(`View ${type} details for patient:`, patientId);
  };

  const handleReferPatient = (doctorId) => {
    const doctor = referringDoctors.find(d => d.id === doctorId);
    setDoctorToRefer(doctor);
    setShowPatientSelection(true);
  };

  const handleSelectPatientForReferral = (patient) => {
    setSelectedPatient(patient);
    setShowPatientSelection(false);
    setShowPatientReferralModal(true);
  };

  const handleConfirmReferral = () => {
    if (selectedPatient && doctorToRefer) {
      console.log('Referring patient:', selectedPatient.id, 'to doctor:', doctorToRefer.id);
      alert(`Patient ${selectedPatient.full_name} referred to ${doctorToRefer.full_name} successfully!`);
      setShowPatientReferralModal(false);
      setSelectedPatient(null);
      setDoctorToRefer(null);
    }
  };

  const handleCancelReferral = () => {
    setShowPatientSelection(false);
    setShowPatientReferralModal(false);
    setSelectedPatient(null);
    setDoctorToRefer(null);
  };

  // New function to handle patient name click
  const handlePatientNameClick = (referral) => {
    setSelectedPatientDetails(referral);
    setShowPatientDetailsModal(true);
  };

  // Receptionist-specific functions
  const handleAssignDoctor = (referralId) => {
    console.log('Assign doctor to referral:', referralId);
    alert(`Doctor assigned to referral #${referralId}`);
  };

  const handleScheduleAppointment = (referralId) => {
    console.log('Schedule appointment for referral:', referralId);
    alert(`Appointment scheduled for referral #${referralId}`);
  };

  const handleCreateNewReferral = () => {
    setShowNewReferralModal(true);
  };

  const handleSubmitNewReferral = () => {
    console.log('New referral data:', newReferralData);
    alert('New referral created successfully!');
    setShowNewReferralModal(false);
    setNewReferralData({
      patientId: '',
      doctorId: '',
      condition: '',
      priority: 'medium',
      notes: ''
    });
  };

  // Patient Details Modal Component with Accept/Reject functionality
  const PatientDetailsModal = ({ patient, onClose }) => {
    if (!patient) return null;

    const handleAcceptFromModal = () => {
      handleAcceptReferral(patient.id);
      onClose();
    };

    const handleRejectFromModal = () => {
      if (window.confirm('Are you sure you want to reject this referral?')) {
        handleRejectReferral(patient.id);
        onClose();
      }
    };

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
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

          <div className="p-6 space-y-6">
            {/* Patient Header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4 mb-6">
                <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-2xl font-medium text-blue-600">
                    {patient.patientDetails.full_name.split(' ').map(n => n[0]).join('')}
                  </span>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">{patient.patientDetails.full_name}</h3>
                  <p className="text-blue-600 font-medium">{patient.patientDetails.condition}</p>
                  <p className="text-gray-600">{patient.patientDetails.gender}, {patient.patientDetails.age} years</p>
                </div>
              </div>
              
              {/* Accept/Reject Buttons */}
              {patient.status === 'pending' && (
                <div className="flex space-x-3">
                  <button
                    onClick={handleAcceptFromModal}
                    className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-colors duration-200"
                  >
                    Accept Referral
                  </button>
                  <button
                    onClick={handleRejectFromModal}
                    className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition-colors duration-200"
                  >
                    Reject Referral
                  </button>
                </div>
              )}
            </div>

            {/* Referral Information */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="font-semibold text-gray-900 mb-3">Referral Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div>
                  <span className="text-gray-600">Referred By:</span>
                  <span className="font-medium ml-2">{patient.referredBy}</span>
                </div>
                <div>
                  <span className="text-gray-600">Department:</span>
                  <span className="font-medium ml-2">{patient.department}</span>
                </div>
                <div>
                  <span className="text-gray-600">Date Referred:</span>
                  <span className="font-medium ml-2">{patient.dateReferred}</span>
                </div>
                <div>
                  <span className="text-gray-600">Status:</span>
                  <span className="font-medium ml-2 capitalize">{patient.status}</span>
                </div>
                <div>
                  <span className="text-gray-600">Priority:</span>
                  <span className="font-medium ml-2 capitalize">{patient.priority}</span>
                </div>
                <div>
                  <span className="text-gray-600">Assigned Doctor:</span>
                  <span className="font-medium ml-2">{patient.assignedDoctor}</span>
                </div>
              </div>
              {patient.notes && (
                <div className="mt-3">
                  <span className="text-gray-600">Notes:</span>
                  <p className="font-medium mt-1">{patient.notes}</p>
                </div>
              )}
            </div>

            {/* Contact Information */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 mb-3">Contact Information</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Email:</span>
                    <span className="font-medium">{patient.patientDetails.email}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Mobile Number:</span>
                    <span className="font-medium">{patient.patientDetails.mobile_no}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Emergency Contact:</span>
                    <span className="font-medium">{patient.patientDetails.emergency_contact}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Address:</span>
                    <span className="font-medium text-right">{patient.patientDetails.address}</span>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 mb-3">Medical Information</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Blood Type:</span>
                    <span className="font-medium">{patient.patientDetails.blood_type}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Age:</span>
                    <span className="font-medium">{patient.patientDetails.age} years</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Gender:</span>
                    <span className="font-medium">{patient.patientDetails.gender}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Condition:</span>
                    <span className="font-medium text-red-600">{patient.patientDetails.condition}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Allergies */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="font-semibold text-gray-900 mb-3">Allergies</h3>
              <div className="flex flex-wrap gap-2">
                {patient.patientDetails.allergies.map((allergy, index) => (
                  <span key={index} className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm">
                    {allergy}
                  </span>
                ))}
              </div>
            </div>

            {/* Medical History */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="font-semibold text-gray-900 mb-3">Medical History</h3>
              <div className="flex flex-wrap gap-2">
                {patient.patientDetails.medical_history.map((history, index) => (
                  <span key={index} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                    {history}
                  </span>
                ))}
              </div>
            </div>

            {/* Current Medications */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="font-semibold text-gray-900 mb-3">Current Medications</h3>
              <div className="flex flex-wrap gap-2">
                {patient.patientDetails.current_medications.map((medication, index) => (
                  <span key={index} className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                    {medication}
                  </span>
                ))}
              </div>
            </div>

            {/* Insurance Information */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="font-semibold text-gray-900 mb-3">Insurance Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <span className="text-gray-600">Provider:</span>
                  <span className="font-medium ml-2">{patient.patientDetails.insurance_provider}</span>
                </div>
                <div>
                  <span className="text-gray-600">Policy Number:</span>
                  <span className="font-medium ml-2">{patient.patientDetails.insurance_number}</span>
                </div>
                <div>
                  <span className="text-gray-600">Last Visit:</span>
                  <span className="font-medium ml-2">{patient.patientDetails.last_visit}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Patient Selection Modal Component
  const PatientSelectionModal = ({ patients, onSelectPatient, onClose }) => {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-xl shadow-xl max-w-6xl w-full max-h-[90vh] overflow-y-auto">
          <div className="p-6 border-b sticky top-0 bg-white">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">Select Patient to Refer</h2>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <span className="text-2xl">×</span>
              </button>
            </div>
          </div>

          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {patients.map((patient) => (
                <div key={patient.id} className="bg-white rounded-lg border border-gray-200 hover:shadow-md transition-shadow duration-300">
                  <div className="p-4">
                    <div className="flex items-center space-x-3 mb-3">
                      <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                        <span className="text-lg font-medium text-blue-600">
                          {patient.full_name.split(' ').map(n => n[0]).join('')}
                        </span>
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">{patient.full_name}</h3>
                        <p className="text-sm text-gray-600">{patient.gender}, {patient.age} years</p>
                      </div>
                    </div>
                    
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Email:</span>
                        <span className="font-medium truncate ml-2">{patient.email}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Mobile:</span>
                        <span className="font-medium">{patient.mobile_no}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Condition:</span>
                        <span className="font-medium text-red-600">{patient.condition}</span>
                      </div>
                    </div>

                    <button
                      onClick={() => onSelectPatient(patient)}
                      className="w-full mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-200"
                    >
                      Select Patient
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Patient Referral Confirmation Modal Component
  const PatientReferralModal = ({ patient, doctor, onConfirm, onCancel }) => {
    if (!patient || !doctor) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
          <div className="p-6 border-b sticky top-0 bg-white">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">Confirm Patient Referral</h2>
              <button
                onClick={onCancel}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <span className="text-2xl">×</span>
              </button>
            </div>
          </div>

          <div className="p-6 space-y-6">
            {/* Referral Summary */}
            <div className="bg-blue-50 rounded-lg p-4">
              <h3 className="font-semibold text-blue-900 mb-2">Referral Summary</h3>
              <div className="flex items-center justify-between">
                <div className="text-sm">
                  <span className="text-gray-600">Referring:</span>
                  <span className="font-medium ml-2">{patient.full_name}</span>
                </div>
                <div className="text-2xl text-gray-400">→</div>
                <div className="text-sm">
                  <span className="text-gray-600">To:</span>
                  <span className="font-medium ml-2">{doctor.full_name}</span>
                </div>
              </div>
            </div>

            {/* Patient Details */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 mb-3">Patient Details</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Full Name:</span>
                    <span className="font-medium">{patient.full_name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Email:</span>
                    <span className="font-medium">{patient.email}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Mobile Number:</span>
                    <span className="font-medium">{patient.mobile_no}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Gender:</span>
                    <span className="font-medium">{patient.gender}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Age:</span>
                    <span className="font-medium">{patient.age} years</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Condition:</span>
                    <span className="font-medium text-red-600">{patient.condition}</span>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 mb-3">Medical Information</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Blood Type:</span>
                    <span className="font-medium">{patient.blood_type}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Allergies:</span>
                    <span className="font-medium text-right">{patient.allergies.join(', ')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Medical History:</span>
                    <span className="font-medium text-right">{patient.medical_history.join(', ')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Current Medications:</span>
                    <span className="font-medium text-right">{patient.current_medications.join(', ')}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Insurance Information */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="font-semibold text-gray-900 mb-3">Insurance Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <span className="text-gray-600">Provider:</span>
                  <span className="font-medium ml-2">{patient.insurance_provider}</span>
                </div>
                <div>
                  <span className="text-gray-600">Policy Number:</span>
                  <span className="font-medium ml-2">{patient.insurance_number}</span>
                </div>
                <div>
                  <span className="text-gray-600">Last Visit:</span>
                  <span className="font-medium ml-2">{patient.last_visit}</span>
                </div>
              </div>
            </div>

            {/* Doctor Information */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="font-semibold text-gray-900 mb-3">Referring To</h3>
              <div className="flex items-center space-x-4">
                <img
                  src={doctor.photo}
                  alt={doctor.full_name}
                  className="w-16 h-16 rounded-full border-2 border-blue-200"
                />
                <div>
                  <h4 className="font-bold text-gray-900">{doctor.full_name}</h4>
                  <p className="text-blue-600">{doctor.specialization}</p>
                  <p className="text-gray-600">{doctor.hospital}, {doctor.location}</p>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end space-x-4 pt-6 border-t">
              <button
                onClick={onCancel}
                className="px-6 py-2 border border-gray-300 text-gray-700 hover:bg-gray-50 font-medium rounded-lg transition-colors duration-200"
              >
                Cancel
              </button>
              <button
                onClick={onConfirm}
                className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-200"
              >
                Confirm Referral
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // New Referral Modal Component
  const NewReferralModal = ({ onClose, onSubmit, data, onChange }) => {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          <div className="p-6 border-b sticky top-0 bg-white">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">Create New Referral</h2>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <span className="text-2xl">×</span>
              </button>
            </div>
          </div>

          <div className="p-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Patient ID</label>
              <input
                type="text"
                value={data.patientId}
                onChange={(e) => onChange({ ...data, patientId: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter patient ID"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Doctor ID</label>
              <input
                type="text"
                value={data.doctorId}
                onChange={(e) => onChange({ ...data, doctorId: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter doctor ID"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Condition</label>
              <input
                type="text"
                value={data.condition}
                onChange={(e) => onChange({ ...data, condition: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter medical condition"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
              <select
                value={data.priority}
                onChange={(e) => onChange({ ...data, priority: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="urgent">Urgent</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
              <textarea
                value={data.notes}
                onChange={(e) => onChange({ ...data, notes: e.target.value })}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Additional notes..."
              />
            </div>

            <div className="flex justify-end space-x-4 pt-4">
              <button
                onClick={onClose}
                className="px-6 py-2 border border-gray-300 text-gray-700 hover:bg-gray-50 font-medium rounded-lg transition-colors duration-200"
              >
                Cancel
              </button>
              <button
                onClick={onSubmit}
                className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-200"
              >
                Create Referral
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Referral Management</h1>
        <p className="text-gray-600">Manage patient referrals and track referral status</p>
      </div>

      {/* Tab Navigation */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-6">
        <div className="flex border-b border-gray-200">
          <button
            onClick={() => setActiveTab('referring')}
            className={`flex-1 py-4 px-6 text-center font-medium transition-colors duration-200 ${
              activeTab === 'referring'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Referring Doctors
          </button>
          <button
            onClick={() => setActiveTab('received')}
            className={`flex-1 py-4 px-6 text-center font-medium transition-colors duration-200 ${
              activeTab === 'received'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Received Referrals
          </button>
        </div>

        {/* Tab Content */}
        <div className="p-6">
          {activeTab === 'referring' ? (
            <div>
              {/* Search and Filter Bar */}
              <div className="flex flex-col lg:flex-row gap-4 mb-6">
                <div className="flex-1">
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Search doctors by name, specialization, hospital, or location..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full px-4 py-3 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                      <span className="text-gray-400">🔍</span>
                    </div>
                  </div>
                </div>
                <select
                  value={selectedHospital}
                  onChange={(e) => setSelectedHospital(e.target.value)}
                  className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">All Hospitals</option>
                  {hospitals.map((hospital) => (
                    <option key={hospital} value={hospital}>
                      {hospital}
                    </option>
                  ))}
                </select>
                <button
                  onClick={handleCreateNewReferral}
                  className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-200"
                >
                  + New Referral
                </button>
              </div>

              {/* Doctors Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredDoctors.map((doctor) => (
                  <div key={doctor.id} className="bg-white rounded-lg border border-gray-200 hover:shadow-md transition-shadow duration-300">
                    <div className="p-6">
                      {/* Doctor Header */}
                      <div className="flex items-center space-x-4 mb-4">
                        <img
                          src={doctor.photo}
                          alt={doctor.full_name}
                          className="w-16 h-16 rounded-full border-2 border-blue-200"
                        />
                        <div className="flex-1 min-w-0">
                          <h3 className="text-lg font-bold text-gray-900 truncate">{doctor.full_name}</h3>
                          <p className="text-blue-600 font-medium">{doctor.specialization}</p>
                          <p className="text-sm text-gray-600 truncate">{doctor.hospital}, {doctor.location}</p>
                        </div>
                      </div>

                      {/* Doctor Details */}
                      <div className="space-y-3 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Experience:</span>
                          <span className="font-medium">{doctor.experience}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Consultation Fee:</span>
                          <span className="font-medium">${doctor.op_consultation_fee}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Patients Referred:</span>
                          <span className="font-medium">{doctor.patientsReferred}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Last Referral:</span>
                          <span className="font-medium">{doctor.lastReferral}</span>
                        </div>
                      </div>

                      {/* Status and Actions */}
                      <div className="mt-4 pt-4 border-t border-gray-200">
                        <div className="flex items-center justify-between">
                          {getStatusBadge(doctor.status)}
                          <div className="flex space-x-2">
                            <button
                              onClick={() => handleViewDoctorDetails(doctor)}
                              className="px-3 py-1 text-sm border border-gray-300 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors duration-200"
                            >
                              View
                            </button>
                            <button
                              onClick={() => handleReferPatient(doctor.id)}
                              className="px-3 py-1 text-sm bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-200"
                            >
                              Refer Patient
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {filteredDoctors.length === 0 && (
                <div className="text-center py-12">
                  <div className="text-gray-400 text-6xl mb-4">👨‍⚕️</div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No doctors found</h3>
                  <p className="text-gray-600">Try adjusting your search criteria</p>
                </div>
              )}
            </div>
          ) : (
            <div>
              {/* Received Referrals Table */}
              <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Patient
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Condition
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Referred By
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Date
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status & Priority
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {receivedReferrals.map((referral) => (
                        <tr key={referral.id} className="hover:bg-gray-50 transition-colors duration-150">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <button
                              onClick={() => handlePatientNameClick(referral)}
                              className="text-blue-600 hover:text-blue-800 font-medium hover:underline"
                            >
                              {referral.patientName}
                            </button>
                            <div className="text-sm text-gray-500">{referral.patientId}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="text-red-600 font-medium">{referral.condition}</span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="font-medium">{referral.referredBy}</div>
                            <div className="text-sm text-gray-500">{referral.department}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {referral.dateReferred}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {getStatusBadge(referral.status, referral.priority)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <div className="flex space-x-2">
                              {referral.status === 'pending' && (
                                <>
                                  <button
                                    onClick={() => handleAcceptReferral(referral.id)}
                                    className="text-green-600 hover:text-green-900 px-3 py-1 border border-green-600 hover:border-green-900 rounded-lg transition-colors duration-200"
                                  >
                                    Accept
                                  </button>
                                  <button
                                    onClick={() => handleRejectReferral(referral.id)}
                                    className="text-red-600 hover:text-red-900 px-3 py-1 border border-red-600 hover:border-red-900 rounded-lg transition-colors duration-200"
                                  >
                                    Reject
                                  </button>
                                </>
                              )}
                              <button
                                onClick={() => handleAssignDoctor(referral.id)}
                                className="text-blue-600 hover:text-blue-900 px-3 py-1 border border-blue-600 hover:border-blue-900 rounded-lg transition-colors duration-200"
                              >
                                Assign
                              </button>
                              <button
                                onClick={() => handleScheduleAppointment(referral.id)}
                                className="text-purple-600 hover:text-purple-900 px-3 py-1 border border-purple-600 hover:border-purple-900 rounded-lg transition-colors duration-200"
                              >
                                Schedule
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {receivedReferrals.length === 0 && (
                <div className="text-center py-12">
                  <div className="text-gray-400 text-6xl mb-4">📋</div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No received referrals</h3>
                  <p className="text-gray-600">Referrals from other doctors will appear here</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Modals */}
      {showDetailsModal && selectedDoctor && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b sticky top-0 bg-white">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900">Doctor Details</h2>
                <button
                  onClick={() => setShowDetailsModal(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <span className="text-2xl">×</span>
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              {/* Doctor Header */}
              <div className="flex items-center space-x-6">
                <img
                  src={selectedDoctor.photo}
                  alt={selectedDoctor.full_name}
                  className="w-24 h-24 rounded-full border-4 border-blue-200"
                />
                <div>
                  <h3 className="text-2xl font-bold text-gray-900">{selectedDoctor.full_name}</h3>
                  <p className="text-blue-600 text-lg font-medium">{selectedDoctor.specialization}</p>
                  <p className="text-gray-600">{selectedDoctor.hospital}, {selectedDoctor.location}</p>
                  <div className="flex items-center space-x-4 mt-2">
                    {getStatusBadge(selectedDoctor.status)}
                  </div>
                </div>
              </div>

              {/* Contact Information */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-3">Contact Information</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Email:</span>
                      <span className="font-medium">{selectedDoctor.email}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Mobile Number:</span>
                      <span className="font-medium">{selectedDoctor.mobile_no}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Hospital:</span>
                      <span className="font-medium">{selectedDoctor.hospital}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Location:</span>
                      <span className="font-medium">{selectedDoctor.location}</span>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-3">Professional Information</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Experience:</span>
                      <span className="font-medium">{selectedDoctor.experience}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Qualification:</span>
                      <span className="font-medium">{selectedDoctor.qualification}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Year of Registration:</span>
                      <span className="font-medium">{selectedDoctor.year_of_registration}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Medical Council:</span>
                      <span className="font-medium">{selectedDoctor.state_medical_council}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Fees and Commission */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 mb-3">Fees & Commission</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <span className="text-gray-600">OP Consultation Fee:</span>
                    <span className="font-medium ml-2">${selectedDoctor.op_consultation_fee}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Surgical Referral Fee:</span>
                    <span className="font-medium ml-2">${selectedDoctor.surgical_referral_fee}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Chronic Condition Fee:</span>
                    <span className="font-medium ml-2">${selectedDoctor.chronic_fee}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Commission Percentage:</span>
                    <span className="font-medium ml-2">{selectedDoctor.commission_percentage}%</span>
                  </div>
                </div>
              </div>

              {/* Equipment */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 mb-3">Available Equipment</h3>
                <div className="flex flex-wrap gap-2">
                  {selectedDoctor.equipment.map((item, index) => (
                    <span key={index} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                      {item}
                    </span>
                  ))}
                </div>
              </div>

              {/* License Information */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 mb-3">License Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <span className="text-gray-600">Medical License Number:</span>
                    <span className="font-medium ml-2">{selectedDoctor.medical_license_number}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">State License Number:</span>
                    <span className="font-medium ml-2">{selectedDoctor.state_medical_license_number}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Patient Selection Modal */}
      {showPatientSelection && (
        <PatientSelectionModal
          patients={patients}
          onSelectPatient={handleSelectPatientForReferral}
          onClose={handleCancelReferral}
        />
      )}

      {/* Patient Referral Confirmation Modal */}
      {showPatientReferralModal && (
        <PatientReferralModal
          patient={selectedPatient}
          doctor={doctorToRefer}
          onConfirm={handleConfirmReferral}
          onCancel={handleCancelReferral}
        />
      )}

      {/* Patient Details Modal */}
      {showPatientDetailsModal && selectedPatientDetails && (
        <PatientDetailsModal
          patient={selectedPatientDetails}
          onClose={() => setShowPatientDetailsModal(false)}
        />
      )}

      {/* New Referral Modal */}
      {showNewReferralModal && (
        <NewReferralModal
          onClose={() => setShowNewReferralModal(false)}
          onSubmit={handleSubmitNewReferral}
          data={newReferralData}
          onChange={setNewReferralData}
        />
      )}
    </div>
  );
};

export default ReferralsPage;