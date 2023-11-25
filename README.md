# Class Merger

Simple, type-safe, multi-inheritance for typescript.

## Why?

In the [typescript docs](https://www.typescriptlang.org/docs/handbook/mixins.html) there are 2 proposed ways for multi-inheritance:

Method A:

```ts
const createA = <T extends new (...args: any[]) => any>(base: T = Object) =>
    class extends base {
        a() {}
    };
const createB = <T extends new (...args: any[]) => any>(base: T = Object) =>
    class extends base {
        b() {}
    };

const createC = <T extends new (...args: any[]) => any>(base: T = Object) =>
    class extends createA(createB(base)) {
        b() {}
    };
const C = createC();

// It works!
new C().a();
new C().b();
new C().c();
```

This is obviously not an ideal solution because it requires you to completely restructure how you write your classes.

Method B:

```ts
class A {
    a() {}
}
class B {
    b() {}
}

class C {
    c() {}
}
interface C extends A, B {} // typescript cannot infer the type of C by itself
applyMixins(C, [A, B]); // apply the prototype of A and B to the prototype of C

// It works!
new C().a();
new C().b();
new C().c();
```

This is better, but it's steal not ideal because you have to separately define C, define C's type, and extend C.

So, this package provides a way to merge multiple classes into one class that can be easily extended:

```ts
class A {
    a() {}
}
class B {
    b() {}
}

class C extends mergeClasses(A, B) {
    // types are automatically infered
    c() {}
}

// It works!
new C().a();
new C().b();
new C().c();
```

## Installation

You can install it with npm.

```bash
npm install class-merger
```

```ts
import { mergeClasses } from 'class-merger';

// code...
```

## API

### mergeClasses: (base: `Constructor`, ...constructors: `Constructor[]`) => `Constructor`

**Parameters**:

-   base: `Constructor` - The base class that is extended, this class is the only class you can use `instanceof` and `super` with.
-   ...constructors: `Constructor[]` - The other classes that are "extended", these classes act almost exactly same as a normal parent class but wont work with `instanceof` or `super`.

**Returns**: `Constructor` - A class that extends the base class and "extends" the constructors.

```ts
class A {
    a() {}
    static x() {}
}

class B {
    b() {}
    static y() {}
}

class C extends mergeClasses(A, B) {
    c() {}
    static z() {}
}

new C().a(); // works!
new C().b(); // works!
new C().c(); // works!

C.x(); // works!
C.y(); // works!
C.z(); // works!
```
