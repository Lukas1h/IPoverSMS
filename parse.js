const fetch = require('node-fetch')
const msg = "Me Irl"


fetch("https://www.google.com")
    .then(res => res.text())
    .then((html)=>{
        const encodedHtml = Buffer(html).toString("base64")

    })
                        