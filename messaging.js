//email and message
function inform(dest, no, details) {
  const mailOptions = {
    from: process.env.EMAIL,
    to: dest,
    subject: "Hello World",
    text: details
  };

  //alert box usually takes time to show... your window location might change
  let transport = remote.getGlobal("mailer");
  transport.sendMail(mailOptions, function(error, info) {
    if (error) {
      alert("ERROR!\n\n" + error);
      return false;
    } else {
      alert("email sent: " + info.response);
      return true;
    }
  });

  let message = remote.getGlobal("nexi");

  message.sendSms("EMS", "+91" + no, details, (err, responseData) => {
    if (err) {
      alert(err);
    } else {
      if (responseData.messages[0]["status"] === "0") {
        alert("Message sent successfully.");
      } else {
        alert(
          `Message failed with error: ${responseData.messages[0]["error-text"]}`
        );
      }
    }
  });
}
