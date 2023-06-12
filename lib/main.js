let storage = [];
let active_flip;
const body = document.getElementById('body')
const content = document.getElementById('content')

const createItemHistory = (item, index) => {

    const lists = document.getElementById('lists')
    const container = document.createElement('div')
    const content = document.createElement('button')
    const title = document.createElement('p')
    const time = document.createElement('p')
    const buttonDel = document.createElement('button')
    
    content.className = "list-item"

    buttonDel.textContent = "Hapus"
    title.textContent = item.name
    let date = new Date(item.last_play)
    time.textContent = `${date.getDate()}/${date.getMonth()}/${date.getFullYear()}, ${('0' + date.getHours()).substr(-2)}:${('0' + date.getMinutes()).substr(-2)}`
    container.style.display = "flex"
    container.style.marginTop = "12px"
    container.style.marginBottom = "12px"

    buttonDel.className = "btn-delete"

    content.append(title)
    content.append(time)
    container.append(content)
    if (storage?.length > 1) container.append(buttonDel)
    lists.append(container)

    const deleteSavedGame = () => {

        storage.splice(index, 1)
        localStorage.setItem('flip_games', JSON.stringify(storage))
        container.remove()
    }

    content.addEventListener('click', () => navigateDashboard(index))
    buttonDel.addEventListener('click', deleteSavedGame)
}

const createItemChoosed = (item) => {

    const lists = document.getElementById('lists')
    const content = document.createElement('div')
    const title = document.createElement('p')
    const time = document.createElement('p')
    
    content.className = "list-item-choosed"

    title.textContent = `[${item?.coupon?.id}] ` + item?.name
    time.textContent = "Rp " + Intl.NumberFormat('ID', { maximumSignificantDigits: 3 }).format(storage[active_flip]?.nominals[item?.coupon?.prize].prize)

    content.append(title)
    content.append(time)
    lists.append(content)
}

const createItemInputNominal = (cb) => {

    const lists = document.getElementById('lists')
    const container = document.createElement('div')
    const navGroup = document.createElement('div')
    const inputNominal = document.createElement('input')
    const inputTotal = document.createElement('input')
    const buttonDel = document.createElement('button')

    inputNominal.placeholder = "Nominal..."
    inputTotal.placeholder = "Jumlah..."
    buttonDel.textContent = "Hapus"

    inputNominal.type = "number"
    inputTotal.type = "number"

    inputNominal.name = "input-nominal"
    inputTotal.name = "input-total"

    container.style.display = "flex"
    container.style.marginBottom = "16px"
    navGroup.style.width = "100%"
    navGroup.className = "input-container"
    inputNominal.className = "input-nominal"
    inputTotal.className = "input-total"
    buttonDel.className = "btn-delete"

    navGroup.append(inputNominal)
    navGroup.append(inputTotal)
    container.append(navGroup)
    container.append(buttonDel)
    lists.append(container)

    inputNominal.addEventListener('input', cb)
    inputTotal.addEventListener('input', cb)
    buttonDel.addEventListener('click', () => container.remove())
}

const createWelcomeView = () => {

    const title = document.createElement('h1')
    const button = document.createElement('button')
    const triangle = document.createElement('div')

    title.textContent = "JASINDO: Flip & Win"
    
    title.className = "text-hero"
    button.className = "btn-start rotate"
    triangle.className = "triangle"

    content.classList.add('flex-1')
    
    button.append(triangle)
    content.append(title)
    content.append(button)
    
    button.addEventListener('click', navigateHistory)
}

const createHistoryView = () => {
    
    const title = document.createElement('h1')
    const lists = document.createElement('div')
    const navGroup = document.createElement('div')
    const buttonNewGame = document.createElement('button')
    const buttonQuit = document.createElement('button')
    const header = document.createElement('div')
    const icon = document.createElement('img')
    
    title.textContent = "Histori"
    
    title.className = "text-title"
    buttonNewGame.textContent = "Mulai baru"
    icon.src = "./assets/images/back.png"
    icon.height = 15
    navGroup.style.display = "flex"
    navGroup.style.alignItems = "center"
    buttonQuit.style.marginRight = "14px"

    lists.id = "lists"

    content.classList.remove('flex-1')
    lists.className = "list-container"
    header.className = "header-container"
    buttonNewGame.className = "btn-create"
    buttonQuit.className = "btn"

    navGroup.append(buttonQuit)
    navGroup.append(title)
    header.append(navGroup)
    header.append(buttonNewGame)
    buttonQuit.append(icon)

    content.append(header)
    content.append(lists)

    storage.map(createItemHistory)

    buttonQuit.addEventListener('click', navigateWelcome)
    buttonNewGame.addEventListener('click', navigateCreateNew)
}

