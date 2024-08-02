/**
 * Shape Type
 */
export type Shape<R extends Rank> = [number, ...number[]] & { length: R };

/**
 * 1st dimentional shape.
 */
export type Shape1D = Shape<1>;

/**
 * 2nd dimentional shape.
 */
export type Shape2D = Shape<2>;

/**
 * 3th dimentional shape.
 */
export type Shape3D = Shape<3>;

/**
 * 4th dimentional shape.
 */
export type Shape4D = Shape<4>;

/**
 * 5th dimentional shape.
 */
export type Shape5D = Shape<5>;

/**
 * 6th dimentional shape.
 */
export type Shape6D = Shape<6>;

/**
 * Rank Types.
 */
export enum Rank {
    /**
     * Scalar   (magnitude only).
     */
    R1 = 1,

    /**
     * Vector   (magnitude and direction).
     */
    R2 = 2,

    /**
     * Matrix   (table of numbers).
     */
    R3 = 3,

    /**
     *  3-Tensor (cube of numbers)
     */
    R4 = 4,

    /**
     * Rank 5 Tensor
     */
    R5 = 5,

    /**
     * Rank 6 Tensor
     */
    R6 = 6,
}

/**
 * Array Map Types.
 */
export type ArrayMap =
    | Array1D
    | Array2D
    | Array3D
    | Array4D
    | Array5D
    | Array6D;

/**
 * 1D Array.
 */
export type Array1D = number[];

/**
 * 2D Array.
 */
export type Array2D = number[][];

/**
 * 3D Array.
 */
export type Array3D = number[][][];

/**
 * 4D Array.
 */
export type Array4D = number[][][][];

/**
 * 5D Array.
 */
export type Array5D = number[][][][][];

/**
 * 6D Array.
 */
export type Array6D = number[][][][][][];

/**
 * Infer the shape of an array.
 * 
 * @example
 * ```ts
 * inferShape([[[[1, 2], [3, 4]], [[5, 6], [7, 8]]]]); // [1, 2, 2, 2]
 * ```
 */
export function inferShape(arr: ArrayMap): number[] {
    const shape = [];
    let elem: ArrayMap | number = arr;
    while (Array.isArray(elem)) {
        shape.push(elem.length);
        elem = elem[0];
    }
    return shape;
}

/**
 * return the length of a shape.
 * 
 * @example
 * ```ts
 * shapeLength([1, 2, 3, 4]); // 24
 * ```
 */
export function shapeLength(shape: Shape<Rank>): number {
    let length = 1;
    shape.forEach((i) => length *= i);
    return length;
}

/**
 * convert a shape to a specific rank.
 * 
 * @example
 * ```ts
 * toShape([1, 2, 3], Rank.R1); // [1]
 * toShape([1, 2, 3], Rank.R2); // [1, 2]
 * toShape([1, 2, 3], Rank.R3); // [1, 2, 3]
 * toShape([1, 2, 3], Rank.R4); // [1, 2, 3, 1]
 * ```
 */
export function toShape<R extends Rank>(shape: Shape<Rank>, rank: R): Shape<R> {
    if (rank < shape.length) {
        const res = new Array(rank).fill(1);
        for (let i = 1; i < shape.length + 1; i++) {
            if (i < rank) {
                res[rank - i] = shape[shape.length - i];
            } else {
                res[0] *= shape[shape.length - i];
            }
        }
        return res as Shape<R>;
    } else if (rank > shape.length) {
        const res = new Array(rank).fill(1);
        for (let i = 1; i < shape.length + 1; i++) {
            res[rank - i] = shape[shape.length - i];
        }
        return res as Shape<R>;
    } else {
        return shape as Shape<R>;
    }
}

/**
 * convert a shape to a 1D shape.
 * 
 * @example
 * ```ts
 * shapeTo1D([1, 2, 3]); // [1]
 * ```
 */
export function shapeTo1D(shape: Shape<Rank>): Shape<1> {
    return toShape(shape, Rank.R1);
}

