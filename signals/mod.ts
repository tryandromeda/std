/**
 * Create a signal with an initial value.
 *
 * @example
 * ```ts
 * const signal = createSignal(0);
 * signal.subscribe((value) => console.log(value));
 * signal.value = 1; // 1
 * signal.value = 2; // 2
 * ```
 */
export function createSignal<T>(initialValue: T) {
    let value = initialValue;
    const subscribers: ((value: T) => void)[] = [];
    return {
        get value() {
            return value;
        },
        set value(v) {
            value = v;
            for (const subscriber of subscribers) {
                subscriber(value);
            }
        },
        subscribe: (subscriber: (value: T) => void) => {
            subscribers.push(subscriber);
        },
    };
}
