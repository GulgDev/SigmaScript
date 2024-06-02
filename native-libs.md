# Native libs
You can write SS libraries in JavaScript using the SigmaScript JS API. Each library is a class extending `NativeLib`. Native JS library file can be organized like this:
```js
class ExampleLib extends NativeLib { // Export some variables & functions
    variables = { /* ... */ }; // Use this primarily for constants
    functions = { /* ... */ }; // Use this for SS function bindings

    // Define actual JS functions here
    // ...
}

sigmaScript.addLib("example", new ExampleLib(sigmaScript)); // Add lib to SigmaScript to make it useable in script files
```
Each variable must be a string, and each function must be a function which takes a list of arguments (string array) and current scope (object with the following properties: `variables`, `function` in SS and `components` only in SSX).

Libraries can access current SigmaScript instance using `this.sigmaScript`. You can also use global `sigmaScript`, but lib property is more preferable.

## Example
```js
class ExampleLib extends NativeLib {
    variables = {
        helloWorld: "Hello world!"
    };
    functions = {
        showMessage: ([ message ]) => this.showMessage(message)
    };

    showMessage(message) {
        alert(message);
    }
}

sigmaScript.addLib("example", new ExampleLib(sigmaScript));
```
```
use example;

showMessage(helloWorld);
```