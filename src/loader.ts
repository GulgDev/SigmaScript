class Task<T> {
    private readonly promise: Promise<T>;
    private readonly callback: (result: T) => void;
    private readonly index: number;
    private readonly queue: Task<T>[];

    private state: "pending" | "ready" | "done" = "pending";
    private result: T;

    constructor(queue: Task<T>[], promise: Promise<T>, callback: (result: T) => void) {
        this.callback = callback;
        this.promise = promise;
        this.promise.then((result) => {
            this.result = result;
            this.state = "ready";
            this.update();
        });
        this.index = queue.length;
        this.queue = queue;
        queue.push(this);
    }

    private update() {
        if (this.state !== "ready" || (this.index !== 0 && this.queue[this.index - 1].state !== "done"))
            return;
        this.state = "done";
        this.callback(this.result);
        this.queue[this.index + 1]?.update();
    }
}

class Loader {
    private readonly type: string;
    private readonly load: (source: string) => void;
    private readonly queue: Task<string>[] = [];

    constructor(type: string, load: (source: string) => void) {
        this.type = type;
        this.load = load;
    }

    private loadScript(script: HTMLScriptElement) {
        if (script.getAttribute("type") === this.type)
            new Task(this.queue, (async () => {
                if (script.hasAttribute("src")) {
                    const response = await fetch(script.getAttribute("src"));
                    return await response.text();
                } else
                    return script.innerText;
            })(), (source) => this.load(source));
    }

    listen() {
        new MutationObserver((mutations) => {
            for (const mutation of mutations)
                if (mutation.type === "childList")
                    for (const node of mutation.addedNodes)
                        if (node instanceof HTMLScriptElement)
                            this.loadScript(node);
        }).observe(document, { childList: true, subtree: true });
        for (const script of document.getElementsByTagName("script"))
            this.loadScript(script);
    }
}

export function initLoader(type: string, load: (source: string) => void) {
    new Loader(type, load).listen();
}