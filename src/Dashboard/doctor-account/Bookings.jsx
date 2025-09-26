import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { BASE_URL } from "../../config.js";
import { toast } from "react-toastify";
import Loading from "../../components/loader/Loading.jsx";

const Bookings = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [chatMessages, setChatMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [isChatOpen, setIsChatOpen] = useState(false);

  // Static responses for the chatbot
  const staticResponses = {
    "hello": "Hello! How can I assist you with this patient's case?",
    "hi": "Hi there! I'm here to help you with medical information.",
    "symptoms": "Please describe the symptoms you're observing in detail.",
    "diagnosis": "Based on the available information, I can help you consider possible diagnoses. What specific symptoms are present?",
    "treatment": "Treatment options depend on the diagnosis. I recommend consulting with specialists for specific treatment plans.",
    "medication": "Please consult the patient's medical history and current medications before prescribing anything new.",
    "referral": "For specialist referrals, please specify the medical specialty needed.",
    "follow up": "Follow-up appointments should be scheduled based on the patient's condition and treatment response.",
    "emergency": "If this is an emergency, please direct the patient to the nearest emergency room immediately.",
    "thank you": "You're welcome! Let me know if you need any further assistance.",
    "thanks": "You're welcome! I'm here to help.",
    "default": "I'm a medical assistant chatbot. I can help with symptoms, diagnosis, treatment options, and general medical advice. How can I assist you?"
  };

  useEffect(() => {
    const fetchBooking = async () => {
      try {
        const res = await fetch(`${BASE_URL}/bookings/${id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        const result = await res.json();

        if (!res.ok) {
          throw new Error(result.message);
        }

        setBooking(result.data);
      } catch (err) {
        toast.error(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchBooking();
  }, [id]);

  // Initialize with welcome message when chat opens
  useEffect(() => {
    if (isChatOpen && chatMessages.length === 0) {
      setChatMessages([
        {
          id: 1,
          text: "Hello! I'm your medical assistant chatbot. How can I help you with this patient's case today?",
          isBot: true,
          timestamp: new Date()
        }
      ]);
    }
  }, [isChatOpen, chatMessages.length]);

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;

    // Add user message
    const userMessage = {
      id: chatMessages.length + 1,
      text: newMessage,
      isBot: false,
      timestamp: new Date()
    };

    setChatMessages(prev => [...prev, userMessage]);
    
    // Simulate bot response after a short delay
    setTimeout(() => {
      const botResponse = generateBotResponse(newMessage);
      const botMessage = {
        id: chatMessages.length + 2,
        text: botResponse,
        isBot: true,
        timestamp: new Date()
      };
      setChatMessages(prev => [...prev, botMessage]);
    }, 1000);

    setNewMessage("");
  };

  const generateBotResponse = (userMessage) => {
    const message = userMessage.toLowerCase().trim();
    
    // Check for keywords in the message
    for (const [keyword, response] of Object.entries(staticResponses)) {
      if (message.includes(keyword)) {
        return response;
      }
    }
    
    // Return default response if no keywords match
    return staticResponses.default;
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  const handleViewAiAnalysis = () => {
    toast.info("AI Analysis feature would be integrated here");
    // Add your AI analysis integration logic here
  };

  const handleReferToDoctor = () => {
    toast.info("Refer to Doctor functionality would be implemented here");
    // Add your referral logic here
  };

  const handleSendResponse = () => {
    toast.info("Send Response feature would be activated");
    // Add your response sending logic here
  };

  if (loading) {
    return <Loading />;
  }

  if (!booking) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900">Booking not found</h2>
          <button
            onClick={() => navigate("/dashboard")}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Patient Header */}
      <div className="bg-white shadow rounded-lg mb-6">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <img
                src={booking.user.photo}
                alt={booking.user.name}
                className="w-16 h-16 rounded-full object-cover"
              />
              <div className="ml-4">
                <h1 className="text-2xl font-bold text-gray-900">
                  {booking.user.name}
                </h1>
                <p className="text-gray-600">{booking.user.email}</p>
                <div className="flex items-center mt-1 space-x-4">
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    booking.user.gender === 'male' 
                      ? 'bg-blue-100 text-blue-800' 
                      : 'bg-pink-100 text-pink-800'
                  }`}>
                    {booking.user.gender}
                  </span>
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    booking.status === 'approved' ? 'bg-green-100 text-green-800' :
                    booking.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {booking.status}
                  </span>
                </div>
              </div>
            </div>
            <div className="text-right">
              <p className="text-lg font-semibold text-gray-900">
                ${booking.ticketPrice}
              </p>
              <p className="text-gray-600">
                {new Date(booking.appointmentDate).toLocaleDateString()} • {booking.timeSlot?.startingTime} - {booking.timeSlot?.endingTime}
              </p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
          <div className="flex flex-wrap gap-4">
            <button
              onClick={handleViewAiAnalysis}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              View AI Analysis
            </button>
            <button
              onClick={handleReferToDoctor}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              Refer to Doctor
            </button>
            <button
              onClick={handleSendResponse}
              className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
            >
              Send Response
            </button>
            <button
              onClick={() => setIsChatOpen(!isChatOpen)}
              className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
            >
              {isChatOpen ? 'Close Chat' : 'Open Medical Assistant'}
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Patient Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Medical Information */}
          <div className="bg-white shadow rounded-lg">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Medical Information</h2>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">Blood Type</label>
                  <p className="mt-1 text-gray-900">{booking.user.bloodType || 'Not specified'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Age</label>
                  <p className="mt-1 text-gray-900">{booking.user.age || 'Not specified'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Allergies</label>
                  <p className="mt-1 text-gray-900">{booking.user.allergies || 'None reported'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Chronic Conditions</label>
                  <p className="mt-1 text-gray-900">{booking.user.chronicConditions || 'None reported'}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Appointment Notes */}
          <div className="bg-white shadow rounded-lg">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Appointment Notes</h2>
            </div>
            <div className="p-6">
              <p className="text-gray-700">
                {booking.notes || 'No notes available for this appointment.'}
              </p>
            </div>
          </div>
        </div>

        {/* Chatbot Sidebar */}
        {isChatOpen && (
          <div className="bg-white shadow rounded-lg h-fit sticky top-6">
            <div className="px-6 py-4 border-b border-gray-200 bg-blue-600 text-white rounded-t-lg">
              <h2 className="text-lg font-semibold">Medical Assistant</h2>
              <p className="text-sm opacity-90">AI-powered medical guidance</p>
            </div>
            
            <div className="h-96 overflow-y-auto p-4">
              <div className="space-y-4">
                {chatMessages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.isBot ? 'justify-start' : 'justify-end'}`}
                  >
                    <div
                      className={`max-w-xs lg:max-w-md rounded-lg px-4 py-2 ${
                        message.isBot
                          ? 'bg-blue-100 text-gray-800'
                          : 'bg-blue-600 text-white'
                      }`}
                    >
                      <p className="text-sm">{message.text}</p>
                      <p className={`text-xs mt-1 ${
                        message.isBot ? 'text-gray-500' : 'text-blue-200'
                      }`}>
                        {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-4 border-t border-gray-200">
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Type your message..."
                  className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  onClick={handleSendMessage}
                  disabled={!newMessage.trim()}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Send
                </button>
              </div>
              
              {/* Quick Suggestions */}
              <div className="mt-3 flex flex-wrap gap-2">
                <button
                  onClick={() => setNewMessage("What are the possible diagnoses?")}
                  className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded hover:bg-gray-200"
                >
                  Possible diagnoses?
                </button>
                <button
                  onClick={() => setNewMessage("Treatment options?")}
                  className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded hover:bg-gray-200"
                >
                  Treatment options
                </button>
                <button
                  onClick={() => setNewMessage("Emergency signs to watch for?")}
                  className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded hover:bg-gray-200"
                >
                  Emergency signs
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Bookings;