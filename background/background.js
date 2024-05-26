chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.contestType && message.pagination) {
        console.log(message.contestType);
        console.log(message.pagination);
        const contestType = message.contestType.split('-')[0];
        const contestId = message.contestType.split('-')[2];
        const pageId = message.pagination;
        const k = `${contestType.charAt(0)}_${contestId}_${pageId}`;

        // Listen for tab updates
        chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
            // Ensure the tab is fully loaded
            if (changeInfo.status === "complete" && tab.id === sender.tab.id) {
                // Retrieve data from local storage 
                chrome.storage.local.get([k], (result) => {
                    const data = result[k];
                    console.log("Retrieved data from local storage:", data);
                    if (data) {
                        console.log("sending data to content:", data);
                        chrome.tabs.sendMessage(sender.tab.id, { apiResponse: data });

                    } else {
                        console.log("Data not found in local storage, fetching from API...");
                        const apiURL = `https://django-contest-api-yagffnekaq-uw.a.run.app/api/${contestType}/${contestId}/page/${pageId}`;
                        fetch(apiURL)
                            .then(response => response.json())
                            .then(data => {
                                chrome.tabs.sendMessage(sender.tab.id, { apiResponse: data });
                                // chrome.storage.local.set({ [k]: data }, () => {
                                //     console.log(`Data saved for key: ${k}`);
                                // });
                            })
                            .catch(error => {
                                console.error(error);
                            });
                    }
                });
            }
        });

        // chrome.storage.local.get([k], (result) => {
        //     const data = result[k];
        //     if (data) {
        //         console.log("Retrieved data from local storage:", data);
        //         chrome.tabs.sendMessage(sender.tab.id, { apiResponse: data });
        //     } else {
        //         console.log("Data not found in local storage, fetching from API...");
        //         const apiURL = `https://django-contest-api-yagffnekaq-uw.a.run.app/api/${contestType}/${contestId}/page/${pageId}?format=json`;
        //         fetch(apiURL)
        //             .then(response => response.json())
        //             .then(data => {
        //                 chrome.tabs.sendMessage(sender.tab.id, { apiResponse: data });
        //                 chrome.storage.local.set({ [k]: data }, () => {
        //                     console.log(`Data saved for key: ${k}`);
        //                 });
        //             })
        //             .catch(error => {
        //                 console.error(error);
        //             });
        //     }
        // });
    }
});
