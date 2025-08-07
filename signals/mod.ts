/**
 * @fileoverview Reactive programming with signals and observers
 * @module signals
 */

/**
 * Type definition for a signal subscription function
 */
export type SignalSubscriber<T> = (value: T) => void;

/**
 * Type definition for a computed signal function
 */
export type ComputeFn<T> = () => T;

/**
 * Type definition for an effect function
 */
export type EffectFn = () => void | (() => void);

/**
 * Interface for a basic signal
 */
export interface Signal<T> {
  readonly value: T;
  setValue(value: T): void;
  subscribe(subscriber: SignalSubscriber<T>): () => void;
}

/**
 * Interface for a computed signal
 */
export interface ComputedSignal<T> {
  readonly value: T;
  subscribe(subscriber: SignalSubscriber<T>): () => void;
}

// Global state for tracking dependencies
let currentEffect: EffectFn | null = null;
let batchDepth = 0;
const batchedUpdates: (() => void)[] = [];

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
export function createSignal<T>(initialValue: T): Signal<T> {
  let value = initialValue;
  const subscribers: SignalSubscriber<T>[] = [];

  const signal: Signal<T> = {
    get value() {
      // Track dependency if we're inside an effect
      if (currentEffect) {
        createEffect(() => {
          signal.subscribe(currentEffect!);
        });
      }
      return value;
    },

    setValue(newValue: T) {
      if (value !== newValue) {
        value = newValue;
        if (batchDepth > 0) {
          batchedUpdates.push(() => notifySubscribers());
        } else {
          notifySubscribers();
        }
      }
    },

    subscribe(subscriber: SignalSubscriber<T>) {
      subscribers.push(subscriber);
      return () => {
        const index = subscribers.indexOf(subscriber);
        if (index > -1) {
          subscribers.splice(index, 1);
        }
      };
    },
  };

  function notifySubscribers() {
    for (const subscriber of subscribers) {
      subscriber(value);
    }
  }

  return signal;
}

/**
 * Create a computed signal that derives its value from other signals.
 *
 * @example
 * ```ts
 * const count = createSignal(0);
 * const doubled = createComputed(() => count.value * 2);
 * console.log(doubled.value); // 0
 * count.setValue(5);
 * console.log(doubled.value); // 10
 * ```
 */
export function createComputed<T>(computeFn: ComputeFn<T>): ComputedSignal<T> {
  let value: T;
  let isStale = true;
  const subscribers: SignalSubscriber<T>[] = [];
  const dependencies: (() => void)[] = [];

  function recompute() {
    // Clear previous dependencies
    dependencies.forEach(cleanup => cleanup());
    dependencies.length = 0;

    const prevEffect = currentEffect;
    currentEffect = () => {
      // This effect will be called when dependencies change
      isStale = true;
      const newValue = computeFn();
      if (value !== newValue) {
        value = newValue;
        if (batchDepth > 0) {
          batchedUpdates.push(() => notifySubscribers());
        } else {
          notifySubscribers();
        }
      }
    };

    value = computeFn();
    currentEffect = prevEffect;
    isStale = false;
  }

  function notifySubscribers() {
    for (const subscriber of subscribers) {
      subscriber(value);
    }
  }

  // Initial computation
  recompute();

  return {
    get value() {
      if (isStale) {
        recompute();
      }
      return value;
    },

    subscribe(subscriber: SignalSubscriber<T>) {
      subscribers.push(subscriber);
      return () => {
        const index = subscribers.indexOf(subscriber);
        if (index > -1) {
          subscribers.splice(index, 1);
        }
      };
    },
  };
}

/**
 * Create an effect that runs when its dependencies change.
 *
 * @example
 * ```ts
 * const count = createSignal(0);
 * const cleanup = createEffect(() => {
 *   console.log('Count is:', count.value);
 * });
 *
 * count.setValue(1); // "Count is: 1"
 * cleanup(); // Stop the effect
 * ```
 */
export function createEffect(effectFn: EffectFn): () => void {
  const dependencies: (() => void)[] = [];
  let cleanup: (() => void) | void;

  function runEffect() {
    // Clear previous dependencies
    dependencies.forEach(dep => dep());
    dependencies.length = 0;

    // Run cleanup from previous effect
    if (typeof cleanup === "function") {
      cleanup();
    }

    const prevEffect = currentEffect;
    currentEffect = () => runEffect();

    cleanup = effectFn();

    currentEffect = prevEffect;
  }

  runEffect();

  return () => {
    dependencies.forEach(dep => dep());
    if (typeof cleanup === "function") {
      cleanup();
    }
  };
}

