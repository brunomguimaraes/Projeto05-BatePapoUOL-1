let userName;
let recipient = "Todos";
let messageType = "message";

function keepConection () {
    const promise = axios.post(
        "https://mock-api.bootcamp.respondeai.com.br/api/v3/uol/status",
        {
            name: userName
        }
    );  
}

function getUserNameError (error) {
    const status = error.response.status;
    const enterScreen = document.querySelector(".login-screen");
    if (status === 400) {
        enterScreen.classList.remove("hide");
        alert("Nome em uso, tente outro");
    }
}

function startChat () {
    const enterScreen = document.querySelector(".login-screen");
    enterScreen.classList.add("hide");

    getMessages();
    getUsers();
    setInterval(getMessages, 3000);
    setInterval(getUsers, 10000);
    ;
}

function getUserName () {
    userName = document.querySelector(".enter-name").value;
    const promise = axios.post(
        "https://mock-api.bootcamp.respondeai.com.br/api/v3/uol/participants", 
        {
            name: userName
        }
    );
    promise.then(startChat);
    promise.catch(getUserNameError);
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
            if (to === userName || from === userName) {
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

function getMessages () {
    const promise = axios.get("https://mock-api.bootcamp.respondeai.com.br/api/v3/uol/messages");
    promise.then(printMessages);
}

function reload () {
    window.location.reload();
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
    document.querySelector(".text-message").value = "";
    promise.then(getMessages);
    promise.catch(reload);
}

function inputText () {
    const messageStatus = document.querySelector(".message-status");
    if (messageType === "message") {
        messageStatus.innerHTML = `Enviando para ${recipient} (público)`
    }
    if (messageType === "private_message") {
        messageStatus.innerHTML = `Enviando para ${recipient} (reservadamente)`
    }
}

function printUsers (users) {
    const user = document.querySelector(".active-users");
    let userSelected = document.querySelector(".active-users .selected .name");
    user.innerHTML = "";
    
    for (let i = 0; i < users.data.length; i++) {
        if (userSelected === null) {
            user.innerHTML +=
            `<div class="option" onclick="selectRecipient(this, '${users.data[i].name}')">
                <ion-icon name="person-circle"></ion-icon>
                <p class="name">${users.data[i].name}</p>
                <img src="media/Checkmark.png" alt="Checkmark">
            </div>`
        } else {    
            if (userSelected.innerText === users.data[i].name) {
                user.innerHTML +=
                `<div class="option selected" onclick="selectRecipient(this, '${users.data[i].name}')">
                    <ion-icon name="person-circle"></ion-icon>
                    <p class="name">${users.data[i].name}</p>
                    <img src="media/Checkmark.png" alt="Checkmark">
                </div>`
            } else {
                user.innerHTML +=
                `<div class="option" onclick="selectRecipient(this, '${users.data[i].name}')">
                    <ion-icon name="person-circle"></ion-icon>
                    <p class="name">${users.data[i].name}</p>
                    <img src="media/Checkmark.png" alt="Checkmark">
                </div>`
            }
        }
    }

    userSelected = document.querySelector(".active-users .selected .name");
    if ( userSelected === null || userSelected.innerText === "Todos") {
        user.innerHTML = 
        `<div class="option selected" onclick="selectRecipient(this, 'Todos')">
            <ion-icon name="people"></ion-icon>
            <p class="name">Todos</p>
            <img src="media/Checkmark.png" alt="Checkmark">
        </div>` + user.innerHTML;
        recipient = "Todos";
        inputText();
    } else {
        user.innerHTML = 
        `<div class="option" onclick="selectRecipient(this, 'Todos')">
            <ion-icon name="people"></ion-icon>
            <p class="name">Todos</p>
            <img src="media/Checkmark.png" alt="Checkmark">
        </div>` + user.innerHTML;
    }
}

function getUsers () {
    const promise = axios.get("https://mock-api.bootcamp.respondeai.com.br/api/v3/uol/participants");
    promise.then(printUsers);
}

function selectRecipient (option, user) {
    const userSelected = document.querySelector(".active-users .selected");
    if (userSelected !== null) {
        userSelected.classList.remove("selected");
    }
    option.classList.add("selected");
    recipient = user;
    inputText();
}

function selectMessageType (option, type) {
    const typeSelected = document.querySelector(".messageType .selected");
    if (typeSelected !== null) {
        typeSelected.classList.remove("selected");
    }
    option.classList.add("selected");
    messageType = type;
    inputText();
}

function toggleSidebar () {
    const background = document.querySelector(".blur-background");
    background.classList.toggle("hide")
    const panel = document.querySelector(".chat-options");
    panel.classList.toggle("hide")
}