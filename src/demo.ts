import { runtime } from "./sigmascript/runtime/browser";
import { SigmaScript } from "./sigmascript/sigmascript";

const demos: { [key: string]: string } = {
    "hello-world": `print "Hello world!";`,
    "structures": `
print "loop from 1 to 10";
x = 0;
while x < 10 {
    x = x + 1;
    print x;
}
    
if x = 10 {
    print "x = 10";
} else {
    print "x ≠ 10";
}
`,
    "fibonacci": `
fn fib(n) {
    if n = 1 | n = 2 { ret 1; }
    ret fib(n - 1) + fib(n - 2);
}

print "10th Fibonacci number is " @ fib(10);
`,
    "dom": `
use dom;
use js;

prompt = js_get(js_window, "prompt");
color = js_call(prompt, "Enter background color", "white");
dom_css(dom_body, "background-color", color);
`,
    "ref": `
use ref;

fn inc(ref) {
    ref_set(ref, ref_get(ref) + 1);
}

x = ref(0);
print "x = " @ ref_get(x);

inc(x);
print "x = " @ ref_get(x);
`,
    "callbacks": `
use fn;

fn foo() {
    print "I am foo";
    ret 123;
}

fn bar(callback) {
    print "I am bar";
    print "I got " @ call(callback) @ " from callback";
}

bar(fn("foo"));
`,
    "string": `
use string;

str = string_format("Hello, %!", "world");
print str;
print string_length(str);
print string_replace(str, "world", "banana");
`,
    "struct": `
use struct;

fn point_new(x, y) {
    point = struct();
    struct_set(point, "x", x);
    struct_set(point, "y", y);
    ret point;
}

fn point_str(point) {
    x = struct_get(point, "x");
    y = struct_get(point, "y");
    ret "{ x=" @ x @ ", y=" @ y @ " }";
}

p1 = point_new(123, 321);
p2 = point_new(321, 123);

print "p1: " @ point_str(p1);
print "p2: " @ point_str(p2);
`,
    "array": `
use array;

array = array(1, 2, 3, 4, 5);
print array_at(array, 0);
array_remove(array, 0);
print array_at(array, 0);`
};

const sigmaScript = new SigmaScript(runtime);

const code = document.getElementById("code") as HTMLTextAreaElement;
const runButton = document.getElementById("run") as HTMLButtonElement;
const demoSelect = document.getElementById("demo-select") as HTMLSelectElement;

runButton.addEventListener("click", () => {
    if (!sigmaScript.load(code.value))
        console.error("invalid syntax");
});

demoSelect.addEventListener("change", () => {
    code.value = demos[demoSelect.value].trim();
});

code.value = demos["hello-world"].trim();