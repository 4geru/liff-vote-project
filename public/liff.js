window.addEventListener('load', async () => {
    const liffClient = await setLiffClient()

    liffClient(() => { if(!liff.isLoggedIn())liff.login(); })
    getProfile(liffClient)
});

const setLiffClient = () => {
    return (func) => { liff.init({ liffId: LIFF_ID }).then(func) }
}

const getProfile = async (liffClient) => {
    liffClient(() => {
        liff.getProfile().then((profile) => {
            document.getElementById('user-name').innerText = profile.displayName
            document.getElementById('icon').src = profile.pictureUrl
            userId = profile.userId
        })
    })
}

const sendMessage = async (message) => {
    await liff.sendMessages([{
        'type': 'text',
        'text': message
    }]).catch((err) => {
        document.getElementById('hote').innerHTML = err
    });
}