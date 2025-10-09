import Alarm from "../models/alarmModel.js"; // example
import Calendar from "../models/calendarModel.js";
import Message from "../models/message.js";
import Order from "../models/orderModel.js";
// add other models as needed

export const deleteUserRelatedData = async (userId) => {
  // Add as many collections as you have storing data by userId
  await Promise.all([
    Alarm.deleteMany({ userId }),
    Calendar.deleteMany({ userId }),
    Message.deleteMany({ userId }),
    Order.deleteMany({ userId }),
    // ...other deletes
  ]);
};
