
var nodemailer = require('nodemailer');
const fetch = require('node-fetch'); 


const sendMail = async (name, email, msg) => {
	try {

		const transporter = nodemailer.createTransport({
			service: "gmail",
			auth: {
				user: process.env.NODE_SENDER_MAIL,
				pass: process.env.NODE_SENDGRID_KEY,
			},
			port: 465,
			host: 'gsmtp.gmail.com'
		});


		var mailOptions = {
			from: process.env.NODE_SENDER_MAIL,
			to: email,
			subject: "Otp verification",
			text: "Agriculture alert",
			html: '<h1 style="color:red">Hi ' + name + ' </h1><p>' + msg + '</p>'
		};

		transporter.sendMail(mailOptions, function (error, info) {
			if (error) {
				console.log(error.message);

			} else {
				console.log('Email sent: ' + info.response);
			}
		});
	} catch (err) {
		console.log(err);
	}
}

async function sendSMS(mobileNumber, message, senderID, routeName, templateID) {
    const apiURL = 'http://123.108.46.13/sms-panel/api/http/index.php';
    const params = {
        username: 'ABHINANDHAN', // Replace with your actual username
        apikey: '81E9C-0AE0B',   // Replace with your actual API key
        apirequest: 'Text',
        sender: senderID,
        mobile: mobileNumber,
        message: message,
        route: routeName,
        TemplateID: templateID,
        format: 'JSON',
    };

    // Convert parameters to query string
    const queryParams = new URLSearchParams(params).toString();

    try {
        // Make the HTTP request
        const response = await fetch(`${apiURL}?${queryParams}`, {
            method: 'GET', // API uses GET method
        });

        // Parse and return the response
        if (response.ok) {
            const data = await response.json();
            return data;
        } else {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
    } catch (error) {
        console.log('Error sending SMS:', error);
        // throw error;
    }
}


module.exports = { sendMail,sendSMS }