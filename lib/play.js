let storage = [];
let currentGame = {}
let active_flip = null
let logo_id = 0;
let switch_random = false;
let count_times = 0
const logos = ["./assets/logo/mandiri.png", "./assets/logo/livin.png", "./assets/logo/kopra.png"];
const logos_white = ["./assets/logo/mandiri-white.png", "./assets/logo/livin-white.png", "./assets/logo/kopra-white.png"];

const body = document.getElementById('body')
const grid = document.getElementById('grid')
const soundSpin = document.getElementById('sound-spin')
const soundWin = document.getElementById('sound-win')

// Generate UI

const Keyboard = {

    elements: {
        main: null,
        keysContainer: null,
        keys: []
    },

    eventHandlers: {
        oninput: null,
        onclose: null,
        onsubmit: null
    },

    properties: {
        value: "",
        capsLock: false
    },

    init(input, onSubmit) {

        // Create main elements
        this.elements.main = document.createElement("div");
        this.elements.keysContainer = document.createElement("div");

        // Setup main elements
        this.elements.main.id = "keyboard"
        this.elements.main.classList.add("keyboard");
        this.elements.keysContainer.classList.add("keyboard__keys");
        this.elements.keysContainer.appendChild(this._createKeys());

        this.elements.keys = this.elements.keysContainer.querySelectorAll(".keyboard__key");

        // Check existing keyboard
        const existKeyboard = document.getElementById('keyboard')
        if (existKeyboard) existKeyboard?.remove()

        // Add to DOM
        this.elements.main.appendChild(this.elements.keysContainer);
        document.body.appendChild(this.elements.main);

        const onChangeValue = currentValue => {
            input.value = currentValue
        }

        // Add event catcher
        input?.addEventListener("focus", () => this.open(input?.value, onChangeValue));
        input?.addEventListener('input', (e) => {
            if (e.inputType === "insertText") this.properties.value += e.data
            else if (e.inputType === "deleteContentBackward") this.properties.value = this.properties.value?.slice(0, -1)
        })
        input.addEventListener('change', e => onSubmit?.(this.properties.value))
    },

    _createKeys() {
        const fragment = document.createDocumentFragment();
        const keyLayout = [
            "1", "2", "3", "4", "5", "6", "7", "8", "9", "0", "backspace",
            "q", "w", "e", "r", "t", "y", "u", "i", "o", "p",
            "caps", "a", "s", "d", "f", "g", "h", "j", "k", "l",
            "z", "x", "c", "v", "b", "n", "m", ",", ".", "?", "done",
            "space"
        ];

        // Creates HTML for an icon
        const createIconHTML = (icon_name) => {

            if (icon_name == "space_bar") return `<span>⎵</span>`;
            if (icon_name == "backspace") return `<span>«</span>`;
            if (icon_name == "keyboard_return") return `<span>«</span>`;
            if (icon_name == "keyboard_capslock") return `<span>ˆ</span>`;
            if (icon_name == "check_circle") return `<span>Oke</span>`;
            else return `<span>${icon_name}</span>`;
        };

        keyLayout.forEach(key => {
            const keyElement = document.createElement("button");
            const insertLineBreak = ["backspace", "p", "l", "done"].indexOf(key) !== -1;

            // Add attributes/classes
            keyElement.setAttribute("type", "button");
            keyElement.classList.add("keyboard__key");

            switch (key) {
                case "backspace":
                    keyElement.classList.add("keyboard__key--wide");
                    keyElement.innerHTML = createIconHTML("backspace");

                    keyElement.addEventListener("click", () => {
                        this.properties.value = this.properties.value.substring(0, this.properties.value.length - 1);
                        this._triggerEvent("oninput");
                    });

                    break;

                case "caps":
                    keyElement.classList.add("keyboard__key--wide", "keyboard__key--activatable");
                    keyElement.innerHTML = createIconHTML("keyboard_capslock");

                    keyElement.addEventListener("click", () => {
                        this._toggleCapsLock();
                        keyElement.classList.toggle("keyboard__key--active", this.properties.capsLock);
                    });

                    break;

                case "space":
                    keyElement.classList.add("keyboard__key--extra-wide");
                    keyElement.innerHTML = createIconHTML("space_bar");

                    keyElement.addEventListener("click", () => {
                        this.properties.value += " ";
                        this._triggerEvent("oninput");
                    });

                    break;

                case "done":
                    keyElement.classList.add("keyboard__key--wide", "keyboard__key--dark");
                    keyElement.innerHTML = createIconHTML("check_circle");

                    keyElement.addEventListener("click", () => {
                        this._triggerEvent("onsubmit");
                        this.close();
                    });

                    break;

                default:
                    keyElement.textContent = key.toLowerCase();

                    keyElement.addEventListener("click", () => {
                        this.properties.value += this.properties.capsLock ? key.toUpperCase() : key.toLowerCase();
                        this._triggerEvent("oninput");
                    });

                    break;
            }

            fragment.appendChild(keyElement);

            if (insertLineBreak) fragment.appendChild(document.createElement("br"));
        });

        return fragment;
    },

    _triggerEvent(handlerName) {
        if (typeof this.eventHandlers[handlerName] == "function") {
            this.eventHandlers[handlerName](this.properties.value);
        }
    },

    _toggleCapsLock() {
        this.properties.capsLock = !this.properties.capsLock;

        for (const key of this.elements.keys) {
            if (key.childElementCount === 0) {
                key.textContent = this.properties.capsLock ? key.textContent.toUpperCase() : key.textContent.toLowerCase();
            }
        }
    },

    open(initialValue, oninput, onsubmit, onclose) {
        this.properties.value = initialValue || "";
        this.eventHandlers.oninput = oninput;
        this.eventHandlers.onsubmit = onsubmit;
        this.eventHandlers.onclose = onclose;
        this.elements.main.classList.remove("keyboard--hidden");
    },

    close() {
        this.properties.value = "";
        this.eventHandlers.oninput = oninput;
        this.eventHandlers.onsubmit = onsubmit;
        this.eventHandlers.onclose = onclose;
        this.elements.main.classList.add("keyboard--hidden");
    }
};

