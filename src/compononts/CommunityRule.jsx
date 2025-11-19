import React from "react";

export default function CommunityRule({ open, onClose }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-lg max-w-lg w-full p-6 shadow-lg">
        <h2 className="text-lg font-semibold mb-4 text-green-700">
          Community Guidelines 🌿
        </h2>

        <ol className="list-decimal list-inside text-sm space-y-3 text-gray-700">
          <li>
            <strong>Respectful Participation:</strong>  
            Engage courteously with all members. Offensive language, spam, or
            harassment will not be tolerated.
          </li>

          <li>
            <strong>Issue Submission:</strong>  
            You may anonymously post plant-related issues by uploading a photo
            of the affected plant or describing the problem in words.
          </li>

          <li>
            <strong>Sharing Solutions:</strong>  
            Members can respond with helpful tips, solutions, or advice using
            text or images. Keep your responses constructive and polite.
          </li>

          <li>
            <strong>Community Verification:</strong>  
            Posts that receive the most upvotes are highlighted as{" "}
            <em>“Community Verified.”</em> These represent trusted advice.
          </li>

          <li>
            <strong>Follow-Up Discussions:</strong>  
            Users can continue conversations by asking follow-up questions or
            seeking clarification through discussion threads.
          </li>

          <li>
            <strong>Moderation Policy:</strong>  
            Messages that receive <strong>15 or more downvotes</strong> will be
            automatically removed to maintain discussion quality.
          </li>

          <li>
            <strong>Flagged Content:</strong>  
            Any flagged post is sent to the admin for review and will be hidden
            until moderation is complete.
          </li>

          <li>
            <strong>Notifications:</strong>  
            Members receive real-time updates for new replies, upvotes, or
            related discussions.
          </li>
        </ol>

        <div className="mt-6 text-right">
          <button
            onClick={onClose}
            className="bg-black text-white rounded-[20px] px-4 py-2 hover:bg-gray-800 transition"
          >
            OK
          </button>
        </div>
      </div>
    </div>
  );
}
