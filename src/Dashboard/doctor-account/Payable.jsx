import React, { useState } from 'react';

const Payable = () => {
  // Mock data for payable amounts
  const [doctors, setDoctors] = useState([
    {
      id: 1,
      name: 'Dr. Sarah Johnson',
      specialty: 'Cardiologist',
      avatar: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=100&h=100&fit=crop&crop=face',
      amount: 1250.00,
      dueDate: '2024-02-15',
      status: 'pending',
      patients: 12,
      commissionRate: 15,
      type: 'payable'
    },
    {
      id: 2,
      name: 'Dr. Michael Chen',
      specialty: 'Neurologist',
      avatar: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=100&h=100&fit=crop&crop=face',
      amount: 890.50,
      dueDate: '2024-02-20',
      status: 'pending',
      patients: 8,
      commissionRate: 15,
      type: 'payable'
    },
    {
      id: 3,
      name: 'Dr. Emily Rodriguez',
      specialty: 'Pediatrician',
      avatar: 'https://images.unsplash.com/photo-1594824694996-8b3c4fe43d44?w=100&h=100&fit=crop&crop=face',
      amount: 2100.75,
      dueDate: '2024-02-10',
      status: 'paid',
      patients: 18,
      commissionRate: 15,
      type: 'payable'
    },
    {
      id: 4,
      name: 'Dr. James Wilson',
      specialty: 'Orthopedic',
      avatar: 'https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=100&h=100&fit=crop&crop=face',
      amount: 1675.25,
      dueDate: '2024-02-25',
      status: 'pending',
      patients: 14,
      commissionRate: 15,
      type: 'payable'
    }
  ]);

  // Mock data for receivable amounts
  const [receivables, setReceivables] = useState([
    {
      id: 101,
      name: 'MediCare Insurance Co.',
      type: 'Insurance',
      avatar: 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=100&h=100&fit=crop&crop=center',
      amount: 3250.00,
      dueDate: '2024-02-18',
      status: 'pending',
      patients: 25,
      invoiceNumber: 'INV-2024-001'
    },
    {
      id: 102,
      name: 'HealthFirst Partners',
      type: 'Corporate',
      avatar: 'https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=100&h=100&fit=crop&crop=center',
      amount: 1875.50,
      dueDate: '2024-02-22',
      status: 'pending',
      patients: 15,
      invoiceNumber: 'INV-2024-002'
    },
    {
      id: 103,
      name: 'City Medical Group',
      type: 'Healthcare',
      avatar: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=100&h=100&fit=crop&crop=center',
      amount: 4320.25,
      dueDate: '2024-02-12',
      status: 'paid',
      patients: 32,
      invoiceNumber: 'INV-2024-003'
    },
    {
      id: 104,
      name: 'Global Health Inc.',
      type: 'International',
      avatar: 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=100&h=100&fit=crop&crop=center',
      amount: 2890.75,
      dueDate: '2024-02-28',
      status: 'pending',
      patients: 22,
      invoiceNumber: 'INV-2024-004'
    }
  ]);

  const [selectedDoctors, setSelectedDoctors] = useState([]);
  const [selectedReceivables, setSelectedReceivables] = useState([]);
  const [paymentMethod, setPaymentMethod] = useState('patient');
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showReceivableModal, setShowReceivableModal] = useState(false);
  const [filterDate, setFilterDate] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterType, setFilterType] = useState('all');
  const [filteredDoctors, setFilteredDoctors] = useState([]);
  const [filteredReceivables, setFilteredReceivables] = useState([]);
  const [filtering, setFiltering] = useState(false);
  const [activeTab, setActiveTab] = useState('payable');

  const toggleDoctorSelection = (doctorId) => {
    setSelectedDoctors(prev =>
      prev.includes(doctorId)
        ? prev.filter(id => id !== doctorId)
        : [...prev, doctorId]
    );
  };

  const toggleReceivableSelection = (receivableId) => {
    setSelectedReceivables(prev =>
      prev.includes(receivableId)
        ? prev.filter(id => id !== receivableId)
        : [...prev, receivableId]
    );
  };

  const selectAllDoctors = () => {
    const currentDoctors = filtering ? filteredDoctors : doctors;
    if (selectedDoctors.length === currentDoctors.length) {
      setSelectedDoctors([]);
    } else {
      setSelectedDoctors(currentDoctors.map(doctor => doctor.id));
    }
  };

  const selectAllReceivables = () => {
    const currentReceivables = filtering ? filteredReceivables : receivables;
    if (selectedReceivables.length === currentReceivables.length) {
      setSelectedReceivables([]);
    } else {
      setSelectedReceivables(currentReceivables.map(receivable => receivable.id));
    }
  };

  const getSelectedTotal = () => {
    if (activeTab === 'payable') {
      return doctors
        .filter(doctor => selectedDoctors.includes(doctor.id))
        .reduce((total, doctor) => total + doctor.amount, 0);
    } else {
      return receivables
        .filter(receivable => selectedReceivables.includes(receivable.id))
        .reduce((total, receivable) => total + receivable.amount, 0);
    }
  };

  const handlePayment = () => {
    if (activeTab === 'payable' && selectedDoctors.length === 0) {
      alert('Please select at least one doctor to proceed with payment.');
      return;
    }
    if (activeTab === 'receivable' && selectedReceivables.length === 0) {
      alert('Please select at least one receivable to proceed with collection.');
      return;
    }
    if (activeTab === 'payable') {
      setShowPaymentModal(true);
    } else {
      setShowReceivableModal(true);
    }
  };

  const confirmPayment = () => {
    console.log('Processing payment for doctors:', selectedDoctors);
    console.log('Payment method:', paymentMethod);
    console.log('Total amount:', getSelectedTotal());
    
    setTimeout(() => {
      alert(`Payment of $${getSelectedTotal().toFixed(2)} processed successfully!`);
      setShowPaymentModal(false);
      setSelectedDoctors([]);
    }, 2000);
  };

  const confirmReceivableCollection = () => {
    console.log('Processing receivable collection:', selectedReceivables);
    console.log('Total amount:', getSelectedTotal());
    
    setTimeout(() => {
      alert(`Receivable collection of $${getSelectedTotal().toFixed(2)} processed successfully!`);
      setShowReceivableModal(false);
      setSelectedReceivables([]);
    }, 2000);
  };

  const getStatusBadge = (status) => {
    const styles = {
      pending: 'bg-yellow-100 text-yellow-800',
      paid: 'bg-green-100 text-green-800'
    };
    return (
      <span className={`px-2 py-1 text-xs font-medium rounded-full ${styles[status]}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  const handleFilter = () => {
    let filteredDocs = doctors;
    let filteredRecs = receivables;

    if (filterDate) {
      filteredDocs = filteredDocs.filter(doctor => doctor.dueDate === filterDate);
      filteredRecs = filteredRecs.filter(receivable => receivable.dueDate === filterDate);
    }

    if (filterStatus !== 'all') {
      filteredDocs = filteredDocs.filter(doctor => doctor.status === filterStatus);
      filteredRecs = filteredRecs.filter(receivable => receivable.status === filterStatus);
    }

    setFilteredDoctors(filteredDocs);
    setFilteredReceivables(filteredRecs);
    setFiltering(true);
  };

  const clearFilters = () => {
    setFilterDate('');
    setFilterStatus('all');
    setFilterType('all');
    setFilteredDoctors([]);
    setFilteredReceivables([]);
    setFiltering(false);
  };

  const displayDoctors = filtering ? filteredDoctors : doctors;
  const displayReceivables = filtering ? filteredReceivables : receivables;

  const getTotalPayable = () => {
    return doctors.reduce((total, doctor) => total + doctor.amount, 0);
  };

  const getTotalReceivable = () => {
    return receivables.reduce((total, receivable) => total + receivable.amount, 0);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Payment Management</h1>
            <p className="text-gray-600 mt-2">
              Manage and process payments for healthcare providers and receivables
            </p>
          </div>
          <div className="mt-4 lg:mt-0">
            <div className="grid grid-cols-2 gap-6">
              <div className="text-center">
                <span className="text-sm text-gray-600 block">Total Payable:</span>
                <span className="text-2xl font-bold text-red-600">
                  ${getTotalPayable().toFixed(2)}
                </span>
              </div>
              <div className="text-center">
                <span className="text-sm text-gray-600 block">Total Receivable:</span>
                <span className="text-2xl font-bold text-green-600">
                  ${getTotalReceivable().toFixed(2)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
        <div className="border-b">
          <nav className="flex -mb-px">
            <button
              onClick={() => setActiveTab('payable')}
              className={`py-4 px-6 text-center font-medium text-sm border-b-2 transition-colors duration-200 ${
                activeTab === 'payable'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Payable 
            </button>
            <button
              onClick={() => setActiveTab('receivable')}
              className={`py-4 px-6 text-center font-medium text-sm border-b-2 transition-colors duration-200 ${
                activeTab === 'receivable'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Receivable 
            </button>
          </nav>
        </div>
      </div>

      {/* Filter Section */}
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
        <div className="flex flex-wrap items-center gap-4 p-4 bg-gray-50 border-b rounded-t">
          <div className="flex-1 min-w-[200px]">
            <label className="block text-sm font-medium text-gray-700 mb-1">Due Date</label>
            <input
              type="date"
              value={filterDate}
              onChange={(e) => setFilterDate(e.target.value)}
              className="w-full border px-3 py-2 rounded"
            />
          </div>

          <div className="flex-1 min-w-[200px]">
            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="w-full border px-3 py-2 rounded"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="paid">Paid</option>
            </select>
          </div>

          <div className="flex items-end gap-2">
            <button
              onClick={handleFilter}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
            >
              Apply Filters
            </button>
            <button
              onClick={clearFilters}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition-colors"
            >
              Clear
            </button>
          </div>
        </div>

        {filtering && (
          <div className="p-4 bg-blue-50 border-b">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium text-gray-800">
                  Showing {activeTab === 'payable' ? displayDoctors.length : displayReceivables.length} {activeTab === 'payable' ? 'doctor(s)' : 'receivable(s)'}
                  {filterDate && ` due on ${filterDate}`}
                  {filterStatus !== 'all' && ` with status ${filterStatus}`}
                </h3>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Payment Options */}
    

      {/* Payable Doctors List */}
      {activeTab === 'payable' && (
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">Doctors Payable</h2>
              <div className="flex items-center space-x-4">
                <button
                  onClick={selectAllDoctors}
                  className="text-sm text-blue-600 hover:text-blue-800"
                >
                  {selectedDoctors.length === displayDoctors.length ? 'Deselect All' : 'Select All'}
                </button>
                <span className="text-sm text-gray-600">
                  {selectedDoctors.length} of {displayDoctors.length} selected
                </span>
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-gray-600">
              <thead className="bg-gradient-to-r from-blue-50 to-indigo-50 text-gray-700">
                <tr>
                  <th scope="col" className="px-6 py-3 font-medium">Select</th>
                  <th scope="col" className="px-6 py-3 font-medium">Doctor</th>
                  <th scope="col" className="px-6 py-3 font-medium">Patients</th>
                  <th scope="col" className="px-6 py-3 font-medium">Commission</th>
                  <th scope="col" className="px-6 py-3 font-medium">Amount</th>
                  <th scope="col" className="px-6 py-3 font-medium">Due Date</th>
                  <th scope="col" className="px-6 py-3 font-medium">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {displayDoctors.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="px-6 py-4 text-center text-gray-500">
                      No doctors found for the selected criteria
                    </td>
                  </tr>
                ) : (
                  displayDoctors.map((doctor) => (
                    <tr 
                      key={doctor.id} 
                      className={`hover:bg-blue-50 transition-colors ${
                        selectedDoctors.includes(doctor.id) ? 'bg-blue-50' : ''
                      }`}
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <input
                          type="checkbox"
                          checked={selectedDoctors.includes(doctor.id)}
                          onChange={() => toggleDoctorSelection(doctor.id)}
                          className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                        />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center space-x-3">
                          <img
                            src={doctor.avatar}
                            alt={doctor.name}
                            className="w-10 h-10 rounded-full"
                          />
                          <div>
                            <div className="font-medium text-gray-900">{doctor.name}</div>
                            <div className="text-sm text-gray-500">{doctor.specialty}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {doctor.patients} patients
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {doctor.commissionRate}%
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="font-semibold text-red-600">
                          ${doctor.amount.toFixed(2)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {doctor.dueDate}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {getStatusBadge(doctor.status)}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Receivable Clients List */}
      {activeTab === 'receivable' && (
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">Receivable from Clients</h2>
              <div className="flex items-center space-x-4">
                <button
                  onClick={selectAllReceivables}
                  className="text-sm text-blue-600 hover:text-blue-800"
                >
                  {selectedReceivables.length === displayReceivables.length ? 'Deselect All' : 'Select All'}
                </button>
                <span className="text-sm text-gray-600">
                  {selectedReceivables.length} of {displayReceivables.length} selected
                </span>
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-gray-600">
              <thead className="bg-gradient-to-r from-green-50 to-emerald-50 text-gray-700">
                <tr>
                  <th scope="col" className="px-6 py-3 font-medium">Select</th>
                  <th scope="col" className="px-6 py-3 font-medium">Client</th>
                  <th scope="col" className="px-6 py-3 font-medium">Type</th>
                  <th scope="col" className="px-6 py-3 font-medium">Patients</th>
                  <th scope="col" className="px-6 py-3 font-medium">Invoice No.</th>
                  <th scope="col" className="px-6 py-3 font-medium">Amount</th>
                  <th scope="col" className="px-6 py-3 font-medium">Due Date</th>
                  <th scope="col" className="px-6 py-3 font-medium">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {displayReceivables.length === 0 ? (
                  <tr>
                    <td colSpan="8" className="px-6 py-4 text-center text-gray-500">
                      No receivables found for the selected criteria
                    </td>
                  </tr>
                ) : (
                  displayReceivables.map((receivable) => (
                    <tr 
                      key={receivable.id} 
                      className={`hover:bg-green-50 transition-colors ${
                        selectedReceivables.includes(receivable.id) ? 'bg-green-50' : ''
                      }`}
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <input
                          type="checkbox"
                          checked={selectedReceivables.includes(receivable.id)}
                          onChange={() => toggleReceivableSelection(receivable.id)}
                          className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                        />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center space-x-3">
                          <img
                            src={receivable.avatar}
                            alt={receivable.name}
                            className="w-10 h-10 rounded-full"
                          />
                          <div>
                            <div className="font-medium text-gray-900">{receivable.name}</div>
                            <div className="text-sm text-gray-500">{receivable.type}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {receivable.type}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {receivable.patients} patients
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {receivable.invoiceNumber}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="font-semibold text-green-600">
                          ${receivable.amount.toFixed(2)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {receivable.dueDate}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {getStatusBadge(receivable.status)}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Payment Summary */}
      {(selectedDoctors.length > 0 || selectedReceivables.length > 0) && (
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6 sticky bottom-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
            <div className="mb-4 lg:mb-0">
              <div className="text-lg font-semibold text-gray-900">
                {activeTab === 'payable' ? 'Payment Summary' : 'Collection Summary'}
              </div>
              <div className="text-sm text-gray-600">
                {activeTab === 'payable' ? selectedDoctors.length : selectedReceivables.length} {activeTab === 'payable' ? 'doctor(s)' : 'receivable(s)'} selected • Due in 7 days
              </div>
            </div>
            <div className="flex items-center space-x-6">
              <div className="text-right">
                <div className="text-2xl font-bold text-blue-600">
                  ${getSelectedTotal().toFixed(2)}
                </div>
                <div className="text-sm text-gray-600">
                  Total amount
                </div>
              </div>
              {
                activeTab == 'payable' &&(
              <button
                onClick={handlePayment}
                className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-200 shadow-lg hover:shadow-xl"
              >
              pay
              </button>
                  
                )
              }
            </div>
          </div>
        </div>
      )}

      {/* Payment Modal */}
      {showPaymentModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Confirm Payment
            </h3>
            
            <div className="space-y-4 mb-6">
              <div className="flex justify-between">
                <span className="text-gray-600">Selected Doctors:</span>
                <span className="font-medium">{selectedDoctors.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Payment Method:</span>
                <span className="font-medium capitalize">{paymentMethod}</span>
              </div>
              <div className="flex justify-between text-lg font-semibold border-t pt-3">
                <span>Total Amount:</span>
                <span className="text-blue-600">
                  ${getSelectedTotal().toFixed(2)}
                </span>
              </div>
            </div>

            <div className="flex space-x-3">
              <button
                onClick={() => setShowPaymentModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmPayment}
                className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
              >
                Confirm Payment
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Receivable Modal */}
      {showReceivableModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Confirm Collection
            </h3>
            
            <div className="space-y-4 mb-6">
              <div className="flex justify-between">
                <span className="text-gray-600">Selected Receivables:</span>
                <span className="font-medium">{selectedReceivables.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Collection Type:</span>
                <span className="font-medium capitalize">Receivable</span>
              </div>
              <div className="flex justify-between text-lg font-semibold border-t pt-3">
                <span>Total Amount:</span>
                <span className="text-green-600">
                  ${getSelectedTotal().toFixed(2)}
                </span>
              </div>
            </div>

            <div className="flex space-x-3">
              <button
                onClick={() => setShowReceivableModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmReceivableCollection}
                className="flex-1 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
              >
                Confirm Collection
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Payable;