const createModal = (nominal = 0, coupon) => {

    const section = document.createElement('section')
    const container = document.createElement('div')
    const button = document.createElement('button')
    const textInfo = document.createElement('p')
    const textPrize = document.createElement('p')
    const input = document.createElement('input')

    section.id = "modal-congrats"

    input.id = "input-name"
    input.type = "text"
    input.placeholder = "Masukkan nama anda..."
    input.className = "input-name"

    section.className = "modal-container"
    container.className = "modal"
    container.style.flexDirection = "column"
    textInfo.className = "text-info"
    textPrize.className = "text-prize"

    textInfo.textContent = "Selamat anda mendapatkan eMoney"
    textPrize.textContent = "Rp " + Intl.NumberFormat('ID', { maximumSignificantDigits: 3 }).format(nominal)

    button.onclick = handlerCloseModal

    container.append(textInfo)
    container.append(textPrize)
    // container.append(input)
    section.append(container)
    body.append(section)

    // Keyboard.init(input, (value) => handlerSubmitWinner(value, coupon))
}

const createCard = (item, i) => {

    if (logo_id >= 3) logo_id = 0

    const gridItem = document.createElement('div')
    const lable = document.createElement('label')
    const input = document.createElement('input')
    const card = document.createElement('div')
    const front = document.createElement('div')
    const back = document.createElement('div')
    const imgFront = document.createElement('img')

    gridItem.id = "grid"+item.id
    input.id = "check"
    card.id = "card"
    input.disabled = item?.checked
    input.name = "card-item"
    input.id = item.id
    input.type = "checkbox"
    
    gridItem.className = "grid-item"
    lable.className = "flip-card"
    
    input.checked = item.checked
    back.textContent = shortNominal(currentGame?.nominals?.[item?.prize]?.prize)

    if (logo_id == 1) imgFront.height = 18;
    else if (logo_id == 2) imgFront.height = 18;
    else imgFront.height = 11;

    if (switch_random) {
        if (i % 2 != 0) {
            front.id = "front"
            back.id = "back"
            imgFront.src = logos_white[logo_id]
        } else {
            front.id = "front-white"
            back.id = "back-white"
            imgFront.src = logos[logo_id]
        }
    } else {
        if (i % 2 != 0) {
            front.id = "front-white"
            back.id = "back-white"
            imgFront.src = logos[logo_id]
        } else {
            front.id = "front"
            back.id = "back"
            imgFront.src = logos_white[logo_id]
        }
    }

    count_times++
    if (count_times == 10) {
        switch_random = !switch_random
    }
    
    front.append(imgFront)
    card.append(front, back)
    lable.append(input, card)
    gridItem.append(lable)
    grid.append(gridItem)

    input.addEventListener('input', (e) => {

        if (e.target.checked) {

            const cards = document.getElementsByName('card-item')
            cards.forEach((cardItem) => cardItem.disabled = true)

            currentGame.coupons.forEach((it, i) => {
                if (it.id == e.target.id) currentGame.coupons[i].checked = true
            })
            
            lable.classList.add('rotate')
            input.disabled = true
            const coupon = currentGame.coupons.find((itm) => itm.id == e.target.id)
            soundSpin?.play?.()
            setTimeout(() => {
                soundSpin?.pause?.()
                soundWin?.play?.()
                createModal(currentGame.nominals[coupon.prize].prize, coupon)
            }, 2000);
            setTimeout(() => {
                handlerSubmitWinner("Pemenang", coupon)
                soundWin?.pause?.()
            }, 7000);
        }
    })

    logo_id++
}

// Handlers

