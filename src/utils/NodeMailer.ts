import * as nodeMailer from 'nodemailer';
import * as SendGrid from 'nodemailer-sendgrid-transport';

export class NodeMailer {
    private static initializeTransport() {
        return nodeMailer.createTransport(SendGrid({
            auth: {
                // api_user: 'apikey',
                api_key: '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'
            }
        }))
    }

    static sendEmail(data: {to: [string], subject: string, html: string}):Promise<any> {
        return NodeMailer.initializeTransport().sendMail({
            from: 'hg94543@gmail.com',
            to: data.to,
            subject: data.subject,
            html: data.html
        })
    }
}