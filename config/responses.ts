declare global {
    namespace Express {
      interface Request {
        _notification: notificationRequestData,
        _user: userRequestData,
        _userId: any
      }
    }
}