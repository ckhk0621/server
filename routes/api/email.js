const express = require('express');
const router = express.Router();
const nodeMailer = require('nodemailer');

// @route   POST api/email
// @desc    send email
// @access  Admin private
router.post('/send', (req, res) => {

    const htmlContent = `各位同事,<br/>
 
        請見以下為明天 ( 05月22日)上工廠的香港同事的港車安排 :<br/>
         
        香港司機 – 成 (車牌 :  MA1NLAND手機號 : 6776 5216 )<br/>
        
        等候點：<br/>
        鑽石山 (8:10am), <b>Joel</b><br/>
        粉嶺(8:35am), <b>Edward Lau</b>, <b>Edith</b><br/>
        屯門(8:55am), <b>Ada</b>
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
            user: 'cklamhk0621@gmail.com',
            pass: 'ausing1230'
        }
    });

    let mailOptions = {
        from: `"Testing email function" <klamhk0621@gmail.com>`, // sender address
        to: 'ckhk0621@gmail.com, cklamhk0621@gmail.com', // list of receivers
        subject: '測試囉 ✔', // Subject line
        text: 'Hello world?', // plain text body
        html: htmlContent // html body
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log(error);
            res.status(400).send({success: false})
        } else {
            res.status(200).send({success: true});
        }
    });

    // const newGallery = new Gallery({
    //     title: req.body.title,
    //     description: req.body.description,
    //     user: req.user.id,
    //     author: req.user.name
    // });
    //
    // newGallery.save().then(
    //     res.send({
    //         success: true,
    //         status: 'ok'
    //     })
    // );
    // return res.status(404).json({ ok: 'No email' });
});

module.exports = router;
