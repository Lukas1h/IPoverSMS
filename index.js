const express = require('express')
const app = express()
const port = process.env.PORT || 3000


var inbox = require("inbox");
const fetch = require('node-fetch')
const nodemailer = require("nodemailer");



let transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
        user: "lukas1h07@gmail.com", // generated ethereal user
        pass: "mjxarhbsvqopeouk", // generated ethereal password
    },
});



var client = inbox.createConnection(false, "imap.gmail.com", {
    secureConnection: true,
    auth:{
        user: "lukas1h07@gmail.com",
        pass: "mjxarhbsvqopeouk"
    }
});

client.connect();

console.log("Welcome to the IP/SMS Server. Acsess at lukas1h07@gmail.com.\n");

client.on("connect", function(){
    console.log("Successfully connected to server.");
    client.openMailbox("INBOX", function(error, info){
        client.on("new", function(message){
            console.log("New incoming message from "+message.from.name+".");
            if(message.from.address.includes("5414303372")){
                var readable = client.createMessageStream(message.UID)
                var result   = '';
                readable.on('data', function(chunk) {
                    result += chunk;
                });
                readable.on('end', function () {

                    var msg = parseMessage(result).substring(10)
                    console.log("Received: "+msg+"\n")
                    console.log("Checking if URL is valid.\n")
                    if(isValidUrl(msg)){
                        console.log("Valid.\n")
                        console.log("Sending Message...\n")
                        try {
                            transporter.sendMail({
                                from: 'lukas1h07@gmail.com',
                                to: "5414303372@mms.uscc.net ",
                                subject: "__",
                                text: "__",
                                html: "__",
                                attachments:[{   // encoded string as an attachment
                                    filename: 'cat.html',
                                    path:msg
                                }]
                            });
                            console.log("Done.")
                        }
                        catch(err) {
                            console.log("Looks like there was an error.")
                            
                        }
                    }else{
                        console.log("Invalid.\nSkiping.\n")
                    }           
                 })
            }else{
                console.log("Ignoring.")
            }
        });
    });
});


function removeItem(array, item) {
    var i = array.length;

    while (i--) {
        if (array[i] === item) {
            array.splice(array.indexOf(item), 1);
        }
    }
}

function getPosition(string, subString, index) {
  return string.split(subString, index).join(subString).length;
}

function parseMessage(str){
    boundry=str.match(/^\sboundary.*\n?/gm, '')[0].match(/"(.*?)"/)[1];
    var out = str.substring(getPosition(str,boundry,2)+boundry.length,getPosition(str,boundry,3)-3)
    out = out.replace(/^Content-ID.*\n?/gm, '')
             .replace(/^Content-Location.*\n?/gm, '')
             .replace(/^Content-Type.*\n?/gm, '')
             .replace(/^\sname.*\n?/gm, '')
             .substring(2);

    return out
}


const isValidUrl = urlString=> {
      try { 
      	return Boolean(new URL(urlString)); 
      }
      catch(e){ 
      	return false; 
      }
  }


app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`)
})


// console.log("Fetching "+"https://www..com/search.json?q="+encodeURIComponent(msg))




//                     fetch("https://www.reddit.com/search.json?q="+encodeURIComponent(msg))
//                         .then(res => res.json())
//                         .then((json) => {
//                             //console.log(json.data.children)
//                             // for (let i = 0; i < 3; i++) {
//                             //     console.log(json.data.children[i].data.thumbnail)
//                             //     attach.push({filename:"image.jpg",path:json.data.children[i].data.thumbnail})
//                             // }
                            
//                             removeItem(attach,"self")
//                             // json.data.children.forEach((x, i) => {
                                
//                             // });
//                             console.log(attach)
//                             json.data.children.forEach((a,i)=>{
//                                 console.log("sending: ",{
//                                     from: 'lukas1h07@gmail.com', // sender address
//                                     to: "5414303372@mms.uscc.net", // list of receivers
//                                     subject: "", // Subject line
//                                     text: "", // plain text body
//                                     html: "",
//                                     attachments:[{path:json.data.children[i].data.thumbnail,filename:"image.jpg"}]
//                                 })
//                                 if([{path:json.data.children[i].data.thumbnail,filename:"image.jpg"}][0].path.includes("self")){
//                                     console.log("AHHHHH!!!")
//                                 }else{
//                                     transporter.sendMail({
//                                         from: 'lukas1h07@gmail.com', // sender address
//                                         to: "5414303372@mms.uscc.net", // list of receivers
//                                         subject: "", // Subject line
//                                         text: "", // plain text body
//                                         html: "",
//                                         attachments:[{path:a,filename:"image.jpg"}]
//                                     });
//                                 }
//                             })
                            

//                         });



//Masons Password: As2>Cy4>