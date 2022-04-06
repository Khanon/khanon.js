const intervalIds = {};
const timeoutIds = {};
self.onmessage = function (e) {
    switch (e.data.command) {
    case 'interval:start':
        const intvalId = setInterval(function () {
            postMessage({
                message: 'interval:tick',
                id: e.data.id
            });
        }, e.data.interval);
        intervalIds[e.data.id] = intvalId;
        break;
    case 'interval:clear':
        clearInterval(intervalIds[e.data.id]);
        postMessage({
            message: 'interval:cleared',
            id: e.data.id
        });
        delete intervalIds[e.data.id];
        break;
    case 'timeout:start':
        const timeId = setTimeout(function () {
            postMessage({
                message: 'timeout:done',
                id: e.data.id
            });
        }, e.data.time);
        timeoutIds[e.data.id] = timeId;
        break;
    case 'timeout:clear':
        clearTimeout(timeoutIds[e.data.id]);
        postMessage({
            message: 'timeout:cleared',
            id: e.data.id
        });
        delete timeoutIds[e.data.id];
        break;
    }
};
