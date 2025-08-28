// import React, { useState, useRef, useEffect } from "react";
// import Title from "../compononts/Title";

// function CommunityChat() {
//   const [joined, setJoined] = useState(false);
//   const [username, setUsername] = useState("");
//   const [message, setMessage] = useState("");
//   const [image, setImage] = useState(null);
//   const [messages, setMessages] = useState([
//     {
//       user: "EcoBotanica Team",
//       text: "Welcome to the EcoBotanica Community! 🌱 Share your plant tips here.",
//       upvotes: 0,
//       downvotes: 0,
//     },
//   ]);

//   const [reportingIndex, setReportingIndex] = useState(null);
//   const [reportReason, setReportReason] = useState("");
//   const [customReason, setCustomReason] = useState("");
//   const [reports, setReports] = useState([]); // local storage for reports

//   const chatEndRef = useRef(null);

//   useEffect(() => {
//     chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
//   }, [messages]);

//   const handleJoin = () => {
//     if (username.trim() !== "") {
//       setJoined(true);
//     }
//   };

//   const handleSend = () => {
//     if (message.trim() === "" && !image) return;

//     const newMsg = {
//       user: username,
//       text: message,
//       image: image,
//       upvotes: 0,
//       downvotes: 0,
//     };
//     setMessages([...messages, newMsg]);
//     setMessage("");
//     setImage(null);
//   };

//   const handleImageUpload = (e) => {
//     const file = e.target.files[0];
//     if (file && file.type.startsWith("image/")) {
//       const reader = new FileReader();
//       reader.onloadend = () => {
//         setImage(reader.result);
//       };
//       reader.readAsDataURL(file);
//     }
//   };

//   const handleVote = (index, type) => {
//     const updatedMessages = [...messages];
//     if (type === "up") {
//       updatedMessages[index].upvotes += 1;
//     } else {
//       updatedMessages[index].downvotes += 1;
//     }
//     setMessages(updatedMessages);
//   };

//   const handleReportSubmit = (index) => {
//     if (!reportReason) return alert("Please select a reason to report.");

//     const msg = messages[index];
//     const reasonToSave = reportReason === "other" ? customReason : reportReason;

//     const newReport = {
//       reportedBy: username,
//       reportedUser: msg.user,
//       reason: reasonToSave,
//       messageText: msg.text,
//     };

//     setReports([...reports, newReport]);

//     // Reset
//     setReportingIndex(null);
//     setReportReason("");
//     setCustomReason("");

//     console.log("Reports stored locally:", newReport);
//   };

//   if (!joined) {
//     return (
//       <div className="max-w-md mx-auto mt-20 bg-white border rounded-lg p-6 shadow-lg">
//         <div className="text-2xl mb-4">
//           <Title text1={" JOIN COMMUNITY"} text2={"CHAT"} />
//         </div>
//         <input
//           type="text"
//           placeholder="Enter your name"
//           value={username}
//           onChange={(e) => setUsername(e.target.value)}
//           onKeyDown={(e) => {
//             if (e.key === "Enter") handleJoin();
//           }}
//           className="w-full border border-gray-300 rounded px-4 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-black"
//         />
//         <div className="flex justify-center">
//           <button
//             onClick={handleJoin}
//             className="w-auto flex justify-center items-center gap-2 px-5 py-2 rounded-full bg-black text-white text-sm hover:bg-gray-800 transition"
//           >
//             ✅ Join Chat
//           </button>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="flex flex-col h-[70vh] max-w-2xl mx-auto mt-10 bg-white border border-gray-200 rounded-lg shadow-md p-4">
//       <div className="text-2xl mb-4">
//         <Title text1={"COMMUNITY"} text2={"CHAT"} />
//       </div>
//       <div className="flex-1 overflow-y-auto bg-gray-50 border border-gray-200 rounded-lg p-3 space-y-2">
//         {messages.map((msg, index) => (
//           <div
//             key={index}
//             className={`p-2 rounded-md ${
//               msg.user === username
//                 ? "bg-green-100 self-end text-right ml-auto"
//                 : "bg-gray-100 self-start text-left"
//             } max-w-max max-w-[80%]`}
//           >
//             <p className="text-sm font-semibold text-green-700">{msg.user}</p>
//             <p className="text-gray-800 whitespace-pre-wrap break-words">
//               {msg.text}
//             </p>
//             {msg.image && (
//               <img
//                 src={msg.image}
//                 alt="Uploaded"
//                 className="mt-2 rounded-md max-h-40"
//               />
//             )}
//             <div className="mt-2 flex items-center gap-3 text-sm text-gray-600">
//               <button onClick={() => handleVote(index, "up")}>
//                 👍 {msg.upvotes}
//               </button>
//               <button onClick={() => handleVote(index, "down")}>
//                 👎 {msg.downvotes}
//               </button>
//               {msg.user !== username && (
//                 <button
//                   onClick={() =>
//                     setReportingIndex(reportingIndex === index ? null : index)
//                   }
//                   className="text-red-600 hover:underline"
//                 >
//                   🚩 Report
//                 </button>
//               )}
//             </div>

