// src/components/complaints/ComplaintsTable.jsx
import React from "react";
import ComplaintRow from "./ComplaintRow";

/**
 * ComplaintsTable props:
 *  - complaints: array
 *  - onResolve(id)
 *  - onBlockUser(userId)
 *  - onIssueWarning(userId)
 */
const ComplaintsTable = ({ complaints, onResolve, onBlockUser, onIssueWarning }) => {
  return (
    <div className="overflow-x-auto shadow-lg rounded-lg bg-white">
      <table className="min-w-full">
        <thead>
          <tr className="bg-green-100 text-gray-700 uppercase text-sm leading-normal">
            <th className="py-3 px-6 text-left">Registered By</th>
            <th className="py-3 px-6 text-left">Against User</th>
            <th className="py-3 px-6 text-left">Reason</th>
            <th className="py-3 px-6 text-left">Message</th>
            <th className="py-3 px-6 text-center">Actions</th>
          </tr>
        </thead>

        <tbody className="text-gray-600 text-sm">
          {complaints.length ? (
            complaints.map((c) => (
              <ComplaintRow
                key={c.id}
                complaint={c}
                onResolve={onResolve}
                onBlockUser={onBlockUser}
                onIssueWarning={onIssueWarning}
              />
            ))
          ) : (
            <tr>
              <td colSpan="5" className="py-8 text-center text-gray-500 italic">
                No complaints found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ComplaintsTable;
