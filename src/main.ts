type Constructor<Args extends any[], Output> = new (...args: Args) => Output;
type ConstructorOutput<Const> = Const extends Constructor<any[], infer Output>
    ? Output
    : never;
type ConstructorArgs<Const> = Const extends Constructor<infer Args, any>
    ? Args
    : never;

type Intersection<Types extends any[]> = Types extends [
    infer Type,
    ...infer Tail
]
    ? Type & Intersection<Tail>
    : {};
type Properties<T> = Pick<T, keyof T>;

/**
 * Takes in a couple of classes and return a combination of all of them that can be extended.
 * @param base The base class that is extended, this class is the only class you can use `instanceof` and `super` with.
 * @param constructors The other classes that are "extended", these classes act almost exactly same as a normal parent class but wont work with `instanceof` or `super`.
 * @returns A class that extends the base class and "extends" the constructors.
 * @example
 * class A {
 *   a() {}
 *   static x() {}
 * }
 *
 * class B {
 *   b() {}
 *   static y() {}
 * }
 *
 * class C extends mergeClasses(A,B) {
 *   c() {}
 *   static z() {}
 * }
 *
 * new C().a() // works!
 * new C().b() // works!
 * new C().c() // works!
 *
 * C.x() // works!
 * C.y() // works!
 * C.z() // works!
 */
export function mergeClasses<
    Base extends Constructor<any[], any>,
    Constructors extends Constructor<any[], object>[]
>(base: Base, ...constructors: Constructors) {
    const cls = class extends base {};
    Object.assign(cls, ...constructors);
    Object.assign(
        cls.prototype,
        ...constructors.map((constructor) => constructor.prototype)
    );

    // @ts-expect-error
    return cls as Properties<Base> &
        Properties<Intersection<Constructors>> &
        Constructor<
            ConstructorArgs<Base>,
            ConstructorOutput<Base> &
                Intersection<{
                    [K in keyof Constructors]: ConstructorOutput<
                        Constructors[K]
                    >;
                }>
        >;
}
