let convict_username = '';

// we will scroll back to this position after removing the filter
let userMessagePosition;

const targetNode = document.querySelector('[data-test-selector="chat-scrollable-area__message-container"]');

// popup window can suck my big black cock
document.body.querySelector('[data-a-target="chat-user-card"]').style.setProperty('right', '100px');
document.body.querySelector('[data-a-target="chat-user-card"]').style.setProperty('top', '80px');
document.body.querySelector('[data-a-target="chat-user-card"]').style.setProperty('width', '60%', 'important');

const config = { attributes: true, childList: true, subtree: true };

const callback = function(mutationsList, observer) {
    // Use traditional 'for loops' for IE 11
    for (const mutation of mutationsList) {
        if (mutation.type === 'childList') {
            for (const asd of mutation.addedNodes) {
                // @@@try other querySelectors
                if (!asd.querySelector(`[data-a-user="${convict_username}"]`)) {
                    asd.style.display = 'none';
                }
            }
        }
    }
};
const observer = new MutationObserver(callback);

const filterButton = document.createElement("button");
filterButton.setAttribute('data-test-selector', 'username-filter-button');
filterButton.style.backgroundColor = "#f9f900";
filterButton.style.fontWeight = "600";
filterButton.style.padding = "0px 10px";
filterButton.style.borderRadius = "0.4rem";
filterButton.style.height = "3rem";
filterButton.style.alignSelf = "auto";
filterButton.style.color = "#262626";

filterButton.onclick = () => {
    observer.disconnect();
    filterButton.remove();
    // document.body.querySelector('[data-test-selector="username-filter-button"]').remove();
    const allChatLineMessages = targetNode.querySelectorAll('[data-test-selector="chat-line-message"]');
    for (const element of allChatLineMessages) {
        // if there is style attribute in tag = we fucked.
        // use removeProperty("display") instead? but removing whole attribute should be faster, no?
        element.removeAttribute('style');
    }
    document.getElementsByClassName("simplebar-scroll-content")[0].scrollTo({top: userMessagePosition, behavior: "auto"});
    return;
}

filterButton.onmouseover = () => {
    filterButton.style.backgroundColor = "#e7e700";
}
filterButton.onmouseout = () => {
    filterButton.style.backgroundColor = "#f9f900";
}

function addRemoveFilterButton(e) {
    const chatContainer = document.body.querySelector('[data-test-selector="chat-input-buttons-container"]');
    const pointsButton = document.body.querySelector('[data-test-selector="community-points-summary"]');
    filterButton.textContent = `Remove filter for @${convict_username}`;
    if (pointsButton) {
        pointsButton.append(filterButton);
    } else {
        chatContainer.prepend(filterButton);
    }
    // remove text selection, because the nickname is not a <button> but a <span>
    document.getSelection().removeAllRanges()
    return;
}

function userMessagesFilterHandler(event) {
    // @@@ fix for single click or double click
    if (event.target.dataset.testSelector === "message-username") {
        userMessagePosition = document.getElementsByClassName("simplebar-scroll-content")[0].scrollTop;
        observer.observe(targetNode, config);
        convict_username = event.target.dataset.aUser;
        for (let element of targetNode.querySelectorAll('[data-test-selector="chat-line-message"]')) {
            if (!element.querySelector(`[data-a-user="${convict_username}"]`)) {
                element.style.display = 'none';
            }
        }
        for (let element of targetNode.querySelectorAll('[data-test-selector="user-notice-line"]')) {
            if (!element.querySelector(`[data-a-user="${convict_username}"]`)) {
                element.style.display = 'none';
            }
        }
        addRemoveFilterButton();
    }
}

targetNode.addEventListener('dblclick', userMessagesFilterHandler);
