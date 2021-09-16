window.addEventListener('load', async () => {
  const liffClient = await setLiffClient()

  // setup をする
  liffClient(() => { if(!liff.isLoggedIn())liff.login(); })
  getProfile(liffClient)
});

const setLiffClient = () => {
  return (func) => { liff.init({ liffId: LIFF_ID }).then(func) }
}

const getProfile = async (liffClient) => {
  liffClient(() => {
    liff.getProfile().then((profile) => {
      // 02. プロフィールにユーザー名を表示してみよう
      // document.getElementById('user-name').innerText = profile.displayName
      document.getElementById('icon').src = profile.pictureUrl
      userId = profile.userId
    })
  })
}

const sendMessage = async (messages) => {
  await liff.sendMessages(messages).catch((err) => {
    document.getElementById('hote').innerHTML = err
  });
}