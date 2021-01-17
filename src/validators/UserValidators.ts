import { body, query } from "express-validator";
import User from "../models/User";

export class UserValidators {
  static signUp() {
    return [
      body("username", "Username is Required").isString(),
      body("email", "Email is Required")
        .isEmail()
        .custom((email, { req }) => {
          return User.findOne({ email }).then((user) => {
            if (user) {
              throw new Error("User Already Exist");
            } else {
              return true;
            }
          });
        }),
      body("password", "Password is Required")
        .isAlphanumeric()
        .isLength({ min: 8, max: 20 })
        .withMessage("Password can be from 8-20 Charactors"),
    ];
  }

  static verifyUser() {
    return [
      body("verification_token", "Verification Token is Required").isNumeric(),
    ];
  }

  static resendVerificationEmail() {
    return [query("email", "Email is Required").isEmail()];
  }

  static login() {
    return [
      query("email", "Email is Required")
        .isEmail()
        .custom((email, { req }) => {
          return User.findOne({ email }).then((user) => {
            if (user) {
              req.user = user;
              return true;
            } else {
              throw new Error("User Does Not Exist");
            }
          });
        }),
      query("password", "Password is Required").isAlphanumeric(),
    ];
  }

  static updatePassword() {
    return [
      body("password", "Password is Required").isAlphanumeric(),
      body("confirm_password", "Confirm Password is Required").isAlphanumeric(),
      body("new_password", "New Password is Required")
        .isAlphanumeric()
        .custom((newPassword, { req }) => {
          if (newPassword === req.body.confirm_password) {
            return true;
          } else {
            req.errorStatus = 422;
            throw new Error("Password and Confirm Password Does Not Match");
          }
        }),
    ];
  }

  static resetPassword() {
    return [
      body("email", "Email is Required")
        .isEmail()
        .custom((email, { req }) => {
          return User.findOne({ email }).then((user) => {
            if (user) {
              req.user = user;
              return true;
            } else {
              throw new Error("User Does Not Exist");
            }
          });
        }),
      body("new_password", "New Password is Required")
        .isAlphanumeric()
        .custom((newPassword, { req }) => {
          if (newPassword === req.body.confirm_password) {
            return true;
          } else {
            throw new Error("Confirm Password and New Password Does not Match");
          }
        }),
      body("confirm_password", "confirm Password is Required").isAlphanumeric(),
      body("reset_password_token", "Reset Password Token is Required")
        .isAlphanumeric()
        .custom((token, { req }) => {
          if (req.body.reset_password_token === token) {
            return true;
          } else {
            req.errorStatus = 422;
            throw new Error("Reset Password is Not Invaild.Please Try Again");
          }
        }),
    ];
  }

  static sendResetPasswordEmail() {
    return [
      query("email", "Email is Required")
        .isEmail()
        .custom((email, { req }) => {
          return User.findOne({ email }).then((user) => {
            if (user) {
              return true;
            } else {
              throw new Error("User Does not Exist");
            }
          });
        }),
    ];
  }

  static verifyReserPasswordToken() {
    return [
      query("reset_password_token", "Reset Password Token is Required")
        .isNumeric()
        .custom((token, { req }) => {
          return User.findOne({
            reset_password_token: token,
            reset_password_token_time: { $gt: Date.now() },
          }).then((user) => {
            if (user) {
              return true;
            } else {
              throw new Error(
                "Token Does Not Exist. Please Request For a New One"
              );
            }
          });
        }),
    ];
  }

  static updateProfilePic() {
    return[
      body('profile_pic').custom((profilePic, {req}) => {
        if(req.file) {
          return true;
        }else {
          throw new Error('File not Uploaded');
        }
      })
    ]
  }
}
