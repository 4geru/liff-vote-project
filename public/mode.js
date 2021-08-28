
const setAddSelectorMode = () => {
    const submit = document.getElementById('submit-btn')
    document.getElementById('add-selector-forms').classList.remove('d-none')
    document.getElementById('add-selector-btn').classList.remove('d-none')
    document.getElementById('change-mode-btn').innerText = '投票する'
    submit.addEventListener('click', submitAddSelector)
    submit.removeEventListener('click', submitVote)
    submit.innerText = '追加'
}

const setQuestionMode = () => {
    document.getElementById('question').innerText = 'アンケートを追加'
    document.getElementById('selector-list').classList.add('d-none')
    document.getElementById('add-selector-forms').classList.remove('d-none')
    document.getElementById('change-mode-btn').classList.add('d-none')
    const submit = document.getElementById('submit-btn')
    submit.innerText = 'アンケートを登録'
    submit.addEventListener('click', submitAddForm)
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
    submit.removeEventListener('click', submitAddSelector)
    submit.addEventListener('click', submitVote)
    submit.innerText = '投票'
}
