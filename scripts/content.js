const url = window.location.href;
const matchWithPagination = url.match(/\/contest\/(.*)\/ranking\/(\d+)\/$/);
const matchWithoutPagination = url.match(/\/contest\/(.*)\/ranking\/$/);

if (matchWithPagination) {
    const contestType = matchWithPagination[1];
    const pagination = matchWithPagination[2];
    chrome.runtime.sendMessage({ contestType, pagination });
} else if (matchWithoutPagination) {
    const contestType = matchWithoutPagination[1];
    const pagination = 1;
    chrome.runtime.sendMessage({ contestType, pagination });
}



chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.apiResponse) {
        console.log(message.apiResponse.data)

        const response = message.apiResponse.data

        const tableRows = document.getElementsByTagName('tr');

        for (let i = 0; i < response.length; i++) {
            const username = response[i].username;
            const language = response[i].lang;

            for (let j = 0; j < tableRows.length; j++) {
                const usernameElement = tableRows[j].querySelector('.ranking-username');
                if (usernameElement && usernameElement.getAttribute('title') === username) {
                    usernameElement.textContent = `${username} (${language})`;
                }
            }
        }
    }
});
