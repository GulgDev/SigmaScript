lib promises;

use fn;
use js;

_promise = js_get(js_global, "Promise");

fn promise(callback) {
    ret js_new(_promise, (resolve, reject) =>
        call(callback,
            (value) => js_call(resolve, value),
            (reason) => js_call(reject, reason)
        )
    );
}

fn promise_then(promise, callback) {
    js_call_method(promise, "then", callback);
}

fn promise_catch(promise, callback) {
    js_call_method(promise, "catch", callback);
}