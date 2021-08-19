window.addEventListener('load', async () => {
    const liffClient = await setLiffClient()

    console.log(liffClient)
    // liffClient(() => { console.log(liff.isLoggedIn()) })
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