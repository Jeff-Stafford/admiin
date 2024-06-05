export interface GenerateTransactionalEmailTemplate {
  emailBody: string;
}

export const generateTransactionalEmailHTML = ({
  emailBody,
}: GenerateTransactionalEmailTemplate) => {
  return `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <meta name="x-apple-disable-message-reformatting"/>
  <meta http-equiv="Content-Type" content="text/html; charset=UTF-8"/>
  <meta name="color-scheme" content="light dark"/>
  <meta name="supported-color-schemes" content="light dark"/>
  <title>{{template.title}}</title>
  <style type="text/css" rel="stylesheet" media="all">
    @import url('https://fonts.googleapis.com/css?family=Nunito+Sans:400,700&display=swap');

    body {
      width: 100% !important;
      height: 100%;
      margin: 0;
      -webkit-text-size-adjust: none;
      background-color: #F2F4F6;
      color: #51545E;
    }

    a {
      color: #8C52FF;
    }

    a img {
      border: none;
    }

    td {
      word-break: break-word;
    }

    .preheader {
      display: none !important;
      visibility: hidden;
      mso-hide: all;
      font-size: 1px;
      line-height: 1px;
      max-height: 0;
      max-width: 0;
      opacity: 0;
      overflow: hidden;
    }

    body, td, th {
      font-family: 'Nunito Sans', Helvetica, Arial, sans-serif;
    }

    h1 {
      margin-top: 0;
      color: #333333;
      font-size: 22px;
      font-weight: bold;
      text-align: left;
    }

    h2 {
      margin-top: 0;
      color: #333333;
      font-size: 16px;
      font-weight: bold;
      text-align: left;
    }

    h3 {
      margin-top: 0;
      color: #333333;
      font-size: 14px;
      font-weight: bold;
      text-align: left;
    }

    td, th {
      font-size: 16px;
    }

    p, ul, ol, blockquote {
      margin: 0.4em 0 1.1875em;
      font-size: 16px;
      line-height: 1.625;
    }

    p.sub {
      font-size: 13px;
    }

    .align-right {
      text-align: right;
    }

    .align-left {
      text-align: left;
    }

    .align-center {
      text-align: center;
    }

    .u-margin-bottom-none {
      margin-bottom: 0;
    }

    .button {
      width: 100%;
      text-align: center;
      background-color: #8C52FF;
      border-top: 18px solid #8C52FF;
      border-right: 18px solid #8C52FF;
      border-bottom: 18px solid #8C52FF;
      border-left: 18px solid #8C52FF;
      display: inline-block;
      color: #FFFFFF !important;
      text-decoration: none;
      -webkit-text-size-adjust: none;
      box-sizing: border-box;
      font-weight: 600;
    }

    .button--green {
      background-color: #22BC66;
      border-top: 10px solid #22BC66;
      border-right: 18px solid #22BC66;
      border-bottom: 10px solid #22BC66;
      border-left: 18px solid #22BC66;
    }

    .button--red {
      background-color: #FF6136;
      border-top: 10px solid #FF6136;
      border-right: 18px solid #FF6136;
      border-bottom: 10px solid #FF6136;
      border-left: 18px solid #FF6136;
    }

    @media only screen and (max-width: 500px) {
      .button {
        width: 100% !important;
        text-align: center !important;
      }
    }

    .attributes {
      margin: 0 0 21px;
    }

    .attributes_content {
      background-color: #F4F4F7;
      padding: 16px;
    }

    .attributes_item {
      padding: 0;
    }

    .related {
      width: 100%;
      margin: 0;
      padding: 25px 0 0 0;
      -premailer-width: 100%;
      -premailer-cellpadding: 0;
      -premailer-cellspacing: 0;
    }

    .related_item {
      padding: 10px 0;
      color: #CBCCCF;
      font-size: 15px;
      line-height: 18px;
    }

    .related_item-title {
      display: block;
      margin: 0.5em 0 0;
    }

    .related_item-thumb {
      display: block;
      padding-bottom: 10px;
    }

    .related_heading {
      border-top: 1px solid #CBCCCF;
      text-align: center;
      padding: 25px 0 10px;
    }

    .discount {
      width: 100%;
      margin: 0;
      padding: 24px;
      -premailer-width: 100%;
      -premailer-cellpadding: 0;
      -premailer-cellspacing: 0;
      background-color: #F4F4F7;
      border: 2px dashed #CBCCCF;
    }

    .discount_heading {
      text-align: center;
    }

    .discount_body {
      text-align: center;
      font-size: 15px;
    }

    .social {
      width: auto;
    }

    .social td {
      padding: 0;
      width: auto;
    }

    .social_icon {
      height: 20px;
      margin: 0 8px 10px 8px;
      padding: 0;
    }

    .purchase {
      width: 100%;
      margin: 0;
      padding: 35px 0;
      -premailer-width: 100%;
      -premailer-cellpadding: 0;
      -premailer-cellspacing: 0;
    }

    .purchase_content {
      width: 100%;
      margin: 0;
      padding: 25px 0 0 0;
      -premailer-width: 100%;
      -premailer-cellpadding: 0;
      -premailer-cellspacing: 0;
    }

    .purchase_item {
      padding: 10px 0;
      color: #51545E;
      font-size: 15px;
      line-height: 18px;
    }

    .purchase_heading {
      padding-bottom: 8px;
      border-bottom: 1px solid #EAEAEC;
    }

    .purchase_heading p {
      margin: 0;
      color: #85878E;
      font-size: 12px;
    }

    .purchase_footer {
      padding-top: 15px;
      border-top: 1px solid #EAEAEC;
    }

    .purchase_total {
      margin: 0;
      text-align: right;
      font-weight: bold;
      color: #333333;
    }

    .purchase_total--label {
      padding: 0 15px 0 0;
    }

    .email-wrapper {
      width: 100%;
      margin: 0;
      padding: 0;
      -premailer-width: 100%;
      -premailer-cellpadding: 0;
      -premailer-cellspacing: 0;
      background-color: #F2F4F6;
    }

    .email-content {
      width: 100%;
      margin: 0;
      padding: 0;
      -premailer-width: 100%;
      -premailer-cellpadding: 0;
      -premailer-cellspacing: 0;
    }

    .email-masthead {
      width: 570px;
      margin: 0 auto;
      padding: 0;
      -premailer-width: 570px;
      -premailer-cellpadding: 0;
      -premailer-cellspacing: 0;
      text-align: center;
    }

    .email-body {
      width: 100%;
      margin: 0;
      padding: 0;
      -premailer-width: 100%;
      -premailer-cellpadding: 0;
      -premailer-cellspacing: 0;
    }

    .email-body_inner {
      width: 570px;
      margin: 0 auto;
      padding: 0;
      -premailer-width: 570px;
      -premailer-cellpadding: 0;
      -premailer-cellspacing: 0;
      background-color: #FFFFFF;
    }

    .email-footer {
      width: 570px;
      margin: 0 auto;
      padding: 0;
      -premailer-width: 570px;
      -premailer-cellpadding: 0;
      -premailer-cellspacing: 0;
      text-align: center;
    }

    .email-footer-logo {
      width: 120px;
      margin-bottom: 1.25em;
    }

    .email-footer p {
      color: #A8AAAF;
    }

    .body-action {
      width: 100%;
      margin: 30px auto;
      padding: 0;
      -premailer-width: 100%;
      -premailer-cellpadding: 0;
      -premailer-cellspacing: 0;
      text-align: center;
    }

    .body-sub {
      margin-top: 25px;
      padding-top: 25px;
      border-top: 1px solid #EAEAEC;
    }

    .content-cell {
      padding: 45px;
    }

    @media only screen and (max-width: 600px) {
      .email-body_inner,
      .email-footer {
        width: 100% !important;
      }
    }

    @media (prefers-color-scheme: dark) {
      body,
      .email-body,
      .email-body_inner,
      .email-content,
      .email-wrapper,
      .email-masthead,
      .email-footer {
        background-color: #333333 !important;
        color: #FFFFFF !important;
      }

      p,
      ul,
      ol,
      blockquote,
      h1,
      h2,
      h3,
      span,
      .purchase_item {
        color: #FFFFFF !important;
      }

      .attributes_content,
      .discount {
        background-color: #222222 !important;
      }
    }

    :root {
      color-scheme: light dark;
      supported-color-schemes: light dark;
    }
  </style>
  <!--[if mso]>
  <style type="text/css">
    .f-fallback {
      font-family: Arial, sans-serif;
    }
  </style>
  <![endif]-->
</head>
<body>
  <span class="preheader">{{template.preheader}}</span>
  <table class="email-wrapper" width="100%" cellpadding="0" cellspacing="0" role="presentation">
    <tr>
      <td align="center">
        <table class="email-content" width="100%" cellpadding="0" cellspacing="0" role="presentation">
          <tr>
            <td>
              <table class="email-masthead" align="center" width="570" cellpadding="0" cellspacing="0" role="presentation">
                <tr>
                  <td>
                    <img src="{{config.mediaUrl}}/admiin-email-header.png" alt="Admiin header" class="email-masthead-logo"/>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          ${emailBody}
          <tr>
            <td>
              <table class="email-footer" align="center" width="570" cellpadding="0" cellspacing="0" role="presentation">
                <tr>
                  <td class="content-cell" align="center">
                    <img src="{{config.mediaUrl}}/admiin-coloured-logo.png" alt="Admiin email header" class="email-footer-logo"/>

                    <p class="f-fallback sub align-center">
                      Admiin is an all-in-one administrative payments solution designed to service small businesses in
                      Australia. Anyone looking to pay other businesses can use Admiin.
                    </p>
                    <p class="f-fallback sub align-center">
                      <i>Trusted by our industry-leading financial partners</i>
                    </p>
                    <p class="f-fallback sub align-center">
                      <img src="{{config.mediaUrl}}/visa.png" alt="Visa" class="social_icon">
                      <img src="{{config.mediaUrl}}/mastercard.png" alt="Mastercard" class="social_icon">
                      <img src="{{config.mediaUrl}}/amex.png" alt="Amex" class="social_icon">
                      <img src="{{config.mediaUrl}}/payto.png" alt="PayTo" class="social_icon">
                      <img src="{{config.mediaUrl}}/payid.png" alt="PayID" class="social_icon">
                      <img src="{{config.mediaUrl}}/xero.png" alt="Xero" class="social_icon">
                    </p>
                    <p class="f-fallback sub align-center">
                      Need help? Email <a href="mailto:support@admiin.com">support@admiin.com</a>
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
};
