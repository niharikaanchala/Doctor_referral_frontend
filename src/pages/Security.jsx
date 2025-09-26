import React from "react";
import { Shield, Lock, Eye, FileText, Database, AlertTriangle } from "lucide-react";

const Security = () => {
  return (
    <section className="py-20 bg-gray-50">
      <div className="container text-center">
        {/* Header */}
        <div className="flex flex-col items-center">
          <Shield className="w-10 h-10 text-blue-700 mb-3" />
          <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900">
            Security & Compliance
          </h2>
          <p className="mt-3 text-lg text-gray-600 max-w-3xl mx-auto">
            Your health data security is our top priority. We implement
            industry-leading security measures and maintain strict compliance standards.
          </p>
        </div>

        {/* Features Grid */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
          {/* Card 1 */}
          <div className="flex items-start p-6 bg-white shadow rounded-2xl text-left">
            <span className="p-3 bg-teal-50 rounded-xl">
              <Lock className="w-6 h-6 text-blue-700" />
            </span>
            <div className="ml-4">
              <h3 className="font-semibold text-gray-900">End-to-End Encryption</h3>
              <p className="text-gray-600 text-sm mt-1">
                All data encrypted in transit and at rest using industry-standard protocols
              </p>
            </div>
          </div>

          {/* Card 2 */}
          <div className="flex items-start p-6 bg-white shadow rounded-2xl text-left">
            <span className="p-3 bg-teal-50 rounded-xl">
              <Eye className="w-6 h-6 text-blue-700" />
            </span>
            <div className="ml-4">
              <h3 className="font-semibold text-gray-900">Role-Based Access</h3>
              <p className="text-gray-600 text-sm mt-1">
                Granular permissions ensure only authorized users access specific data
              </p>
            </div>
          </div>

          {/* Card 3 */}
          <div className="flex items-start p-6 bg-white shadow rounded-2xl text-left">
            <span className="p-3 bg-teal-50 rounded-xl">
              <FileText className="w-6 h-6 text-blue-700" />
            </span>
            <div className="ml-4">
              <h3 className="font-semibold text-gray-900">Comprehensive Audit Trails</h3>
              <p className="text-gray-600 text-sm mt-1">
                Complete logging of all access and modifications for accountability
              </p>
            </div>
          </div>

          {/* Card 4 */}
          <div className="flex items-start p-6 bg-white shadow rounded-2xl text-left">
            <span className="p-3 bg-teal-50 rounded-xl">
              <Database className="w-6 h-6 text-blue-700" />
            </span>
            <div className="ml-4">
              <h3 className="font-semibold text-gray-900">Secure Data Residency</h3>
              <p className="text-gray-600 text-sm mt-1">
                Your data stays in compliant, certified data centers in your region
              </p>
            </div>
          </div>
        </div>

       {/* Compliance Statement */}
<div className="mt-12 max-w-4xl mx-auto bg-yellow-50 border-l-4 border-yellow-400 shadow-md rounded-lg p-6 flex items-start gap-4">
  <div className="flex-shrink-0">
    <AlertTriangle className="w-7 h-7 text-yellow-500 mt-1" />
  </div>
  <div>
    <h4 className="text-sm font-semibold text-yellow-800 uppercase tracking-wide mb-1">Compliance Statement</h4>
    <p className="text-sm text-gray-700 leading-relaxed">
      Our platform is designed to align with <strong>HIPAA</strong>, <strong>GDPR</strong>, and other international healthcare data protection
      regulations. While we implement robust security measures, this information is for general guidance only and
      does not constitute legal advice. Please consult with your legal team for specific compliance requirements.
    </p>
  </div>
</div>

      </div>
    </section>
  );
};

export default Security;
