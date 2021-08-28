
const setAddSelectorMode = () => {
    const submit = document.getElementById('submit-btn')
    document.getElementById('add-selector-forms').classList.remove('d-none')
    document.getElementById('add-selector-btn').classList.remove('d-none')
    document.getElementById('change-mode-btn').innerText = '投票する'
    submit.addEventListener('click', submitAddSelectorEvent)
    submit.removeEventListener('click', submitVoteEvent)
    submit.innerText = '追加'
}

const setQuestionMode = () => {
    document.getElementById('question').innerText = 'アンケートを追加'
    document.getElementById('selector-list').classList.add('d-none')
    document.getElementById('add-selector-forms').classList.remove('d-none')
    document.getElementById('change-mode-btn').classList.add('d-none')
    const submit = document.getElementById('submit-btn')
    submit.innerText = 'アンケートを登録'
    submit.addEventListener('click', submitAddFormEvent)
    const ul = document.getElementById('add-selector-forms')
    const newInput = document.createElement("input")
    newInput.classList.add("form-control")
    newInput.placeholder = 'アンケート'
    newInput.ariaLabel = 'アンケート'
    // アンケートの場合追加項目は1つなので、既存のInputを消す
    ul.innerHTML = ''
    ul.appendChild(newInput)
}

const setVoteMode = () => {
    const submit = document.getElementById('submit-btn')
    document.getElementById('add-selector-forms').classList.add('d-none')
    document.getElementById('add-selector-btn').classList.add('d-none')
    document.getElementById('change-mode-btn').innerText = '選択肢を追加する'
    submit.removeEventListener('click', submitAddSelectorEvent)
    submit.addEventListener('click', submitVoteEvent)
    submit.innerText = '投票'
}

const setAnsweredMode = (votes, selectors) => {
    document.getElementById('add-selector-btn').classList.add('d-none')
    document.getElementById('change-mode-btn').classList.add('d-none')
    // === 選択肢の表示 ===
    const ul = document.getElementById('selector-list')
    const lis = ul.getElementsByTagName('li')
    selectors.forEach((selector, index) => {
        // 投票結果を表示させる
        if (votes.includes(`${selector.index}`)) {
            lis[index].classList.add("active")
        }
        const newBadge = document.createElement("span")
        newBadge.classList.add("badge", "bg-danger", "rounded-pill")
        newBadge.innerHTML = selector.count
        lis[index].appendChild(newBadge)
    })

    // === submitボタンの表示 ===
    const submit = document.getElementById('submit-btn')
    submit.innerText = 'シェア'
    submit.removeEventListener('click', submitAddSelectorEvent)
    submit.removeEventListener('click', submitVoteEvent)

    submit.classList.add('d-none')
    const liffClient = setLiffClient()
    liffClient(async () => {
        // 「LIFF が開ける && share target Picker が使える状態」 の場合に シェアボタンを表示する
        if (liff.isApiAvailable('shareTargetPicker') && liff.isInClient()) {
            submit.classList.remove('d-none')
            submit.addEventListener('click', submitShareEvent)
        }
    })
}