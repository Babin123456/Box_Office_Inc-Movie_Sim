import GameState from "../models/GameState.js";
import { unreadCount } from "../services/notification/notificationService.js";

const findUserGameState = async (userId) => {
  const gameState = await GameState.findOne({
    user: userId,
  });

  return gameState;
};

const sendGameStateNotFound = (res) =>
  res.status(404).json({
    message: "Game state not found",
  });

export const getNotifications = async (req, res) => {
  const gameState = await findUserGameState(req.user._id);

  if (!gameState) {
    return sendGameStateNotFound(res);
  }

  res.json({
    notifications: gameState.notifications,
    unreadCount: unreadCount(gameState.notifications),
  });
};

export const getUnreadNotificationCount = async (req, res) => {
  const gameState = await findUserGameState(req.user._id);

  if (!gameState) {
    return sendGameStateNotFound(res);
  }

  res.json({
    unreadCount: unreadCount(gameState.notifications),
  });
};

export const markNotificationRead = async (req, res) => {
  const { id } = req.params;

  const gameState = await findUserGameState(req.user._id);

  if (!gameState) {
    return sendGameStateNotFound(res);
  }

  const notification = gameState.notifications.id(id);

  if (!notification) {
    return res.status(404).json({
      message: "Notification not found",
    });
  }

  notification.read = true;

  await gameState.save();

  res.json({
    message: "Notification marked as read",
    unreadCount: unreadCount(gameState.notifications),
  });
};

export const markAllNotificationsRead = async (req, res) => {
  const gameState = await findUserGameState(req.user._id);

  if (!gameState) {
    return sendGameStateNotFound(res);
  }

  gameState.notifications.forEach((notification) => {
    notification.read = true;
  });

  await gameState.save();

  res.json({
    message: "All notifications marked as read",
    unreadCount: unreadCount(gameState.notifications),
  });
};

export const deleteNotification = async (req, res) => {
  const { id } = req.params;

  const gameState = await findUserGameState(req.user._id);

  if (!gameState) {
    return sendGameStateNotFound(res);
  }

  const notificationExists = Boolean(gameState.notifications.id(id));

  if (!notificationExists) {
    return res.status(404).json({
      message: "Notification not found",
    });
  }

  gameState.notifications = gameState.notifications.filter(
    (notification) => notification._id.toString() !== id
  );

  await gameState.save();

  res.json({
    message: "Notification deleted",
    unreadCount: unreadCount(gameState.notifications),
  });
};

export const deleteAllNotifications = async (req, res) => {
  const gameState = await findUserGameState(req.user._id);

  if (!gameState) {
    return sendGameStateNotFound(res);
  }

  const deletedCount = gameState.notifications.length;

  gameState.notifications = [];

  await gameState.save();

  res.json({
    message: "All notifications deleted",
    deletedCount,
    unreadCount: 0,
  });
};
