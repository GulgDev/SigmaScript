# SigmaScript
![Logo](https://gulgdev.github.io/SigmaScript/demo/logo.png)

Programming language made for sigma males.

[Demo](https://gulgdev.github.io/SigmaScript/demo) ● [Example repo](https://github.com/GulgDev/SigmaScriptExample)

## Getting started
To get started simply add SigmaScript loader to your web page:
```html
<script src="https://gulgdev.github.io/SigmaScript/sigmascript.js"></script>
```
Then, create a SigmaScript file (or write it directly in script tag like JavaScript code):
```html
<script type="text/sigmascript" src="index.ss"></script>
```
```ss
print "Hello world!";
```

## Features
### Syntax
You can change variable values using assignment operator:
```ss
x = 1;
```
You can define functions using `fn` statement:
```ss
fn example() {
    ret "something";
}
```
You can write if/else and while statements like this:
```ss
a = 1;
b = 1;
if a = b {
    print "a = b";
} else {
    print "a ≠ b";
}

x = 0;
while x < 10 {
    x = x + 1;
    print x;
}
```
You can write comments using `//`:
```ss
x = 1; // Very important value
```

### Types
There's no types in SigmaScript. If the operation is invalid you get `unknown`.

### Variables and functions
In SigmaScript, variables and functions are two different things. For example, you could create a variable and a function with the same name and use them without any problems:
```ss
fn x() {
    print "I'm working!";
}

x = 10;
x();
print x;
```
Thus, you can't use callbacks as functions can't be passed as arguments to other functions. But you can use the `fn` lib or lambda functions.

### Lambda functions
Lambda functions are function expressions that behave like wrapped functions:
```ss
use fn;

fn function() {
    print "Function is called!";
}

lambda = () => {
    print "Lambda is called!";
};

function();
call(lambda);

print "function = " @ function;
print "lambda = " @ lambda;
```

### Libraries
There's 8 default libs in SigmaScript: `js`, `dom`, `fn`, `ref`, `string`, `struct`, `array`, `math`. To use a lib in your program simply add `use` header:
```ss
use js;

// ...
```
You can also create custom libs using the `lib` directive:
```ss
lib example;

// ...
```
Lib files aren't executed unless they are used in non-lib scripts.

#### JS
JS lib allows you to access JavaScript functions and objects from SigmaScript. Use `js` function to evaluate JavaScript code from string. Use `js_get` and `js_set` to get/set properties of objects. Use `js_new` and `js_call` to call JavaScript object as a constructor/function. Use `js_object` to create an empty JS object and `js_array` to create an empty array. Use `js_call_method` to call a method of given object. There's `js_window` variable to access the `window` object.

#### DOM
DOM lib allows you to manipulate the DOM. Use `dom_title` to change the title of the page. Use `dom_create` to create a new element. Use `dom_find` to query an element by selector. Use `dom_append` to append a child to an element. Use `dom_remove` to remove an element. Use `dom_add_class`, `dom_remove_class`, `dom_toggle_class` to change element classes. Use `dom_set_text` or `dom_set_html` to change the contents of an element. Use `dom_get_attr` and `dom_set_attr` to change attributes of an element. Use `dom_css` to change CSS properties of an element. There are `dom_body` and `dom_head` to quickly access document body and head.

#### Fn
Fn lib allows you to create callbacks. Use `fn` to create a callback from function with given name. Use `call` to call wrapped function.

#### Ref
Ref lib allows you to create references to objects. Use `ref` to create a reference. Use `ref_get` and `ref_set` to get/set the current value of reference.

#### String
String lib allows you to manipulate strings. Use `string_at` to access characters of a string. Use `string_length` to get length of a string. Use `string_slice` to get substring of a string. Use `string_replace` to replace substring in a string.

#### Struct
Struct lib allows you to create and modify structures. Use `struct` to create a new struct. Use `struct_get` and `struct_set` to get/set fields of a structure.

#### Array
Array lib allows you to create and modify arrays. Use `array` to create a new array. Use `array_add` and `array_remove` to add/remove elements of array. Use `array_at` to access elements of array. Use `array_set` to modify elements of array. Use `array_length` to get length of array. Use `array_find` to find index of specific element in array.

#### Math
Math lib allows you to use math functions. It supports `abs`, `sign`, `sqrt`, `mod`, `sin`, `cos`, `tan`, `asin`, `acos`, `atan`, `sinh`, `cosh`, `tanh`, `asinh`, `acosh`, `atanh`, `exp`, `round`, `floor`, `ceil`, `random`, `randint`.

#### Native libraries
You can create your own JS libs and then use them in SS. See [this article](native-libs.md) to learn how to do it.

### SSX
Did you hear about JSX? Of course you did! Well, I'm glad to introduce you SigmaScriptX! It is way more convenient than just using boring DOM. To use SSX add the SigmaScriptX loader to your page (SSX loader includes SS loader so you don't have to add two different loader scripts):
```html
<script src="https://gulgdev.github.io/SigmaScript/sigmascriptx.js"></script>
```
And now use it in your project:
```ssx
use dom;

dom_append(dom_body, <h1>Hello world!</h1>);
```
See [this article](ssx.md) to learn more about SSX.

## Best practices
See [this article](best-practices.md) to be a good sigma-scripter!

## NodeJS
You can also run scripts in NodeJS environment by installing SigmaScript globally:
```
npm i -g sigmascript
```
And then:
```
npx sigmascript lib1.ss lib2.ss main.ss
```

## More info
Browse the source code if you want to know more about how this project works.

## Bugs
This project is mostly a joke but if there's any bugs please feel free to report them on GitHub. Libs can be buggy because I didn't want to debug them properly and make them safe. You clearly shouldn't use this in production.