const shortNominal = (nominal = 0) => {

    let _nom = nominal?.toString()

    if (_nom?.length === 4) {
        if (_nom[1] == "0") {
            if (_nom[2] == "0") _nom = _nom?.substring(0, 1) + "Rb"
            else _nom = _nom?.substring(0, 1) + "." + _nom?.substring(1, 3) + "Rb" 
        }
        else {
            if (_nom[2] == "0") _nom = _nom?.substring(0, 1) + "." + _nom[1] + "Rb"
            else _nom = _nom?.substring(0, 1) + "." + _nom?.substring(1, 3) + "Rb" 
        }
    } else if (_nom?.length === 5) {
        if (_nom[2] == "0") _nom = _nom?.substring(0, 2) + "Rb"
        else _nom = _nom?.substring(0, 2) + "." + _nom[2] + "Rb"
    } 
    else if (_nom?.length === 6) _nom = _nom?.substring(0, 3) + "Rb" 
    else if (_nom?.length === 7) {
        if (_nom[1] == "0") {
            if (_nom[2] == "0") _nom = _nom?.substring(0, 1) + "Jt"
            else _nom = _nom?.substring(0, 1) + "." + _nom?.substring(1, 3) + "Jt" 
        }
        else {
            if (_nom[2] == "0") _nom = _nom?.substring(0, 1) + "." + _nom[1] + "Jt"
            else _nom = _nom?.substring(0, 1) + "." + _nom?.substring(1, 3) + "Jt" 
        }
    } 
    else if (_nom?.length === 8) {
        if (_nom[2] == "0") _nom = _nom?.substring(0, 2) + "Jt"
        else _nom = _nom?.substring(0, 2) + "." + _nom[2] + "Jt"
    } else if (_nom?.length === 9) _nom = _nom?.substring(0, 3) + "Jt" 
    else if (_nom?.length === 10) {
        if (_nom[1] == "0") {
            if (_nom[2] == "0") _nom = _nom?.substring(0, 1) + "M"
            else _nom = _nom?.substring(0, 1) + "." + _nom?.substring(1, 3) + "M" 
        }
        else {
            if (_nom[2] == "0") _nom = _nom?.substring(0, 1) + "." + _nom[1] + "M"
            else _nom = _nom?.substring(0, 1) + "." + _nom?.substring(1, 3) + "M" 
        }
    } else if (_nom?.length === 11) {
        if (_nom[2] == "0") _nom = _nom?.substring(0, 2) + "M"
        else _nom = _nom?.substring(0, 2) + "." + _nom[2] + "M"
    } else if (_nom?.length === 12) _nom = _nom?.substring(0, 3) + "M" 
    else if (_nom?.length === 13) {
        if (_nom[1] == "0") {
            if (_nom[2] == "0") _nom = _nom?.substring(0, 1) + "T"
            else _nom = _nom?.substring(0, 1) + "." + _nom?.substring(1, 3) + "T" 
        }
        else {
            if (_nom[2] == "0") _nom = _nom?.substring(0, 1) + "." + _nom[1] + "T"
            else _nom = _nom?.substring(0, 1) + "." + _nom?.substring(1, 3) + "T" 
        }
    } else if (_nom?.length === 14) {
        if (_nom[2] == "0") _nom = _nom?.substring(0, 2) + "T"
        else _nom = _nom?.substring(0, 2) + "." + _nom[2] + "T"
    } else if (_nom?.length === 15) _nom = _nom?.substring(0, 3) + "T" 

    return _nom
}

const handlerSubmitWinner = (name, coupon) => {

    const newWinner = {
        name,
        coupon
    }

    currentGame?.winners?.push(newWinner)
    storage[active_flip] = currentGame

    localStorage.setItem('flip_games', JSON.stringify(storage))

    setTimeout(handlerCloseModal, 300);
}

const handlerCloseModal = () => {

    const modalCongrats = document.getElementById('modal-congrats')
    const existKeyboard = document.getElementById('keyboard')
    existKeyboard?.remove()
    modalCongrats?.remove()

    const cards = document.getElementsByName('card-item')
    cards.forEach((cardItem) => {
        let disabled = false
        currentGame.coupons.forEach(coup => {
            if (coup.id == cardItem.id) disabled = coup?.checked
        })
        cardItem.disabled = disabled
    })
}

const checkGame = () => {

    const games = localStorage.getItem('flip_games')
    const _active = localStorage.getItem('active_flip')

    if (!_active) window.close()
    else {
        const _games = JSON.parse(games)
        storage = _games
        currentGame = _games[_active]
        active_flip = _active
    }
}

const closeActiveGame = () => {

    storage[active_flip].last_play = new Date()
    localStorage.setItem("flip_games", JSON.stringify(storage))
    localStorage.removeItem('active_flip')
}

const Start = () => {

    checkGame()
    currentGame?.coupons?.map(createCard)
}

// Listeners

window.addEventListener('unload', closeActiveGame)
window.addEventListener('storage', checkGame)

// Start

Start()