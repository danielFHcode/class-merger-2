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