const createFormView = () => {

    const title = document.createElement('h1')
    const lists = document.createElement('div')
    const navGroup = document.createElement('div')
    const buttonStart = document.createElement('button')
    const buttonQuit = document.createElement('button')
    const buttonAdd = document.createElement('button')
    const header = document.createElement('div')
    const inputGroupHead = document.createElement('div')
    const icon = document.createElement('img')
    const inputName = document.createElement('input')
    
    title.textContent = "Mulai Baru"
    buttonAdd.textContent = "Tambah nominal"
    inputName.placeholder = "Nama game..."
    
    title.className = "text-title"
    buttonStart.textContent = "Mulai"
    icon.src = "./assets/images/back.png"
    icon.height = 15
    navGroup.style.display = "flex"
    navGroup.style.alignItems = "center"
    buttonQuit.style.marginRight = "14px"
    inputName.id = "input-name"
    inputName.className = "input-name"
    inputGroupHead.id = "input-container"
    inputGroupHead.style.display = "flex"
    inputGroupHead.style.justifyContent = "space-between"
    inputGroupHead.style.alignItems = "center"

    lists.id = "lists"

    content.classList.remove('flex-1')
    lists.className = "list-container"
    header.className = "header-container"
    buttonStart.className = "btn-create"
    buttonQuit.className = "btn"
    buttonAdd.className = "btn-add"

    inputGroupHead.append(inputName)
    navGroup.append(buttonQuit)
    navGroup.append(title)
    header.append(navGroup)
    header.append(buttonStart)
    buttonQuit.append(icon)

    content.append(header)
    content.append(lists)
    content.append(buttonAdd)

    lists.append(inputGroupHead)

    const handlerCreateNewGame = () => {
        
        let err = false
        const data = {
            name: "",
            nominals: []
        }

        for (const inputGroup of lists.children) {

            if (inputGroup.tagName == "DIV") {

                if (inputGroup.id == "input-container") {
                    for (const inp of inputGroup.children) {
                        if (inp.id == "input-name") {
                            if (inp.value?.trim()) data.name = inp.value
                            else err = true
                        }
                    }
                } else {
                    const nominal = {
                        nominal: 0,
                        total: 0
                    }
    
                    for (const inputs of inputGroup.children) {
                        if (inputs.tagName == "DIV") {
                            for (const inp of inputs.children) {
                                if (inp.value) {
                                    if (inp.name == "input-nominal") nominal.nominal = parseInt(inp.value)
                                    if (inp.name == "input-total") nominal.total = parseInt(inp.value)
                                } else err = true
                            }
                        }
                    }
    
                    data.nominals.push(nominal)
                }

            }
        }

        if (err) alert("Mohon lengkapi data ...")
        else {

            const newGame = {
                name: data.name,
                nominals: [],
                coupons: [],
                winners: [],
                last_play: new Date()
            }

            let id = 0

            data.nominals.forEach((el, i) => {

                newGame.nominals.push({ prize: el.nominal, total: el.total })

                for (let _i = 0; _i < el.total; _i++) {
                    
                    id++;
                    const coupon = {
                        id,
                        prize: i,
                        checked: false
                    }

                    newGame.coupons.push(coupon)
                }
            })

            newGame.coupons = newGame.coupons.sort(() => Math.random()-.5)
            storage.push(newGame)
            
            localStorage.setItem('flip_games', JSON.stringify(storage))
            navigateDashboard(storage.length-1)
        }
    }

    const calculateSumNominal = () => {

        console.log('calculate ...')

        let count = 0

        const existNominal = document.getElementById('nominal-info')
        existNominal?.remove()

        for (const inputGroup of lists.children) {

            if (inputGroup.tagName == "DIV") {

                for (const inputs of inputGroup.children) {
                    if (inputs.tagName == "DIV") {

                        let nom = 0
                        let len = 0

                        for (const inp of inputs.children) {
                            if (inp.value) {
                                if (inp.name == "input-nominal") nom = parseInt(inp.value)
                                if (inp.name == "input-total") len = parseInt(inp.value)
                            }
                        }

                        count += (nom*len)
                    }
                }
            }
        }

        const nominal = document.createElement('p')
        nominal.id = "nominal-info"
        nominal.textContent = "Rp " + Intl.NumberFormat('ID', { maximumSignificantDigits: 3 }).format(count)
        inputGroupHead.append(nominal)
    }
    
    createItemInputNominal(calculateSumNominal)
    
    // Listen

    buttonQuit.addEventListener('click', navigateHistory)
    buttonStart.addEventListener('click', handlerCreateNewGame)
    buttonAdd.addEventListener('click', () => createItemInputNominal(calculateSumNominal))
}

