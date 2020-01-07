const request = require('request');

function registerUser(code) {
    // Get user info
    request({
        url: 'https://api.spotify.com/v1/me',
        method: 'GET',
        headers: {
            'Authorization': code
        }
    }, (err, res, body) => {
        if (err) {
            console.log('Response error');
        } else {
            const info = JSON.parse(body);
            // Get current date and time
            const today = new Date();
            const currentDateTime = today.getFullYear()+'-'+today.getMonth()+'-'+today.getDate()+' '+today.getHours()+':'+today.getMinutes()+':';
            users.push(new User(
                Math.max.apply(Math, users.map(user => { return user.id; })),
                info.display_name,
                info.id,
                users.map(user => { return user.role; }).includes('host') ? 'guest' : 'host',
                currentDateTime
            ));
            console.log('Current users', users);
        }
    });
}

function getSongs(code) {
    request({
        url: 'https://api.spotify.com/v1/me/top/tracks',
        method: 'GET',
        headers: {
            'Authorization': code
        }
    })
}