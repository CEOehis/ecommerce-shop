import emailTemplate from '../utils/emailTemplate';

const sgMail = require('@sendgrid/mail');

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

class MailingController {
  static sendMail(email, receiptUrl) {
    const msg = {
      to: email,
      from: 'noreply@shopmate.com',
      subject: 'Your shopmate order has been confirmed',
      html: emailTemplate.orderConfirmation(receiptUrl),
    };
    sgMail.send(msg);
  }
}

export default MailingController;
