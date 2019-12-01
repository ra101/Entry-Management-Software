//this function ,yes the one right below this comment is the heart of application
function linker(link) {
  window.location.href = `./${link}.html`;
}

//during loging out host and check-out
function remove(refPoint) {
  fileName = document.getElementById(refPoint).selectedOptions[0].id;
  if (!fileName) {
    alert("Cant Leave Empty!");
    return;
  }

  let firebaseRef = firebase.database().ref(refPoint); //visits or host

  if (refPoint == "visits") {
    let details = ``; //just declaring because scope of details

    firebaseRef.child(fileName).update({ time_out: new Date() + "" }); //this is for declaring checkout

    firebase
      .database()
      .ref("visits/" + fileName)
      .once("value", function(snapshot) {
        let { name, no, time_in, time_out, abc, email } = snapshot.val(); //all values of visitor
        details = `Name: ${name}\nNo: ${no}\nCheck-in time: ${time_in +
          ""}\nCheck-out time: ${time_out + ""}\n`; //updating details
        let key = abc; //this is host-id
        firebase
          .database()
          .ref("host/" + key)
          .update({ session: false }); //host is now available

        //to get host-name and host-adr
        firebase
          .database()
          .ref("host/" + key)
          .once("value", function(snapshot) {
            let { name, abc } = snapshot.val();
            details += `Host name: ${name}\nAddress visited: ${abc}`; //updating details
            inform(email, no, details); //sending email and sms to visitor

            //inside promise to sol it down
            alert("Checked Out!");
            linker("app");
          });
      });
  } else {
    //if host logs out
    firebaseRef
      .child(fileName)
      .update({ session: "invalid", time_out: new Date() + "" }); //dont actually remove it keep time-stamp of it, and put session as invalid
    alert("Entry Removed!");
    linker("app");
  }
}
