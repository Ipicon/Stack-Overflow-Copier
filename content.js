$(function () {
    const preTag = $("pre");
    const keys = {};
    let userKeys = []

    chrome.storage.sync.get(["keys"], async function (items) {
        if ($.isEmptyObject(items)) {
            await chrome.storage.sync.set({"keys": ["Shift", "c"]});
            userKeys.push("Shift", "c");
        } else {
            userKeys = items['keys']
        }
    });

    preTag.css("outline", "none");
    preTag.attr("tabindex", "0");

    preTag.on("click", function (e) {
        $(this).trigger("focus");
    })

    preTag.on("keydown", function (e) {
        const currentKey = e.key.length === 1 ? e.key.toLowerCase() : e.key
        let wantToCopy = true;
        keys[currentKey] = true;

        userKeys.every(function (element) {
            if (!(element in keys)) {
                wantToCopy = false;
            }

            return wantToCopy;
        })

        if (wantToCopy) {
            if (window.getSelection) {
                const range = document.createRange();

                range.selectNode(this);
                window.getSelection().removeAllRanges();
                window.getSelection().addRange(range);
                navigator.clipboard.writeText(this.innerText).then(function () {
                        $.toast({
                            text: "The code has been copied to the clipboard", // Text that is to be shown in the toast
                            icon: 'success',
                            showHideTransition: 'slide',
                            allowToastClose: true,
                            hideAfter: 2000,
                            position: 'bottom-center',
                            textAlign: 'left',
                            loader: true,
                        });
                    }
                );
            }
        }
    })

    preTag.on("keyup", function (e) {
        delete keys[e.key.length === 1 ? e.key.toLowerCase() : e.key];
    })

    chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
        userKeys = request;

        $.toast({
            text: "New Key Binding has been set!",
            icon: 'success',
            showHideTransition: 'slide',
            allowToastClose: true,
            hideAfter: 2000,
            position: 'bottom-center',
            textAlign: 'left',
            loader: true,
        })

        sendResponse({status: 'ok'});
    });
})
