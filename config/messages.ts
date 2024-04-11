interface messageFormat {
  [key: string]: {
    [key: string]: string
  };
}
export default <messageFormat>{
  en: {
    USER_ADDED: 'user added successfully',
    USER_UPDATED: 'user updated successfully',
    USER_DELETED: 'user deleted successfully',
    USER_DETAILS: 'user details',
    USER_SEND_OTP: 'user send otp successfully',
    USER_VERIFY_OTP: 'user verify otp successfully',
    USER_RESET_PASSWORD: 'user reset password successfully',
    USER_RESET_PASSWORD_SUCCESS: 'user reset password successfully',
    USER_RESET_PASSWORD_FAIL: 'user reset password failed',
    USER_LOGIN: 'user login successfully',
    USER_EMAIL_VERIFIED: 'user email is verified'
  },
}