const createDashboardView = () => {

    const currentGame = storage[active_flip]
    const leftVoucher = currentGame?.coupons?.reduce((_a, a) => {
        if (!a.checked) return _a + 1
        return _a
    }, 0)

    const title = document.createElement('h1')
    const buttonBack = document.createElement('button')
    const header = document.createElement('div')
    const icon = document.createElement('img')
    const navGroup = document.createElement('div')
    const lists = document.createElement('div')
    const prizeText = document.createElement('p')
    const balanceText = document.createElement('p')
    const vouchersText = document.createElement('p')
    const sectionText = document.createElement('h2')
    const infoGroup = document.createElement('div')
    const leftInfo = document.createElement('div')
    const rightInfo = document.createElement('div')
    const buttonExport = document.createElement('button')

    title.textContent = storage[active_flip]?.name
    
    title.className = "text-title"
    icon.src = "./assets/images/back.png"
    navGroup.style.display = "flex"
    navGroup.style.alignItems = "center"
    buttonBack.style.marginRight = "14px"
    icon.height = 15
    lists.id = "lists"

    buttonExport.className = "btn-create"
    buttonExport.textContent = "Export"

    content.classList.remove('flex-1')
    header.className = "header-container"
    buttonBack.className = "btn"
    lists.className = "list-container"
    sectionText.textContent = "Pemenang"
    sectionText.className = "text-section"
    prizeText.textContent = "Total prize: Rp " + Intl.NumberFormat('ID', { maximumSignificantDigits: 3 }).format(countTotalPrize())
    prizeText.style.margin = "2px 0px"
    prizeText.style.fontSize = ".8rem"
    vouchersText.textContent = "Total voucher: " + leftVoucher + "/" +(currentGame?.coupons?.length || 0)
    vouchersText.style.margin = "0px"
    vouchersText.style.fontSize = ".8rem"
    balanceText.textContent = "Kredit: Rp " + Intl.NumberFormat('ID', { maximumSignificantDigits: 3 }).format(countCredit())
    balanceText.style.margin = "0px"
    balanceText.style.fontSize = ".8rem"
    infoGroup.style.display = "flex"
    infoGroup.style.padding = "0px 40px"
    infoGroup.style.marginBottom = "18px"
    infoGroup.style.justifyContent = "space-between"
    leftInfo.style.display = "flex"
    leftInfo.style.flexDirection = "column"
    rightInfo.style.display = "flex"
    rightInfo.style.flexDirection = "column"
    rightInfo.style.alignItems = "flex-end"
    
    buttonBack.append(icon)
    navGroup.append(buttonBack)
    navGroup.append(title)
    header.append(navGroup)

    if (currentGame?.winners?.length > 0) header.append(buttonExport)

    leftInfo.append(prizeText)
    leftInfo.append(vouchersText)
    leftInfo.append(balanceText)

    infoGroup.append(leftInfo)
    infoGroup.append(rightInfo)

    content.append(header)
    content.append(infoGroup)
    content.append(sectionText)
    content.append(lists)

    const createItemNominalView = (item, i) => {

        const nominalText = document.createElement('p')
        const leftnominal = currentGame?.coupons?.reduce((_a, a) => {
            if (a.prize == i && !a.checked) return _a + 1
            return _a
        }, 0)
        nominalText.style.margin = "2px 0px"
        nominalText.style.fontSize = ".8rem"
        nominalText.textContent = "Sisa " + leftnominal + "/" + item?.total + " voucher Rp " + Intl.NumberFormat('ID', { maximumSignificantDigits: 3 }).format(item?.prize)
        rightInfo.append(nominalText)
    }

    const exportWinner = () => {

        if (currentGame?.winners?.length > 0) {
            console.log("Exporting...")
            const link1 = document.createElement('a');
            const link2 = document.createElement('a');

            let text = "";
            let text1 = currentGame?.name + "\n\n"

            text1 += "total_prize, " + Intl.NumberFormat('ID', { maximumSignificantDigits: 3 }).format(currentGame?.nominals?.reduce((_a,a) => _a+a.prize, 0)) + '\n\n'
            text1 += "nominal, total\n"

            currentGame?.nominals?.forEach(el => {
                text1 += Intl.NumberFormat('ID', { maximumSignificantDigits: 3 }).format(el.prize) + ", " + el.total+ '\n'
            });

            currentGame?.winners?.forEach(el => {
                text += el.name?.toLowerCase() + ", " + Intl.NumberFormat('ID', { maximumSignificantDigits: 3 }).format(currentGame?.nominals[el.coupon.prize].prize) + '\n'
            });

            link2.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text1));
            link2.setAttribute('download', `flipandwin.csv`);
            link2.click()

            link1.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
            link1.setAttribute('download', `flipandwin-winners.csv`);
            setTimeout(() => link1.click(), 300);

        }
    }

    currentGame?.nominals.map(createItemNominalView)    
    currentGame?.winners?.reverse().map(createItemChoosed)

    buttonBack.addEventListener('click', navigateHistory)
    buttonExport.addEventListener('click', exportWinner)
}

