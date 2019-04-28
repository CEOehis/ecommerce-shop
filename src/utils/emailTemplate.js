const emailTemplate = {
  orderConfirmation: receiptUrl => `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <meta http-equiv="X-UA-Compatible" content="ie=edge">
      <title>Authors Haven Email Template</title>
      <style>
        .container {
          box-sizing: border-box;
          font-family: 'Open Sans','Helvetica Neue','Helvetica',Helvetica,Arial,sans-serif;
          font-size: 16px;
          vertical-align: top;
          padding: 30px;
          max-width: 600px;
          mnargin: auto;
        }
        .header {
          background: #fff;
        }
        .button {
          box-sizing: border-box;
          border-color: #348eda;
          font-weight: 400;
          text-decoration: none;
          display: inline-block;
          color: #ffffff;
          background-color: #348eda;
          border: solid 1px #348eda;
          border-radius: 2px;
          font-size: 14px;
          padding: 12px 45px;
        }
      </style>
    </head>
    <body>
      <section class="container">
        <p>Dear customer,</p>
        <p>Your order 325147299 has been successfully confirmed.</p>
        </p>It will be packaged and shipped as soon as possible. Once this happens you will receive a shipping notification email with tracking information.</p
        <a class="button" href=${receiptUrl}>View Receipt</a>
      </section>
    </body>
    </html>
  `,
};

export default emailTemplate;
