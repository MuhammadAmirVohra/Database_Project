var nodemailer = require('nodemailer')

const mail = (user_email , code)=>
{
    const mailTranspote = nodemailer.createTransport(
        {
            host : "smtp.gmail.com" ,
            port : 587 ,
            secure:false,
            auth:{
                 user:'daniyalhassan11081999@gmail.com',
                pass: 'avvrm3Id?'
            }
         }
         
        )
        
        // var smtpTransport = nodemailer.createTransport("smtps://youruser%40gmail.com:"+encodeURIComponent('yourpass#123') + "@smtp.gmail.com:465"); 
        
        mailTranspote.sendMail(
            {
                from:"daniyalhassan11081999@gmail.com",
                to:user_email,
                subject:'verify the account',
                text:'your verification code : '+ code
        
                 
            }, function(err)
            {
                if(err)
                {
                    console.log('Unable to send mail '+err)
                }
            }
        )

}


module.exports = mail;