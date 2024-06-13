# Best practices
The main rule is:
> Пиши как сигма - это главное, остальное не так важно.

## Naming conventions
* Use *camel_case* to name functions and variables.
* Use *flatcase* or *kebab-case* to name components.
* Use *flatcase* to name libraries.

## File structure
Here's how you should organize your scripts:
1. `lib` directive
2. `use` directives
3. Functions
4. Components
5. Variables
6. Executable code

You should split big scripts into smaller ones with similar functions/components/variables.

## Libraries
Prefix internal functions/components/variables with an underscore (_). Prefix exported names with library name and an underscore:
```ss
lib example;

_internal_var = 1;

fn _internal_fn() {
    ret "internal lib data";
}

example_var = 2;

fn example_fn() {
    ret example_var + _internal_var;
}
```
Prefixing exported names is not necessary, but this makes it easier to understand which libraries functions belong to. Also, if you prefix exported names it is impossible for functions/variables/components from different libraries to overlap.

## Scopes
SigmaScript is very strict when it comes to scopes.

For example, you can not change variables in parent scope from function scope:
```ss
x = 0;

fn test() {
    x = 1;
}

test();
print x;
```
`x` will be still zero, even though the function `test` changes its value. But `test` only changes the `x` value in local function scope, so these changed values will be only accessible from inside the function.

If you want to mutate data from different scope (e.g. global variables, library variables) you should use references:
```ss
use ref;

x = ref(0);

fn test() {
    ref_set(x, 1);
}

test();
print ref_get(x);
```

## Callbacks
In SigmaScript, functions, components and variables are different things. They are stored in different places, so you can have components, functions and variables with the same name without any conflicts. This behaviour makes it impossible to pass a function as an argument. The reason is simple: everything in SS can be represented using JS strings. But you can't put function in a string. So, functions are stored in different namespace. This makes clear distinctions between functions and variables.

So instead, you could store reference to a function in a variable and then pass it as a callback. You can do this in two ways: using `fn` lib and using lambda functions.

### Lambda
Instead of using the `fn` method, you should use a more clear approach: lambda functions. Lambda functions are expressions that can be stored in variables and passed as arguments. They can be defined using `=>` syntax:
```ss
lambda = () => {
    print "Hello world!";
};
```

To call a lambda function simply use `call`:
```ss
use fn;

// ...

call(lambda);
```

## Tips
1. Don't try to change value of variables from parent scope. Use refs instead.
2. Avoid using `js` library when possible. Instead, use a native library (or write your own). It is hard to read and it runs slower than regular JS code.
3. Comment your code, but don't write too much comments.
4. Use SSX instead of `dom`.
5. Use lambda functions instead of `fn`.
6. Star this repository!