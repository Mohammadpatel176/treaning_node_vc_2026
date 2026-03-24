const Notification = require("../models/notification_model");
const { logEvent, logError } = require("./logger_service");

//create notification
const createNotification = async (userId, message, type = "SYSTEM", metadata = {}) => {
    try{
        const notification = await Notification.create({
            userId,
            message,
            type,
            metadata
        });

        logEvent(`Notification created: ${message}`, userId);
        return notification;
    }
    catch(err){
        logError("CreateNotification", err, userId);
        throw err;
    }
};

//get all notification for user
const getUserNotifications = async (userId) => {
    try{
        const notifications = await Notification.find({ userId })
          .sort({ createdAt: -1 });
        
          logEvent("Fetched user notifications", userId);

          return notifications;
    }
    catch(err){
        logError("getUserNotifications", err, userId);
        throw err;
    }
};

// marks single notification as read
const markAsRead = async (notificationId, userId) => {
    try{
        const notification = await Notification.findByIdAndUpdate(
            notificationId,
            { isRead: true },
            { new: true }
        );

        logEvent(`Notification marked as read: ${notificationId}`, userId);

        return notification;
    }
    catch(err){
        logError("markAsRead", err, userId);
        throw err;
    }
};

//mark all notification as read

const markAllRead = async (userId) => {
    try{
         await Notification.updateMany(
            { userId, isRead: false },
            { isRead: true }
         );

         logEvent("All notification marked as read", userId);
         return true;
    }
    catch(err){
        logError("markAllRead", err, userId);
        throw err;
    }
};

//delete notification

const deleteNotification = async (notificationId, userId) => {
    try{
        await Notification.findByIdAndDelete(notificationId);

        logEvent(`Notification deleted: ${notificationId}`, userId);

        return true;
    }
    catch(err){
        logError("deleteNotification", err, userId);
        throw err;
    }
};

module.exports = {
    createNotification,
    getUserNotifications,
    markAsRead,
    markAllRead,
    deleteNotification
};