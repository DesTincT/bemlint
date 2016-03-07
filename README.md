# bemlint
This linter checks attribute `class` in final `html` files for [BEM naming](https://github.com/bem/bem-naming) conventions.

Initiative cli code based on [ESLint](https://github.com/eslint/eslint)


## Installation

```
npm install -g bemlint
```

## Usage

```
bemlint test.html test2.html [options]
```


## Options

- __--elem/--e__ - element delimeter, default: 
```
bemlint test.html --elem='__'
```

- __--mod/--m__ - modifier and value delimeter, default: 
```
bemlint test.html --mod='_'
```

- __--wp/--wordPattern__ - regex, defines proper names for blocks, default: 
```
bemlint test.html --wp='[a-z0-9]+(?:-[a-z0-9]+)*'
```

- __--bp/--bem-prefixes__ - array of block names prefix for lint, example: 
```
bemlint test.html --bp='['b-', 'l-', 'helper-']'
```

- __--f/--format__ - specific output format, default: 
```
bemlint test.html --f='stylish'
```
Available: compact|checkstyle|html|json|table|tap|unix|visualstudio|junit|jslint-xml|html-template-message|html-template-page|html-template-result

## Rules
- `dublicate` - finds same classes in one attribute
- `isBlockElementInBlock` - Block and his element cannot be in one place, wrong => `class="b-block b-block__element`
- `isBlockModNoBlock` - Block mod should be paired with it's block, wrong => `class="b-block_mod_val"`
- `isElemModNoElement` - Element mod should be paired with it's element, wrong => `class="b-block__element_mod"`



## Versions

- __v1.2.0__ - minor fixes, readme update
- __v1.1.0__ - added formatters, message generator and few cli updates
