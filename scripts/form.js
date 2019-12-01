//cursor focus on first input box
document.getElementById("name").select();

//this function ,yes the one right below this comment is the heart of application
function linker(link) {
  window.location.href = `./${link}.html`;
}

//regex from w3resource.com
function ValidateEmail(mail) {
  if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(mail)) {
    return true;
  }
  return false;
}

function validate(abc) {
  let name = document.getElementById("name");
  let email = document.getElementById("email");
  let no = document.getElementById("no");
  let x = document.getElementById(abc); //host(abc)->adr visits(abc)->host id
  let flag = false;
  //check if any entry is blank
  if (
    name.value.trim().length &&
    email.value.trim().length &&
    no.value.trim().length &&
    x.value.trim().length
  ) {
    //email check
    if (ValidateEmail(email.value)) {
      //phone number check
      if (no.value.length == 10 && !isNaN(parseInt(no.value))) {
        flag = true;
      }
    }
  }

  if (!flag) {
    alert("Invalid Enteries");
    location.reload();
  } else {
    //for valid entries
    const { remote } = require("electron");
    firebase = remote.getGlobal("firey");
    let refPoint = abc == "adr" ? "host" : "visits"; //if abc is 'adr' that emplies that it is host database
    let firebaseRef = firebase.database().ref(refPoint);

    //object that will be added to firebase (common things for host-add and check-in)
    let fireObject = {
      name: name.value,
      email: email.value,
      no: no.value,
      time_in: new Date() + "",
      time_out: -1 //date updated during check out
    };

    //therefore it is check-in form
    if (refPoint == "visits") {
      fireObject["abc"] = document.getElementById("host").selectedOptions[0].id; //getting id of selected option and adding it to firebase
      firebase
        .database()
        .ref("host")
        .child(fireObject["abc"]) //here abc refers to host id
        .update({ session: true }); //make selected host session true.

      //creating message body
      details = `Name: ${fireObject["name"]}\nEmail: ${fireObject["email"]}\nPhone No: ${fireObject["no"]}\n`;

      firebase
        .database()
        .ref("host")
        .once("value")
        .then(host_list => {
          let { email, no } = host_list.child(fireObject["abc"]).val(); //get email and phone number of host
          console.log(email, no);
          inform(email, no, details); //send mail and sms to host about visitors details
          firebaseRef.push(fireObject);

          //within firebase promisse
          alert("Entry Added!");
          linker("app");
        });
      console.log(details);
    } else {
      //host-add form
      fireObject["session"] = false; //not in session
      fireObject["abc"] = x.value; //here x is address
      firebaseRef.push(fireObject);
      alert("Entry Added!");
      linker("app");
    }
  }
}
