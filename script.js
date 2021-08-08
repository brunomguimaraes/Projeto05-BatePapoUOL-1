let userName;
let recipient = "Todos";
let messageType = "message";


getMessages();
setInterval(getMessages, 3000);

function askUserName () {
    userName = document.querySelector(".enter-name").value;
    const promise = axios.post(
        "https://mock-api.bootcamp.respondeai.com.br/api/v3/uol/participants", 
        {
            name: userName
        }
    );

    const enterScreen = document.querySelector(".enter-screen");
    enterScreen.classList.add("hide");

    promise.then(setInterval(keepConection, 5000));
    promise.catch(askUserNameError);

}

function askUserNameError (error) {
    const status = error.response.status;
    const enterScreen = document.querySelector(".enter-screen");

    if (status === 400) {
        enterScreen.classList.remove("hide");
    }
}

function keepConection () {
    const promise = axios.post(
        "https://mock-api.bootcamp.respondeai.com.br/api/v3/uol/status",
        {
            name: userName
        }
    );

    
}

function getMessages () {
    const promise = axios.get("https://mock-api.bootcamp.respondeai.com.br/api/v3/uol/messages");
    promise.then(printMessages);
}

function printMessages (messages) {
    const chat = document.querySelector(".chat");
    chat.innerHTML = "";
    for (let i = 0; i < messages.data.length; i++) {
        let from = messages.data[i].from;
        let to = messages.data[i].to;
        let text = messages.data[i].text;
        let time = messages.data[i].time;
        if (messages.data[i].type === "message") {
            chat.innerHTML += `
            <li class="message white">
                <span class="time">${time}</span> <span class="user">${from}</span> para <span class="user">${to}</span>: ${text}
            </li>`;
        }
        if (messages.data[i].type === "status") {
            chat.innerHTML += `
            <li class="message gray">
                <span class="time">${time}</span> <span class="user">${from}</span>: ${text}
            </li>`;
        }
        if (messages.data[i].type === "private_message") {
            if (to === userName) {
                chat.innerHTML += `
                <li class="message red">
                    <span class="time">${time}</span> <span class="user">${from}</span> reservadamente para <span class="user">${to}</span>: ${text}
                </li>`;
            }
        }
        if ( i === (messages.data.length - 1)) {
            const lastMessage = document.querySelector(".message:last-child");
            lastMessage.scrollIntoView();
        }
        
    }
}

function sendMessage () {
    const message = document.querySelector(".text-message").value;
    const promise = axios.post(
        "https://mock-api.bootcamp.respondeai.com.br/api/v3/uol/messages",
        {
            from: userName,
            to: recipient,
            text: message,
            type: messageType
        }
    );
    promise.then(getMessages);
    promise.catch(window.location.reload);
}
