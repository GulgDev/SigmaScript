# SigmaScript CLI
You can install SigmaScript CLI using NPM:
```
npm i -g sigmascript
```
After that, you can run it using NPX:
```
npx sigmascript ...
```
You can pass list of `.ss`/`.ssx` files or globs to run/compile your scripts:
```
npx sigmascript lib1.ss lib2.ss main.ss
```

## Flags
`--compile`/`-C` flag compiles files to JS (`script.ss` -> `script.js`).

`--bundle`/`-B` flag bundles files into a JS bundle (`script.ss`, `lib1.ss`, `lib2.ss` -> `bundle.js`).

`--bundle-runtime`/`-R` flag can be used to insert SigmaScript runtime into your bundle. By default, you will need to add SS runtime explicitly to your page/environment to run bundled SS, but if you use this flag, runtime will be bundled with your scripts and you will get standalone JS file. You can specify one of the following runtimes: `node`, `browser`, `ssx`.

`--ssx`/`-X` flag can be used to allow SSX syntax in scripts. You won't be able to execute `.ssx` files, but you still can compile & bundle them.

If no flags were specified, your files will be ran in NodeJS environment.

**Notice**: You can only run your scripts using `node` runtime, but they can be compiled to any runtime (including `ssx`).

## Basic setup
You can add build scripts to your `package.json` file to simplify the process:
```json
{
  "name": "...",
  "private": "true",
  "scripts": {
    "build": "npx sigmascript --bundle=dist/bundle.js --bundle-runtime=node src/**.ss",
    "start": "npx sigmascript src/**.ss"
  }
}
```