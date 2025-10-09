// src/utils/getUserId.js
export const getUserId = () => {
  try {
    const raw = localStorage.getItem("user");
    if (!raw) return null;
    const user = JSON.parse(raw);
    return user?._id || null;
  } catch (err) {
    return null;
  }



};

export const getUser = () => {
  try {
    const raw = localStorage.getItem("user");
    if (!raw) return null;
    return JSON.parse(raw); // returns {_id, name, email}
  } catch (err) {
    return null;
  }
};