//             {reportingIndex === index && (
//               <div className="mt-2 p-2 border rounded bg-white shadow-sm">
//                 <label className="text-sm block mb-1">Reason:</label>
//                 <select
//                   value={reportReason}
//                   onChange={(e) => setReportReason(e.target.value)}
//                   className="border w-full rounded px-2 py-1 mb-2"
//                 >
//                   <option value="">-- Select reason --</option>
//                   <option value="spam">Spam</option>
//                   <option value="abuse">Abusive Content</option>
//                   <option value="misinfo">Misinformation</option>
//                   <option value="other">Other</option>
//                 </select>

//                 {reportReason === "other" && (
//                   <input
//                     type="text"
//                     placeholder="Type your reason"
//                     value={customReason}
//                     onChange={(e) => setCustomReason(e.target.value)}
//                     className="border w-full rounded px-2 py-1 mb-2"
//                   />
//                 )}

//                 <div className="flex gap-2">
//                   <button
//                     onClick={() => handleReportSubmit(index)}
//                     className="bg-red-600 text-white px-3 py-1 rounded text-sm"
//                   >
//                     Submit
//                   </button>
//                   <button
//                     onClick={() => setReportingIndex(null)}
//                     className="bg-gray-300 px-3 py-1 rounded text-sm"
//                   >
//                     Cancel
//                   </button>
//                 </div>
//               </div>
//             )}
//           </div>
//         ))}
//         <div ref={chatEndRef} />
//       </div>

//       <div className="flex items-center mt-4 gap-2 relative">
//         <input
//           type="file"
//           accept="image/*"
//           onChange={handleImageUpload}
//           className="hidden"
//           id="upload"
//         />
//         <label
//           htmlFor="upload"
//           className="relative group cursor-pointer px-3 py-2 bg-gray-200 rounded-md text-sm hover:bg-gray-300 transition"
//         >
//           📁
//           <span className="absolute bottom-full mb-1 left-1/2 transform -translate-x-1/2 text-xs text-white bg-black px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition pointer-events-none z-10 whitespace-nowrap">
//             Attach an image
//           </span>
//         </label>

//         <input
//           type="text"
//           placeholder="Write a message..."
//           value={message}
//           onChange={(e) => setMessage(e.target.value)}
//           onKeyDown={(e) => {
//             if (e.key === "Enter") handleSend();
//           }}
//           className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-black"
//         />

//         <button
//           onClick={handleSend}
//           className="bg-black hover:bg-gray-800 text-white px-4 py-2 rounded-full text-sm transition flex items-center gap-2"
//         >
//           <span>Send</span> <span>📨</span>
//         </button>
//       </div>

//       {image && (
//         <div className="mt-2 text-sm text-gray-600">📷 Image attached</div>
//       )}
//     </div>
//   );
// }

// export default CommunityChat;




// new wla community with implementation of socketss

