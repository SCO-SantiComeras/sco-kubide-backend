export const HTTP_ERROR_CONSTANTS = {
  USERS: {
    USER_NOT_FOUND: 'User not found',
    USER_ALREADY_EXIST: 'User already exist',
    EMAIL_ALREADY_EXIST: 'Email already registered',
    CREATE_USER_ERROR: 'Unnable to create user',
    UPDATE_USER_ERROR: 'Unnable to update user',
  },
  AUTH: {
    INVALID_CREDENTIALS: 'Invalid credentials',
    UNNABLE_USER_TOKEN: 'Unnable to generate user token',
    UNAUTHORIZED: 'Unauthorized',
  },
  MESSAGES: {
    MESSAGE_NOT_FOUND: 'Message not found',
    CREATE_MESSAGE_ERROR: 'Unnable to create message',
    UPDATE_MESSAGE_ERROR: 'Unnable to update message',
    DELETE_MESSAGE_ERROR: 'Unnable to delete message',
    SEND_MESSAGE_ERROR: 'Unnable to send message',
    USER_MESSAGES_NOT_ACTIVED: 'Destination user state inactived'
  },
};
  