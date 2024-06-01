# SSX
SSX is a syntax extension for SigmaScript that lets you write HTML-like markup inside a SigmaScript file.
To start using it add the SSX loader to your page (or replace the SS loader):
```html
<script src="https://raw.githubusercontent.com/GulgDev/SigmaScript/dist/sigmascriptx.js"></script>
```

## Basics
With SSX, you can write HTML markup directly in your SigmaScript files:
```
use dom;

dom_append(dom_body, <h1>Hello world!</h1>);
```
SSX uses DOM lib under the hood to create elements. The above code is equivalent to this:
```
use dom;

h1 = dom_create("h1");
dom_append(h1, "Hello world!");
dom_append(dom_body, h1);
```
You can also define custom components using a function-like syntax:
```
use dom;

fn <message color="unset"> {
    ret <span style={"color: " @ color @ ";" }>{ children }</span>;
}

dom_append(dom_body, <message color="red">Hello world!</message>);
dom_append(dom_body, <message color="green">I'm green</message>);
dom_append(dom_body, <message>Default text color</message>);
```

## Example
```
use dom;

fn <app> {
    ret <div>
        <h1>SSX app</h1>
    </div>;
}

dom_append(dom_body,
    <app />
);
```