import User from "../models/User";
import { NodeMailer } from "../utils/NodeMailer";
import { Utils } from "../utils/Utils";

export class UserController {
    static async signUp(req, res, next): Promise<void> {

        const username = req.body.username;
        const email = req.body.email;
        const password = req.body.password;
        
        const verificationToken  = Utils.generateVerificationToken();

        const data = {
            username,
            email,
            password,
            verification_token: verificationToken,
            verification_token_time: Date.now() + new Utils().MAX_TOKEN_TIME
        }

        try {
            let user = await new User(data).save();
            res.send(user);
            await NodeMailer.sendEmail({to: ['hg94543@gmail.com'], subject: `email testing`, html: `<h1>${verificationToken}</h1>`})
        } catch (err) {
            next(err);
        }
    }

    static async verify(req, res, next) {
        const verificationToken = req.body.verification_token;
        const email = req.body.email;

        try {
            const user = await User.findOneAndUpdate({ email: email, verification_token: verificationToken, verification_token_time: { $gt: Date.now() + new Utils().MAX_TOKEN_TIME } }, {verified: true}, {new: true});

            if (user) {
                res.send(user);
            } else {
                throw new Error('Verification Token Is Expired. Please Request For a new One')
            }
        } catch (e) {
            next(e);
        }
    }

    static async resendVerificationEmail(req, res, next) {
        const email = req.query.email;
        const verificationToken = Utils.generateVerificationToken();
        
        try {
            const user = await User.findOneAndUpdate({email: email}, {verification_token: verificationToken, verification_token_time: Date.now() + new Utils().MAX_TOKEN_TIME});

            if(user) {
                const mailer = await NodeMailer.sendEmail({
                    to: [user.email],
                    subject: 'Email Verification',
                    html: `<h1>${verificationToken}</h1>`
                })

                res.json({
                    success: true
                })
            }else {
                throw new Error('User Does Not Exist')
            }
        } catch (e) {
            next(e);
        }
    }
}