const TWEET_URL = 'https://twitter.com/intent/tweet?hashtags=LINEDC&text=%E5%8B%95%E3%81%84%E3%81%9F%E3%82%88%F0%9F%8E%89%F0%9F%8E%89%0D%0ALIFF%E3%81%A7%E3%82%B5%E3%83%BC%E3%83%90%E3%83%AC%E3%82%B9%E3%81%AA%E3%82%A2%E3%83%B3%E3%82%B1%E3%83%BC%E3%83%88%E3%82%A2%E3%83%97%E3%83%AA%E3%82%92%E4%BD%9C%E3%81%A3%E3%81%A6%E3%81%BF%E3%82%88%E3%81%86%E3%80%90REV%20UP%E9%80%A3%E5%8B%95%E4%BC%81%E7%94%BB%E3%83%8F%E3%83%B3%E3%82%BA%E3%82%AA%E3%83%B3%E3%80%91&url=https%3A%2F%2Flinedevelopercommunity.connpass.com%2Fevent%2F225168%2F'
let mode = 'vote'
let userId = ''

window.onload = () => {
  if(!questionId()) {
    setQuestionMode()
  } else {
    init()
    fetchQuestion()
  }
}

const init = () => {
  const changeModeButton = document.getElementById('change-mode-btn')
  changeModeButton.addEventListener('click', switchModeEvent)
  const addSelectorButton = document.getElementById('add-selector-btn')
  addSelectorButton.addEventListener('click', addSelectorEvent)
  const submit = document.getElementById('submit-btn')
  submit.addEventListener('click', submitVoteEvent)
}

const fetchQuestion = async () => {
  $('#exampleModalCenter').modal('show')
  const liffClient = await setLiffClient()
  liffClient(async () => {
    const profile = await liff.getProfile()
    const response = await axios.get(`${REQUEST_URL}?type=topInfo&formInfoIndex=${questionId()}&userId=${profile.userId}`)

    // アンケートのお題を登録する
    const ul = document.getElementById('question')
    ul.innerText = response.data.question.question

    setSelector(response.data.question.question, response.data.selectors)
    // 投票結果がある場合は、回答を表示する
    if(response.data.votes !== '') {
      setAnsweredMode(response.data.votes.split(','), response.data.selectors)
    }
    $('#exampleModalCenter').modal('hide')
  })
}

const setSelector = async (question, selectors) => {
    const ul = document.getElementById('selector-list')
    ul.innerHTML = ''

    for (selector of selectors) {
      const newLi = document.createElement("li")
      newLi.classList.add("list-group-item", "d-flex", "justify-content-between", "align-items-center")
      newLi.dataset.selectorId = selector.index
      newLi.innerText = selector.selector
      newLi.addEventListener('click', clickLiEvent)
      ul.appendChild(newLi)
    }
    document.getElementById('change-mode-btn').classList.remove('d-none')
}

const submitAddFormEvent = async () => {
  const question = document.getElementsByTagName('input')[0].value
  if(question === '') {
    alert('アンケートを追加してください')
    return
  }

  // APIリクエストを行う
  const response = await axios.get(`${REQUEST_URL}?type=addForm&question=${question}&userId=${userId}`)

  if(response.data.status === 'ok') {
    const url = new URL(location)
    url.searchParams.append("question", response.data.questionId)
    location = url
  }
}

// === addEventListener events ===
const submitVoteEvent = async () => {
    $('#exampleModalCenter').modal('show')
    // formから選択されている情報を取得する
    const selectedSelectors = [...document.getElementById('selector-list').getElementsByClassName('active')].map((selector) => {
        return selector.dataset.selectorId
    })

    // APIリクエストを行う
    const response = await axios.get(`${REQUEST_URL}?type=vote&questionId=${questionId()}&userId=${userId}&selectorIds=${selectedSelectors.join(',')}`)

    // 投票結果を表示する
    if(response.data.status === 'ok') {
      // 投票結果を表示する
      setAnsweredMode(response.data.votes.split(','), response.data.selectors)
      // 投票したことをLINEメッセージで送る
      const liffClient = await setLiffClient()
      liffClient(async () => {
        // LINE の inbrowser でない場合はメッセージが送れない
        if(liff.isInClient()) {
          const profile = await liff.getProfile()
          await sendMessage([
            {
              'type': 'text',
              'text': `${profile.displayName}が投票しました\n${liff.permanentLink.createUrl()}`
            }
          ])
        }
      })
      $('#exampleModalCenter').modal('hide')
    }
}