/**
 * convert a shape to a 2D shape.
 * 
 * @example
 * ```ts
 * shapeTo2D([1, 2, 3]); // [1, 2]
 * ```
 */
export function shapeTo2D(shape: Shape<Rank>): Shape<2> {
    return toShape(shape, Rank.R2);
}

/**
 * convert a shape to a 3D shape.
 * 
 * @example
 * ```ts
 * shapeTo3D([1, 2, 3]); // [1, 2, 3]
 * ```
 */
export function shapeTo3D(shape: Shape<Rank>): Shape<3> {
    return toShape(shape, Rank.R3);
}

/**
 * convert a shape to a 4D shape.
 * 
 * @example
 * ```ts
 * shapeTo4D([1, 2, 3]); // [1, 2, 3, 1]
 * ```
 */
export function shapeTo4D(shape: Shape<Rank>): Shape<4> {
    return toShape(shape, Rank.R4);
}

/**
 * iterate over a 1D array.
 * 
 * @example
 * ```ts
 * iterate1D(5, (i) => console.log(i)); // 0, 1, 2, 3, 4
 * ```
 */
export function iterate1D(length: number, callback: (i: number) => void): void {
    for (let i = 0; i < length; i++) {
        callback(i);
    }
}

/**
 * iterate over a 2D array.
 * 
 * @example
 * ```ts
 * iterate2D([2, 2], (i, j) => console.log(i, j)); // 0, 0, 0, 1, 1, 0, 1, 1
 * ```
 */
export function iterate2D(
    shape: Shape2D,
    callback: (i: number, j: number) => void,
): void {
    iterate1D(shape[0], (i) => iterate1D(shape[1], (j) => callback(i, j)));
}

/**
 * iterate over a 3D array.
 * 
 * @example
 * ```ts
 * iterate3D([2, 2, 2], (i, j, k) => console.log(i, j, k)); // 0, 0, 0, 0, 0, 1, 0, 1, 0, 1, 0, 0, 1, 0, 1, 1, 1, 0, 0, 1, 0, 1, 1, 1, 1
 * ```
 */
export function iterate3D(
    shape: Shape3D,
    callback: (i: number, j: number, k: number) => void,
): void {
    iterate1D(
        shape[0],
        (i) =>
            iterate1D(shape[1], (j) =>
                iterate1D(shape[2], (k) => callback(i, j, k))),
    );
}

/**
 * iterate over a 4D array.
 * 
 * @example
 * ```ts
 * iterate4D([2, 2, 2, 2], (i, j, k, l) => console.log(i, j, k, l)); // 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 1, 0, 0, 0, 0, 1, 0, 0, 1, 0, 1, 0, 0, 1, 0, 1, 1, 0, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 1, 0, 0, 0, 1, 0, 1, 0, 1, 0, 0, 1, 0, 1, 1, 0, 0, 1, 0, 1, 0, 1, 0, 0, 1, 0, 1, 1, 1, 0, 0, 0, 1, 0, 0, 1, 0, 1, 0, 0, 0, 1, 0, 1, 0, 1, 0, 0, 1, 0, 1, 1, 0, 0, 0, 1, 0, 1, 0, 1, 0, 0, 1, 0, 1, 1, 1, 0, 0, 1, 0, 1, 0, 1, 0, 0, 1, 0, 1, 1, 1, 0, 1, 0, 0, 0, 1, 0, 1, 0, 1, 0, 0, 1, 0, 1, 1, 0, 0, 1, 0, 1, 0, 1, 0, 0, 1, 0, 1, 1, 1, 0
 * ```
 */
export function iterate4D(
    shape: Shape4D,
    callback: (i: number, j: number, k: number, l: number) => void,
): void {
    iterate1D(
        shape[0],
        (i) =>
            iterate1D(shape[1], (j) =>
                iterate1D(shape[2], (k) =>
                    iterate1D(shape[3], (l) =>
                        callback(i, j, k, l)))),
    );
}