// Handlers

const countCredit = () => {

    let credit = 0
    const currentGame = storage[active_flip]

    currentGame?.coupons?.forEach(item => {
        if (!item.checked) credit += currentGame.nominals[item.prize].prize
    });
    
    return credit
}

const countTotalPrize = () => {

    let total = 0
    const currentGame = storage[active_flip]

    currentGame?.nominals?.forEach(item => {
        total += item.prize * item.total
    });
    
    return total
}

const checkStorage = () => {

    const _storage = localStorage.getItem('flip_games')
    const _active = localStorage.getItem('active_flip')
    if (_storage) storage = JSON.parse(_storage)
    if (_active) localStorage.removeItem('active_flip')
    console.log(storage)
}

const clearContent = () => {

    while (content.hasChildNodes()) content.removeChild(content.firstChild)
    return true
}

const navigateDashboard = (index) => {

    if (typeof index == 'number') {
        localStorage.setItem('active_flip', JSON.stringify(index))
        active_flip = index
        window.open('./play.html', 'blank')
        clearContent()
        createDashboardView()
    } else active_flip = null
}

const navigateHistory = () => {
    
    closeActiveGame()
    clearContent()
    createHistoryView()
}

const navigateWelcome = () => {
    
    clearContent()
    createWelcomeView()
}

const navigateCreateNew = () => {

    clearContent()
    createFormView()
}

const closeActiveGame = () => {
    const _active = localStorage.getItem('active_flip')
    if (_active) {
        localStorage.removeItem('active_flip')
        storage[_active].last_play = new Date()
        localStorage.setItem("flip_games", JSON.stringify(storage))
        clearContent()
        createHistoryView()
    }
}

const Start = () => {

    checkStorage()
    navigateWelcome()
}

// Listeners

window.addEventListener('unload', closeActiveGame)
window.addEventListener('storage', e => {

    console.log(e.storageArea)

    const _storage = localStorage.getItem('flip_games')
    if (_storage) storage = JSON.parse(_storage)
    
    if (e.key == "active_flip" && !e.newValue) navigateHistory()
    else if (e.storageArea?.active_flip) {
        clearContent()
        createDashboardView()
    }
})

// Start

Start()

