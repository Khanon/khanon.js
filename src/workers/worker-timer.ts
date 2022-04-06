const worker = new Worker('./workers/worker-timer.js');

interface Item {
    fn: () => void;
    context: any;
    id: number;
}

export const WorkerTimer = {
    intervalId: 0,
    timeoutId: 0,
    callbacksInterval: {} as Item,
    callbacksTimeout: {} as Item,
    setInterval: function (cb: () => void, interval: number, context: any) {
        this.intervalId++;
        const id = this.intervalId;
        this.callbacksInterval[id] = { fn: cb, context, id };
        worker.postMessage({
            command: 'interval:start',
            interval,
            id
        });
        return id;
    },
    setTimeout: function (cb: () => void, time: number, context: any) {
        this.timeoutId++;
        const id = this.timeoutId;
        this.callbacksTimeout[id] = { fn: cb, context, id };
        worker.postMessage({
            command: 'timeout:start',
            time,
            id
        });
        return id;
    },
    onMessage: function (e) {
        switch (e.data.message) {
        case 'interval:tick':
            const callbackInterval = this.callbacksInterval[e.data.id];
            if (callbackInterval && callbackInterval.fn) {
                callbackInterval.fn.apply(callbackInterval.context);
            }
            break;
        case 'interval:cleared':
            delete this.callbacksInterval[e.data.id];
            break;
        case 'timeout:done':
            const callbackTimeout = this.callbacksTimeout[e.data.id];
            if (callbackTimeout && callbackTimeout.fn) {
                callbackTimeout.fn.apply(callbackTimeout.context);
            }
            worker.postMessage({
                command: 'timeout:clear',
                id: e.data.id
            });
            break;
        case 'timeout:cleared':
            delete this.callbacksTimeout[e.data.id];
            break;
        }
    },
    clearInterval: function (id) {
        worker.postMessage({ command: 'interval:clear', id });
    },
    clearTimeout: function (id) {
        worker.postMessage({ command: 'timeout:clear', id });
    },
    clearAllOnContext: function (context) {
        Object.values(this.callbacksInterval)
            .filter((o) => o.context === context)
            .forEach((o) => this.clearTimeout(o.id));
        Object.values(this.callbacksTimeout)
            .filter((o) => o.context === context)
            .forEach((o) => this.clearTimeout(o.id));
    }
};
worker.onmessage = WorkerTimer.onMessage.bind(WorkerTimer);
