const { remote } = require("electron");
firebase = remote.getGlobal("firey");

let firebaseRef = firebase.database().ref("visits");
let flag = false;

firebase
  .database()
  .ref("host")
  .once("value")
  .then(host_list => {
    if (host_list.exists()) {
      host_list.forEach(host => {
        let { session } = host.val();
        //'invalid' is string which is true, this if statement only allows valid host which are not in session
        if (session == false) {
          document.getElementsByTagName("button")[1].disabled = false; //host removal button
          document.getElementsByTagName("button")[2].disabled = false; //check in box
        }
      });
    }
  });

firebase
  .database()
  .ref("visits")
  .once("value")
  .then(visitor_list => {
    if (visitor_list.exists()) {
      visitor_list.forEach(visits => {
        let { time_out } = visits.val();
        if (time_out == -1) {
          //timeout ==-1 means visitor still in session
          document.getElementsByTagName("button")[3].disabled = false; //checkout box
        }
      });
    }
  });