const switchModeEvent = () => {
    if (mode === 'vote') {
      setAddSelectorMode()
      mode = 'addSelector'
    } else if (mode === 'addSelector') {
      setVoteMode()
      mode = 'vote'
    }
}

const submitShareEvent = () => {
  const liffClient = setLiffClient()
  liffClient(async () => {
    const question = document.getElementById('question').innerText
    liff.shareTargetPicker([
      // ↓ Button Message などのテンプレートメッセージは、PC版では表示されない
      buttonMessage(question),
      // ↓ Flex Message は、PC版でも表示される
      // flexMessage(question)
    ])
  })
}

const buttonMessage = (question) => {
  const profile = await liff.getProfile()
  return {
    "type": "template",
    "altText": "アンケートリクエストが送られました",
    "template": {
      "type": "buttons",
      "imageAspectRatio": "rectangle",
      "imageSize": "cover",
      "imageBackgroundColor": "#FFFFFF",
      "title": "アンケートリクエスト",
      "text": `「${question}」のアンケートリクエストが来ています`,
      "actions": [
        {
          "type": "uri",
          "label": "投票する",
          "uri": liff.permanentLink.createUrl()
        },
        {
          "type": "uri",
          "label": "ツイートする",
          "uri": TWEET_URL
        }
      ]
    }
  }
}

const flexMessage = (question) => {
  return {
    "type": "flex",
    "altText": "This is a Flex Message",
    "contents": {
      "type": "bubble",
      "hero": {
        "type": "image",
        "url": "https://scdn.line-apps.com/n/channel_devcenter/img/fx/01_1_cafe.png",
        "size": "full",
        "aspectRatio": "20:13",
        "aspectMode": "cover",
      },
      "body": {
        "type": "box",
        "layout": "vertical",
        "contents": [
          {
            "type": "text",
            "text": `「${question}」のアンケートリクエストが来ています`,
            "weight": "bold",
            "wrap": true
          }
        ]
      },
      "footer": {
        "type": "box",
        "layout": "vertical",
        "spacing": "sm",
        "contents": [
          {
            "type": "button",
            "style": "link",
            "height": "sm",
            "style": "primary",
            "color": "#07b53b",
            "action": {
              "type": "uri",
              "label": "アンケートに答える",
              "uri": liff.permanentLink.createUrl()
            },
          },
          {
            "type": "button",
            "style": "link",
            "height": "sm",
            "style": "primary",
            "color": "#1DA1F2",
            "action": {
              "type": "uri",
              "label": "ツイートする",
              "uri": TWEET_URL
            },
          },
          {
            "type": "spacer",
            "size": "sm"
          }
        ],
        "flex": 0
      }
    }
  }
}

const submitAddSelectorEvent = async () => {
  $('#exampleModalCenter').modal('show')
  // 追加するselectorを定義する
  const addSelectors = [...document.getElementsByTagName('input')]
    .filter((input) => input.value !== '') // 空のinputを弾く
    .map((input) => input.value) // 中の値を取得する

  // APIリクエストを行う
  const response = await axios.get(`${REQUEST_URL}?type=addSelector&questionId=${questionId()}&userId=${userId}&selectors=${JSON.stringify(addSelectors)}`)

  location.reload()
}

const addSelectorEvent = () => {
  const ul = document.getElementById('add-selector-forms')
  const newInput = document.createElement("input")
  newInput.classList.add("form-control")
  newInput.placeholder = '選択肢'
  newInput.ariaLabel = '選択肢'
  ul.appendChild(newInput)
}

const clickLiEvent = (event) => {
  event.preventDefault()
  event.currentTarget.classList.toggle('active')
}

// === library ===
const questionId = () => {
  const url = new URL(location)
  return url.searchParams.get("question")
}