/**
 * Batch multiple signal updates to prevent unnecessary re-computations.
 *
 * @example
 * ```ts
 * const a = createSignal(1);
 * const b = createSignal(2);
 * const sum = createComputed(() => a.value + b.value);
 *
 * batch(() => {
 *   a.setValue(10);
 *   b.setValue(20);
 * }); // sum only updates once at the end
 * ```
 */
export function batch(fn: () => void): void {
  batchDepth++;
  try {
    fn();
  } finally {
    batchDepth--;
    if (batchDepth === 0) {
      const updates = [...batchedUpdates];
      batchedUpdates.length = 0;
      updates.forEach(update => update());
    }
  }
}

/**
 * Create a mutable signal that can be written to.
 *
 * @example
 * ```ts
 * const [count, setCount] = createMutable(0);
 * console.log(count.value); // 0
 * setCount(5);
 * console.log(count.value); // 5
 * ```
 */
export function createMutable<T>(
  initialValue: T,
): [Signal<T>, (value: T) => void] {
  const signal = createSignal(initialValue);
  return [signal, (value: T) => signal.setValue(value)];
}

/**
 * Create a readonly signal from a value.
 *
 * @example
 * ```ts
 * const readonly = createReadonly(42);
 * console.log(readonly.value); // 42
 * // readonly.setValue(43); // Error: setValue doesn't exist
 * ```
 */
export function createReadonly<T>(value: T): Omit<Signal<T>, "setValue"> {
  const signal = createSignal(value);
  return {
    get value() {
      return signal.value;
    },
    subscribe: signal.subscribe.bind(signal),
  };
}

/**
 * Combine multiple signals into a single computed signal.
 *
 * @example
 * ```ts
 * const firstName = createSignal('John');
 * const lastName = createSignal('Doe');
 * const fullName = combine([firstName, lastName], ([first, last]) => `${first} ${last}`);
 * console.log(fullName.value); // "John Doe"
 * ```
 */
export function combine<T extends readonly unknown[], R>(
  signals: { [K in keyof T]: Signal<T[K]>; },
  combiner: (values: T) => R,
): ComputedSignal<R> {
  return createComputed(() => {
    const values = signals.map(signal => signal.value) as unknown as T;
    return combiner(values);
  });
}

/**
 * Create a signal that debounces updates.
 *
 * @example
 * ```ts
 * const source = createSignal('');
 * const debounced = createDebounced(source, 300);
 *
 * source.setValue('h');
 * source.setValue('he');
 * source.setValue('hello');
 * // debounced only updates once after 300ms with 'hello'
 * ```
 */
export function createDebounced<T>(
  source: Signal<T>,
  delay: number,
): ComputedSignal<T> {
  let timeoutId: number | undefined;
  const debounced = createSignal(source.value);

  source.subscribe((value) => {
    if (timeoutId !== undefined) {
      clearTimeout(timeoutId);
    }
    timeoutId = setTimeout(() => {
      debounced.setValue(value);
    }, delay);
  });

  return {
    get value() {
      return debounced.value;
    },
    subscribe: debounced.subscribe.bind(debounced),
  };
}

/**
 * Create a signal that throttles updates.
 *
 * @example
 * ```ts
 * const source = createSignal(0);
 * const throttled = createThrottled(source, 100);
 *
 * source.setValue(1);
 * source.setValue(2);
 * source.setValue(3);
 * // throttled updates at most once per 100ms
 * ```
 */
export function createThrottled<T>(
  source: Signal<T>,
  delay: number,
): ComputedSignal<T> {
  let lastUpdate = 0;
  let timeoutId: number | undefined;
  const throttled = createSignal(source.value);

  source.subscribe((value) => {
    const now = Date.now();
    const timeSinceLastUpdate = now - lastUpdate;

    if (timeSinceLastUpdate >= delay) {
      throttled.setValue(value);
      lastUpdate = now;
    } else {
      if (timeoutId !== undefined) {
        clearTimeout(timeoutId);
      }
      timeoutId = setTimeout(() => {
        throttled.setValue(value);
        lastUpdate = Date.now();
      }, delay - timeSinceLastUpdate);
    }
  });

  return {
    get value() {
      return throttled.value;
    },
    subscribe: throttled.subscribe.bind(throttled),
  };
}
