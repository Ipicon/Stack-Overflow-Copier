$(function () {
    const cardTextElement = $('#binding');
    const container = $('#container');
    const bindingButton = $('#binding-button');
    const newKeys = {};
    let bindingChange = false;
    let oldVal = ''

    function setBinding(keyList) {
        let cardText = '';
        let first = true;

        keyList.forEach(function (val) {
            if (!first) {
                cardText += ' + ';
            }

            cardText += val;
            first = false;
        });

        cardTextElement.html(cardText);
    }

    function resetGrid() {
        bindingChange = false;
        bindingButton.css('display', 'inline-block')
        container.css('display', 'None')
    }

    container.css('display', 'None')
    chrome.storage.sync.get(["keys"], function (items) {
        setBinding(items['keys']);
    });

    bindingButton.on('click', function (e) {
        oldVal = cardTextElement.text();
        cardTextElement.html('');
        bindingChange = true;

        $(this).css('display', 'None')
        container.css('display', 'inline-block')
    })

    $(document).on('keydown', function (e) {
        if (bindingChange) {
            const currentKey = e.key.length === 1 ? e.key.toLowerCase() : e.key

            newKeys[currentKey] = true;

            setBinding(Object.keys(newKeys));
        }
    })

    $(document).on('keyup', function (e) {
        delete newKeys[e.key.length === 1 ? e.key.toLowerCase() : e.key];
    })

    $('#cancel-button').on('click', function () {
        cardTextElement.html(oldVal);
        resetGrid();
    })

    $('#accept-button').on('click', async function () {
        const newBinding = cardTextElement.text().split("+").map(item => item.trim());

        resetGrid();

        chrome.tabs.query({
            active: true,
            currentWindow: true
        }, async tabs => {
            chrome.tabs.sendMessage(tabs[0].id, newBinding);
            await chrome.storage.sync.set({"keys": newBinding});
        })
    })
})

