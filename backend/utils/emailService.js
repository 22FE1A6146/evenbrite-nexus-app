
const nodemailer = require('nodemailer');

// Create transporter
const createTransporter = () => {
  return nodemailer.createTransporter({
    host: process.env.EMAIL_HOST,
    port: parseInt(process.env.EMAIL_PORT),
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });
};

// Send ticket confirmation email
const sendTicketConfirmation = async (to, ticketData) => {
  try {
    const transporter = createTransporter();
    
    const { userName, eventTitle, eventDate, eventTime, venue, tickets } = ticketData;
    
    const ticketList = tickets.map(ticket => `
      <tr>
        <td style="padding: 10px; border: 1px solid #ddd;">Ticket ID: ${ticket._id}</td>
        <td style="padding: 10px; border: 1px solid #ddd;">$${ticket.price}</td>
        <td style="padding: 10px; border: 1px solid #ddd;">${ticket.status}</td>
      </tr>
    `).join('');

    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background-color: #4f46e5; color: white; padding: 20px; text-align: center; }
          .content { padding: 20px; background-color: #f9f9f9; }
          .ticket-details { background-color: white; padding: 15px; margin: 15px 0; border-radius: 5px; }
          table { width: 100%; border-collapse: collapse; margin: 15px 0; }
          th, td { border: 1px solid #ddd; padding: 10px; text-align: left; }
          th { background-color: #f2f2f2; }
          .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Ticket Confirmation</h1>
          </div>
          
          <div class="content">
            <h2>Hello ${userName}!</h2>
            <p>Thank you for purchasing tickets for <strong>${eventTitle}</strong>.</p>
            
            <div class="ticket-details">
              <h3>Event Details:</h3>
              <p><strong>Event:</strong> ${eventTitle}</p>
              <p><strong>Date:</strong> ${new Date(eventDate).toLocaleDateString()}</p>
              <p><strong>Time:</strong> ${eventTime}</p>
              <p><strong>Venue:</strong> ${venue}</p>
            </div>
            
            <h3>Your Tickets:</h3>
            <table>
              <tr>
                <th>Ticket</th>
                <th>Price</th>
                <th>Status</th>
              </tr>
              ${ticketList}
            </table>
            
            <p><strong>Important:</strong> Please bring a valid ID and your ticket QR code to the event.</p>
            <p>You can view and download your tickets from your account dashboard.</p>
          </div>
          
          <div class="footer">
            <p>This is an automated email. Please do not reply.</p>
            <p>Event Management System © 2024</p>
          </div>
        </div>
      </body>
      </html>
    `;

    const mailOptions = {
      from: `"Event Management System" <${process.env.EMAIL_USER}>`,
      to: to,
      subject: `Ticket Confirmation - ${eventTitle}`,
      html: html
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent: ' + info.messageId);
    return info;
  } catch (error) {
    console.error('Email sending error:', error);
    throw error;
  }
};

// Send event reminder email
const sendEventReminder = async (to, eventData) => {
  try {
    const transporter = createTransporter();
    
    const { userName, eventTitle, eventDate, eventTime, venue } = eventData;
    
    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background-color: #059669; color: white; padding: 20px; text-align: center; }
          .content { padding: 20px; background-color: #f9f9f9; }
          .event-details { background-color: white; padding: 15px; margin: 15px 0; border-radius: 5px; }
          .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Event Reminder</h1>
          </div>
          
          <div class="content">
            <h2>Hello ${userName}!</h2>
            <p>This is a friendly reminder about your upcoming event:</p>
            
            <div class="event-details">
              <h3>${eventTitle}</h3>
              <p><strong>Date:</strong> ${new Date(eventDate).toLocaleDateString()}</p>
              <p><strong>Time:</strong> ${eventTime}</p>
              <p><strong>Venue:</strong> ${venue}</p>
            </div>
            
            <p>Don't forget to bring:</p>
            <ul>
              <li>Your ticket (digital or printed)</li>
              <li>Valid photo ID</li>
              <li>Any required items mentioned in the event details</li>
            </ul>
            
            <p>We look forward to seeing you at the event!</p>
          </div>
          
          <div class="footer">
            <p>This is an automated email. Please do not reply.</p>
            <p>Event Management System © 2024</p>
          </div>
        </div>
      </body>
      </html>
    `;

    const mailOptions = {
      from: `"Event Management System" <${process.env.EMAIL_USER}>`,
      to: to,
      subject: `Reminder: ${eventTitle} - Tomorrow!`,
      html: html
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Reminder email sent: ' + info.messageId);
    return info;
  } catch (error) {
    console.error('Reminder email error:', error);
    throw error;
  }
};

module.exports = {
  sendTicketConfirmation,
  sendEventReminder
};
