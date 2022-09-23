const express = require('express')
const app = express()
const port = process.env.PORT || 3000
const request = require('request');
const requestNull = require('request').defaults({ encoding: null });
const fs = require('fs');
const { DOMParser } = require('xmldom')


const inbox = require("inbox");
const nodemailer = require("nodemailer");


//Swn7448810isthebestpassword


const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
        user: "lukas1h07@gmail.com", // generated ethereal user
        pass: "pbxvayjrvbryiiul", // generated ethereal password
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
                    console.log("Decoding Base64.\n")
                    var decoded = Buffer.from(msg, 'base64').toString()
                    console.log("Done.\n",decoded)
                    console.log("Parsing json\n")
                    var jsonMsg = JSON.parse(decoded)
                    var url = jsonMsg.url
                    var type = jsonMsg.type
                    console.log("Done.\n",jsonMsg)
                    console.log("\nURL:"+url+"\ntype:"+type+"\n")

                    console.log("Checking if URL is valid.\n")

                    if(isValidUrl(url) || true){ //Its the truth, aint it?
                        console.log("Valid.\n")
                        if(type=="file"){
                            console.log("Sending FILE Message...\n")
                            console.log("Fetching "+url+"\n")
                        
                            request(url, function (error, response, body) {
                                if (!error) {
                                    console.log("Done. "+"\n")
                                    console.log("Got HTML"+body.substring(0,10))
                                    let html = body
                                    console.log("Parsing HTML "+"\n")
                                    let DOMParsing = new DOMParser()
                                    let parsed = DOMParsing.parseFromString(body, "text/html")
                                    console.log("Done. "+"\n")
                                    console.log("Getting images. "+"\n")

                                    var images = []
                                    Array.from(parsed.getElementsByTagName("img")).forEach((one)=>{
                                        console.log(one)
                                        Array.from(one.attributes).forEach((two)=>{
                                            console.log(two)
                                            if(two.name == 'src'){
                                                console.log("is src")
                                                images.push(two.value)
                                            }
                                        })
                                    })
                                    
                                    

                                    console.log("Done. " + images[0] + "\n")
                                    

                                    let i = 0
                                    images.forEach(image => {
                                        let imageUrl
                                        if(image.startsWith("//")){
                                            imageUrl = "https:"+image
                                            console.log("Reddit-style URL. Fixing. " + imageUrl.substring(0,20)+ "\n")
                                        }else if(image.startsWith("/")){
                                            imageUrl = "https://" + getHostname(url) + image
                                            console.log("Relitive URL. Fixing. " + imageUrl.substring(0,20)+ "\n")
                                        }else{
                                            imageUrl = image
                                            console.log("Standerd URL. " + imageUrl.substring(0,20)+ "\n")
                                        }


                                        console.log("Downloading Image.\n")
                                        requestNull.get(imageUrl, function (error, response, body) {
                                            if (!error && response.statusCode == 200) {
                                                console.log("Done.\n")
                                                console.log("Converting to base64.\n")
                                                data = "data:" + response.headers["content-type"] + ";base64," + Buffer.from(body).toString('base64');
                                                console.log("Done.\n")
                                                console.log("Replaceing: ",image.substring(0,20))
                                                console.log("With:",data.substring(0, 20) ,"\n")
                                                html = html.replaceAll(image,data)
                                                i++
                                                if(i==images.length){
                                                    console.log("Done patching. Sending.")
                                                    fs.writeFileSync("./out.html",html)
                                                    transporter.sendMail({
                                                        from: 'lukas1h07@gmail.com',
                                                        to: "5414303372@mms.uscc.net",
                                                        subject: "__",
                                                        text: "__",
                                                        html: "__",
                                                        attachments:[{   // encoded string as an attachment
                                                            filename: 'cat.html',
                                                            content: html,
                                                            contentType: 'text/html'
                                                        }]
                                                    });
                                                    console.log("Done.")


                                                }
                                            }else{
                                                console.log("Error downloading image. " + response)
                                            }
                                        });
                                    });
                                } else {
                                    console.log(error);
                                }
                            });

                            
                            
                        }else{
                            console.log("Sending SCREENSHOT Message...\n")
                            transporter.sendMail({
                                from: 'lukas1h07@gmail.com',
                                to: "5414303372@mms.uscc.net ",
                                subject: "__",
                                text: "__",
                                html: "__",
                                attachments:[{   // encoded string as an attachment
                                    filename: 'cat.jpg',
                                    path:"https://api.apiflash.com/v1/urltoimage?access_key=30001f3a0411446e9a6d180726a0ec4e&wait_until=page_loaded&full_page=true&width=750&no_ads=true&no_cookie_banners&url="+url
                                },{   // encoded string as an attachment
                                        filename: 'cat.html',
                                        path:url
                                    }]
                            });
                            console.log("Done.")
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



function getPosition(string, subString, index) {
  return string.split(subString, index).join(subString).length;
}

const getHostname = (url) => {
  // run against regex
  const matches = url.match(/^https?\:\/\/([^\/?#]+)(?:[\/?#]|$)/i);
  // extract hostname (will be null if no match is found)
  return matches && matches[1];
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