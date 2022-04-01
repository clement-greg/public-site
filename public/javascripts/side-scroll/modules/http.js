export class HTTP {
    static getData(url, method) {
        if (!method) {
            method = 'GET';
        }

        return new Promise((resolve, reject) => {

            const xhttp = new XMLHttpRequest();
            xhttp.onreadystatechange = val => {
                if (val.currentTarget.readyState == 4 && val.currentTarget.status == 200) {
                    resolve(xhttp.responseText);
                }
            };
            xhttp.open(method, url, true);
            xhttp.send();
        });
    }

    static postData(url, data) {
        return new Promise((resolve, reject) => {

            var http = new XMLHttpRequest();
            http.open('POST', url, true);
            http.setRequestHeader('Content-type', 'application/json;charset=UTF-8');

            http.onreadystatechange = function () {
                if (http.readyState == 4 && http.status == 200) {
                    resolve(true);
                }
            }
            http.send(JSON.stringify(data));
        });
    }
}