import React, { useState, useRef, useEffect } from "react";
import Title from "../compononts/Title";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function CommunityChat() {
  const [joined, setJoined] = useState(false);
  const [message, setMessage] = useState("");
  const [image, setImage] = useState(null);
  const [messages, setMessages] = useState([
    {
      user: "EcoBotanica Team",
      text: "Welcome to the EcoBotanica Community! 🌱 Share your plant tips here.",
      upvotes: 0,
      downvotes: 0,
    },
  ]);

  const [reportingIndex, setReportingIndex] = useState(null);
  const [reportReason, setReportReason] = useState("");
  const [customReason, setCustomReason] = useState("");
  const [reports, setReports] = useState([]);

  const chatEndRef = useRef(null);
  const navigate = useNavigate();

  // ✅ Check token on mount
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login"); // redirect if not logged in
    } else {
      setJoined(true);
      fetchMessages();
    }
  }, [navigate]);

  // ✅ Auto-scroll
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // ✅ Fetch messages from backend
  const fetchMessages = async () => {
    try {
      const res = await axios.get("http://localhost:4000/api/messages");
      setMessages([
        {
          user: "EcoBotanica Team",
          text: "Welcome to the EcoBotanica Community! 🌱 Share your plant tips here.",
          upvotes: 0,
          downvotes: 0,
        },
        ...res.data,
      ]);
    } catch (err) {
      console.error("Failed to fetch messages", err);
    }
  };

  // ✅ Send message (to backend)
  const handleSend = async () => {
    if (message.trim() === "" && !image) return;

    const token = localStorage.getItem("token");
    if (!token) return navigate("/login");

    try {
      const newMsg = { text: message, image, user: "You" }; // user name backend se resolve hoga

      await axios.post(
        "http://localhost:4000/api/messages",
        { text: message, image },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setMessages([...messages, newMsg]);
      setMessage("");
      setImage(null);
    } catch (err) {
      console.error("Error sending message", err);
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleVote = (index, type) => {
    const updatedMessages = [...messages];
    if (type === "up") {
      updatedMessages[index].upvotes += 1;
    } else {
      updatedMessages[index].downvotes += 1;
    }
    setMessages(updatedMessages);
  };

  const handleReportSubmit = async (index) => {
    if (!reportReason) return alert("Please select a reason to report.");

    const token = localStorage.getItem("token");
    if (!token) return navigate("/login");

    const msg = messages[index];
    const reasonToSave = reportReason === "other" ? customReason : reportReason;

    const newReport = {
      reportedUser: msg.user,
      reason: reasonToSave,
      messageText: msg.text,
    };

    try {
      await axios.post("http://localhost:4000/api/report", newReport, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setReports([...reports, newReport]);
    } catch (err) {
      console.error("Failed to submit report", err);
    }

    setReportingIndex(null);
    setReportReason("");
    setCustomReason("");
  };

  // ✅ Remove old join-screen (no need for name input)
  if (!joined) {
    return null; // handled by useEffect redirect
  }

  return (
    <div className="flex flex-col h-[70vh] max-w-2xl mx-auto mt-10 bg-white border border-gray-200 rounded-lg shadow-md p-4">
      <div className="text-2xl mb-4">
        <Title text1={"COMMUNITY"} text2={"CHAT"} />
      </div>
      <div className="flex-1 overflow-y-auto bg-gray-50 border border-gray-200 rounded-lg p-3 space-y-2">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`p-2 rounded-md ${
              msg.user === "You"
                ? "bg-green-100 self-end text-right ml-auto"
                : "bg-gray-100 self-start text-left"
            } max-w-max max-w-[80%]`}
          >
            <p className="text-sm font-semibold text-green-700">{msg.user}</p>
            <p className="text-gray-800 whitespace-pre-wrap break-words">
              {msg.text}
            </p>
            {msg.image && (
              <img
                src={msg.image}
                alt="Uploaded"
                className="mt-2 rounded-md max-h-40"
              />
            )}
            <div className="mt-2 flex items-center gap-3 text-sm text-gray-600">
              <button onClick={() => handleVote(index, "up")}>
                👍 {msg.upvotes}
              </button>
              <button onClick={() => handleVote(index, "down")}>
                👎 {msg.downvotes}
              </button>
              {msg.user !== "You" && (
                <button
                  onClick={() =>
                    setReportingIndex(reportingIndex === index ? null : index)
                  }
                  className="text-red-600 hover:underline"
                >
                  🚩 Report
                </button>
              )}
            </div>

            {reportingIndex === index && (
              <div className="mt-2 p-2 border rounded bg-white shadow-sm">
                <label className="text-sm block mb-1">Reason:</label>
                <select
                  value={reportReason}
                  onChange={(e) => setReportReason(e.target.value)}
                  className="border w-full rounded px-2 py-1 mb-2"
                >
                  <option value="">-- Select reason --</option>
                  <option value="spam">Spam</option>
                  <option value="abuse">Abusive Content</option>
                  <option value="misinfo">Misinformation</option>
                  <option value="other">Other</option>
                </select>

                {reportReason === "other" && (
                  <input
                    type="text"
                    placeholder="Type your reason"
                    value={customReason}
                    onChange={(e) => setCustomReason(e.target.value)}
                    className="border w-full rounded px-2 py-1 mb-2"
                  />
                )}

                <div className="flex gap-2">
                  <button
                    onClick={() => handleReportSubmit(index)}
                    className="bg-red-600 text-white px-3 py-1 rounded text-sm"
                  >
                    Submit
                  </button>
                  <button
                    onClick={() => setReportingIndex(null)}
                    className="bg-gray-300 px-3 py-1 rounded text-sm"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
        <div ref={chatEndRef} />
      </div>

      <div className="flex items-center mt-4 gap-2 relative">
        <input
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          className="hidden"
          id="upload"
        />
        <label
          htmlFor="upload"
          className="relative group cursor-pointer px-3 py-2 bg-gray-200 rounded-md text-sm hover:bg-gray-300 transition"
        >
          📁
          <span className="absolute bottom-full mb-1 left-1/2 transform -translate-x-1/2 text-xs text-white bg-black px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition pointer-events-none z-10 whitespace-nowrap">
            Attach an image
          </span>
        </label>

        <input
          type="text"
          placeholder="Write a message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") handleSend();
          }}
          className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-black"
        />

        <button
          onClick={handleSend}
          className="bg-black hover:bg-gray-800 text-white px-4 py-2 rounded-full text-sm transition flex items-center gap-2"
        >
          <span>Send</span> <span>📨</span>
        </button>
      </div>

      {image && (
        <div className="mt-2 text-sm text-gray-600">📷 Image attached</div>
      )}
    </div>
  );
}

export default CommunityChat;
