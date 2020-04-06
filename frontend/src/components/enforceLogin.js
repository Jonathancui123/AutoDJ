import config from "../constants.js";


function enforceLogin(redirect = "select") {
    // alert("enforceLogin() called");
    const backendAddress = config.backendAddress;

    var promise = new Promise((resolve, reject) => {
        fetch(`${backendAddress}/checkLogin`, {
            method: "GET",
            credentials: "include"
        }).then(res => {
            return res.json();
        })
            .then(res => {
                console.log(`Response from /checkLogin: ${res}`);
                if (!res) {
                    // alert('User not logged in');
                    resolve(false)
                    window.location.href = `${backendAddress}/login?redirect=${redirect}`
                } else {
                    // alert("User is logged in already");
                    resolve(true);
                }
            })
    })
    return promise
}

export default enforceLogin