const Notification = require('../models/Notification');
const { AppError } = require('../middlewares/errorMiddleware');

/**
 * Create a notification for a farmer
 */
const createNotification = async ({ farmerId, type, title, message, relatedModel, relatedId }) => {
  const notification = await Notification.create({
    farmerId,
    type: type || 'Info',
    title,
    message,
    relatedModel: relatedModel || null,
    relatedId: relatedId || null,
  });
  return notification;
};

/**
 * Get notifications for a farmer
 */
const getNotifications = async (farmerId, { page = 1, limit = 20, unreadOnly = false }) => {
  const query = { farmerId };
  if (unreadOnly) query.isRead = false;

  const skip = (page - 1) * limit;
  const total = await Notification.countDocuments(query);
  const unreadCount = await Notification.countDocuments({ farmerId, isRead: false });
  const notifications = await Notification.find(query)
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(parseInt(limit));

  return {
    notifications,
    total,
    unreadCount,
    page: parseInt(page),
    limit: parseInt(limit),
  };
};

/**
 * Mark a notification as read
 */
const markAsRead = async (notificationId, farmerId) => {
  const notification = await Notification.findOne({ _id: notificationId, farmerId });
  if (!notification) {
    throw new AppError('Notification not found', 404);
  }
  notification.isRead = true;
  await notification.save();
  return notification;
};

/**
 * Mark all notifications as read for a farmer
 */
const markAllAsRead = async (farmerId) => {
  await Notification.updateMany(
    { farmerId, isRead: false },
    { $set: { isRead: true } }
  );
  return { message: 'All notifications marked as read' };
};

/**
 * Delete a notification
 */
const deleteNotification = async (notificationId, farmerId) => {
  const notification = await Notification.findOneAndDelete({ _id: notificationId, farmerId });
  if (!notification) {
    throw new AppError('Notification not found', 404);
  }
  return notification;
};

module.exports = {
  createNotification,
  getNotifications,
  markAsRead,
  markAllAsRead,
  deleteNotification,
};
