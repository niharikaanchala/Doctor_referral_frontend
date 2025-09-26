import React, { useState } from 'react';
import { BASE_URL } from "../../../config";
import { toast } from "react-toastify";

const Receptionist = () => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [receptionists, setReceptionists] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    role: 'receptionist'
  });

  // Form input handler
  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  // Add new receptionist
  const handleAddReceptionist = async (e) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    if (formData.password.length < 6) {
      toast.error("Password must be at least 6 characters long");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${BASE_URL}/auth/addreceptionist`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
           Authorization: `Bearer ${localStorage.getItem("token")}`

        },
        body: JSON.stringify(formData),
      });

      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.message);
      }

      if (result.success) {
        toast.success("Receptionist added successfully!");
        setFormData({
          name: '',
          email: '',
          phone: '',
          password: '',
          confirmPassword: '',
          role: 'receptionist'
        });
        setShowAddForm(false);
        // Refresh receptionists list
        fetchReceptionists();
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  // Fetch receptionists list
  const fetchReceptionists = async () => {
    try {
      const res = await fetch(`${BASE_URL}/auth/receptionists`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      const result = await res.json();
      if (result.success) {
        setReceptionists(result.data);
      }
    } catch (error) {
      console.error("Failed to fetch receptionists:", error);
    }
  };

  // Delete receptionist
  const handleDeleteReceptionist = async (id) => {
    if (!window.confirm("Are you sure you want to delete this receptionist?")) {
      return;
    }

    try {
      const res = await fetch(`${BASE_URL}/auth/receptionists/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      const result = await res.json();
      if (result.success) {
        toast.success("Receptionist deleted successfully!");
        fetchReceptionists();
      }
    } catch (error) {
      toast.error("Failed to delete receptionist");
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Receptionist Management</h2>
        <button
          onClick={() => setShowAddForm(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 font-medium"
        >
          + Add New Receptionist
        </button>
      </div>

      {/* Add Receptionist Form Modal */}
      {showAddForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Add New Receptionist</h3>
                <button
                  onClick={() => setShowAddForm(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleAddReceptionist} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    required
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Password
                  </label>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    required
                    minLength="6"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Confirm Password
                  </label>
                  <input
                    type="password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    required
                    minLength="6"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowAddForm(false)}
                    className="flex-1 px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-blue-400"
                  >
                    {loading ? "Adding..." : "Add Receptionist"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Receptionists List */}
     

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
        <div className="bg-blue-50 p-4 rounded-lg">
          <h4 className="font-semibold text-blue-900">Total Receptionists</h4>
          <p className="text-2xl font-bold text-blue-600">{receptionists.length}</p>
        </div>
        
        <div className="bg-green-50 p-4 rounded-lg">
          <h4 className="font-semibold text-green-900">Active</h4>
          <p className="text-2xl font-bold text-green-600">
            {receptionists.filter(r => r.isActive).length}
          </p>
        </div>
        
        <div className="bg-purple-50 p-4 rounded-lg">
          <h4 className="font-semibold text-purple-900">Inactive</h4>
          <p className="text-2xl font-bold text-purple-600">
            {receptionists.filter(r => !r.isActive).length}
          </p>
        </div>
      </div>

       <div className="bg-gray-50 rounded-lg p-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Existing Receptionists</h3>
        
        {receptionists.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <p>No receptionists added yet.</p>
            <p className="text-sm mt-2">Click "Add New Receptionist" to get started.</p>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {receptionists.map((receptionist) => (
              <div key={receptionist._id} className="bg-white rounded-lg border p-4 shadow-sm">
                <div className="flex items-center space-x-3 mb-3">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-blue-600 font-semibold text-lg">
                      {receptionist.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">{receptionist.name}</h4>
                    <p className="text-sm text-gray-600">{receptionist.email}</p>
                  </div>
                </div>
                
                <div className="space-y-2 text-sm">
                  <p className="text-gray-600">
                    <span className="font-medium">Phone:</span> {receptionist.phone}
                  </p>
                  <p className="text-gray-600">
                    <span className="font-medium">Status:</span> 
                    <span className={`ml-1 px-2 py-1 rounded-full text-xs ${
                      receptionist.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {receptionist.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </p>
                </div>

                <div className="flex gap-2 mt-4">
                  <button className="flex-1 px-3 py-1 bg-yellow-500 text-white text-sm rounded hover:bg-yellow-600">
                    Edit
                  </button>
                  <button 
                    onClick={() => handleDeleteReceptionist(receptionist._id)}
                    className="flex-1 px-3 py-1 bg-red-500 text-white text-sm rounded hover:bg-red-600"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Receptionist;