const asyncHandler = require('express-async-handler');
const notificationService = require('../services/notificationService');
const { success, paginated } = require('../utils/apiResponse');

// @desc    Get notifications for the logged-in farmer
// @route   GET /api/notifications
// @access  Private
const getNotifications = asyncHandler(async (req, res) => {
  const { page = 1, limit = 20, unreadOnly } = req.query;
  const result = await notificationService.getNotifications(req.farmer._id, {
    page,
    limit,
    unreadOnly: unreadOnly === 'true',
  });
  paginated(
    res,
    {
      notifications: result.notifications,
      unreadCount: result.unreadCount,
    },
    result.page,
    result.limit,
    result.total,
    'Notifications retrieved'
  );
});

// @desc    Mark a notification as read
// @route   PUT /api/notifications/:id/read
// @access  Private
const markAsRead = asyncHandler(async (req, res) => {
  const notification = await notificationService.markAsRead(req.params.id, req.farmer._id);
  success(res, notification, 'Notification marked as read');
});

// @desc    Mark all notifications as read
// @route   PUT /api/notifications/read-all
// @access  Private
const markAllAsRead = asyncHandler(async (req, res) => {
  const result = await notificationService.markAllAsRead(req.farmer._id);
  success(res, result, 'All notifications marked as read');
});

// @desc    Delete a notification
// @route   DELETE /api/notifications/:id
// @access  Private
const deleteNotification = asyncHandler(async (req, res) => {
  await notificationService.deleteNotification(req.params.id, req.farmer._id);
  success(res, null, 'Notification deleted');
});

module.exports = { getNotifications, markAsRead, markAllAsRead, deleteNotification };
