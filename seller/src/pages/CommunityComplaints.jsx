import React, { useMemo, useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";

const CommunityComplaints = () => {
  const [reports, setReports] = useState([]);
  const [filter, setFilter] = useState("All");
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);

  // Fetch reports from backend
  const fetchReports = async () => {
    try {
      const response = await axios.get("http://localhost:4000/api/reports");
      setReports(response.data);
    } catch (error) {
      console.error("Failed to fetch reports:", error);
      toast.error("Failed to load reports");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  // Filtered reports
  const filteredReports = useMemo(() => {
    if (filter === "All") return reports;
    return reports.filter((report) => 
      report.reason.toLowerCase().includes(filter.toLowerCase())
    );
  }, [filter, reports]);

  // RESOLVE BY DELETING MESSAGE ONLY
  const handleDeleteMessage = async (id) => {
    setActionLoading(id);
    try {
      await axios.delete(`http://localhost:4000/api/reports/resolve-message/${id}`);
      setReports(prev => prev.filter(report => report._id !== id));
      toast.success("Message deleted and report resolved!");
    } catch (error) {
      console.error("Failed to delete message:", error);
      toast.error("Failed to delete message");
    } finally {
      setActionLoading(null);
    }
  };

  // RESOLVE BY DELETING USER COMPLETELY
  const handleDeleteUser = async (id, username) => {
    if (!window.confirm(`Are you sure you want to DELETE USER "${username}" and all their messages? This action cannot be undone!`)) {
      return;
    }

    setActionLoading(id);
    try {
      await axios.delete(`http://localhost:4000/api/reports/resolve-user/${id}`);
      setReports(prev => prev.filter(report => report._id !== id));
      toast.success(`User "${username}" deleted successfully!`);
    } catch (error) {
      console.error("Failed to delete user:", error);
      toast.error("Failed to delete user");
    } finally {
      setActionLoading(null);
    }
  };

  // DELETE REPORT ONLY (No other action)
  const handleDeleteReport = async (id) => {
    setActionLoading(id);
    try {
      await axios.delete(`http://localhost:4000/api/reports/${id}`);
      setReports(prev => prev.filter(report => report._id !== id));
      toast.success("Report deleted successfully!");
    } catch (error) {
      console.error("Failed to delete report:", error);
      toast.error("Failed to delete report");
    } finally {
      setActionLoading(null);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
        <span className="ml-4 text-gray-600">Loading reports...</span>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className="p-6"
    >
      <ToastContainer position="top-right" />

      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Community Reports</h2>
          <p className="text-gray-600 text-sm mt-1">
            Manage user reports and take appropriate actions
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-sm text-gray-600">Filter:</div>
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            <option value="All">All</option>
            <option value="abuse">Abuse</option>
            <option value="spam">Spam</option>
            <option value="misinfo">Misinformation</option>
            <option value="other">Other</option>
          </select>
        </div>
      </div>

      {/* Reports Table */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        {filteredReports.length === 0 ? (
          <div className="p-8 text-center">
            <div className="text-gray-400 text-6xl mb-4">📝</div>
            <h3 className="text-lg font-semibold text-gray-600 mb-2">No reports found</h3>
            <p className="text-gray-500">All clear! No reports to display.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Reported By</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Reported User</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Reason</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Message</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredReports.map((report) => (
                  <tr key={report._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {report.reportedBy}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-red-600">
                        {report.reportedUser}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        report.reason === 'abuse' ? 'bg-red-100 text-red-800' :
                        report.reason === 'spam' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-blue-100 text-blue-800'
                      }`}>
                        {report.reason}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900 max-w-xs">
                        "{report.messageText}"
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">
                        {new Date(report.createdAt).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex flex-col gap-2">
                        {/* Delete Message Only */}
                        <button
                          onClick={() => handleDeleteMessage(report._id)}
                          disabled={actionLoading === report._id}
                          className="text-green-600 hover:text-green-900 bg-green-50 hover:bg-green-100 px-3 py-2 rounded text-xs transition-colors disabled:opacity-50"
                        >
                          {actionLoading === report._id ? (
                            <span>Deleting...</span>
                          ) : (
                            <span>🗑️ Delete Message</span>
                          )}
                        </button>

                        {/* Delete User Completely */}
                        <button
                          onClick={() => handleDeleteUser(report._id, report.reportedUser)}
                          disabled={actionLoading === report._id}
                          className="text-red-600 hover:text-red-900 bg-red-50 hover:bg-red-100 px-3 py-2 rounded text-xs transition-colors disabled:opacity-50"
                        >
                          {actionLoading === report._id ? (
                            <span>Deleting...</span>
                          ) : (
                            <span>⛔ Delete User</span>
                          )}
                        </button>

                        {/* Delete Report Only */}
                        <button
                          onClick={() => handleDeleteReport(report._id)}
                          disabled={actionLoading === report._id}
                          className="text-gray-600 hover:text-gray-900 bg-gray-50 hover:bg-gray-100 px-3 py-2 rounded text-xs transition-colors disabled:opacity-50"
                        >
                          {actionLoading === report._id ? (
                            <span>Deleting...</span>
                          ) : (
                            <span>📝 Delete Report Only</span>
                          )}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Action Guide */}
      <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
        <h3 className="font-semibold text-blue-800 mb-2">Action Guide:</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div className="flex items-start gap-2">
            <span className="text-green-600 mt-1">🗑️</span>
            <div>
              <span className="font-medium">Delete Message:</span>
              <p className="text-blue-700">Removes only the reported message</p>
            </div>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-red-600 mt-1">⛔</span>
            <div>
              <span className="font-medium">Delete User:</span>
              <p className="text-blue-700">Deletes user account and all their messages</p>
            </div>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-gray-600 mt-1">📝</span>
            <div>
              <span className="font-medium">Delete Report Only:</span>
              <p className="text-blue-700">Removes only this report, no other action</p>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default CommunityComplaints;