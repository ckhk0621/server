const express = require('express');
const router = express.Router();
const nodeMailer = require('nodemailer');
const _ = require('lodash');
const moment = require('moment');

// @route   POST api/email
// @desc    send email
// @access  Admin private
router.post('/send', (req, res) => {

    // console.log(`req====`,req.body);
    const demoEmail = req.body.demoEmail;
    const emailContent = req.body.selectedRows;
    const date = !_.isEmpty(emailContent[0].date) ? emailContent[0].date : moment().add(1, 'days').format('YYYY-MM-DD');
    const driver = !_.isEmpty(emailContent[0].driver) ? `${emailContent[0].driver} 車牌-${emailContent[0].plate}` : '';
    const passengers = (emailContent||[]).map(d=>`<b>${d.passenger}</b>`);

    console.log(`demoEmail===`,demoEmail);

    const htmlContent = `各位同事,<br/>
    請見以下為明天 (${moment(date).format('l')})上工廠的香港同事的港車安排 :<br/><br/>
    香港司機:<br/>
    ${driver}
    <br/><br/>
    等候點：<br/>
    ${emailContent.map(d => {
      return `${d.pickupLocation} (${moment(d.time).format('HH:mm a')}) - ${d.passenger.map(d=> `<b>${d}</b> `)}<br/>`;
    }).join(' ')}
    <br/>
    <p>** 請各上廠同事，在廠內必須緊記佩戴香港職員証，謝謝！**</p>
    <p>
    若香港出發上廠當日有任何行程改動，有勞知會任何一位上廠同事及必須同時致電通知Prudence (Tel : 9187 1817) 。
    原來編排好從工廠出發返港人士，如當日行程改動，請通知Prudence (Tel : 9187 1817) 或文艺( Tel : 135 1013 1458) 
    或陳鶴鳴 (Tel : 137 2432 9848)，多謝合作！</p>
    `;

    const transporter = nodeMailer.createTransport({
        service: 'gmail',
        secure: true,  //true for 465 port, false for other ports
        auth: {
            user: 'mainland.intranet@gmail.com',
            pass: 'mainland@passw0rd'
        }
    });

    let mailOptions = {
        from: `"廠車通知電郵功能測試" <no-reply@mainland-intranet.com>`, // sender address
        to: demoEmail, // list of receivers
        subject: '請各上廠同事 注意 ✔', // Subject line
        text: '', // plain text body
        html: htmlContent // html body
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log(error);
            res.status(400).send({status: false})
        } else {
            res.status(200).send({status: true});
        }
    });

    res.status(200).send({status: true});
});

module.exports = router;
