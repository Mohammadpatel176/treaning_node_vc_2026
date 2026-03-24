const Notification = require("../models/notification_model");
const log = require("./logger_service");

//create notification
const createNotification = async (userId, message, type = "SYSTEM", metadata = {}) => {
    try{
        const notification = await Notification.create({
            userId,
            message,
            type,
            metadata
        });

        log.success(`Notification created: ${message} | User: ${userId}`);
        return notification;
    }
    catch(err){
        log.error(`CreateNotification Error: ${err.message} | User: ${userId}`);
        throw err;
    }
};

//get all notification for user
const getUserNotifications = async (userId) => {
    try{
        const notifications = await Notification.find({ userId })
          .sort({ createdAt: -1 });
        
          log.info(`Fetched user notifications | User: ${userId}`);

          return notifications;
    }
    catch(err){
        log.error(`getUserNotifications ${err.message} | User: ${userId}`);
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

        log.info(`Notification marked as read: ${notificationId} | User: ${userId}`);

        return notification;
    }
    catch(err){
        log.error(`markAsRead: ${err.message} | User: ${userId}`);
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

         log.info(`All notification marked as read: | User: ${userId}`);
         return true;
    }
    catch(err){
        log.error(`markAllRead: ${err.message} | User: ${userId}`);
        throw err;
    }
};

//delete notification

const deleteNotification = async (notificationId, userId) => {
    try{
        await Notification.findByIdAndDelete(notificationId);

        log.warn(`Notification deleted: ${notificationId} | User: ${userId}`);

        return true;
    }
    catch(err){
        log.error(`deleteNotification:  ${err.message} | User: ${userId}`);
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