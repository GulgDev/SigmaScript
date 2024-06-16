lib fetch;

use fn;
use js;
use promises;
use struct;

_fetch = js_get(js_window, "fetch");

fn fetch(url) {
    ret promise((resolve, reject) => {
        promise_then(js_call(_fetch, url), (response) => {
            if !js_get(response, "ok") {
                call(reject, js_get(response, "statusText"));
            } else {
                promise_then(js_call_method(response, "text"), (text) => {
                    resp = struct();
                    struct_set(resp, "status", js_get(response, "status"));
                    struct_set(resp, "text", text);
                    call(resolve, resp);
                });
            }
        });
    });
}