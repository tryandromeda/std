# Andromeda Standard Library 🌌

A focused, type-safe standard library for the Andromeda TypeScript/JavaScript runtime.

[![Version](https://img.shields.io/github/v/release/tryandromeda/std)](https://github.com/tryandromeda/std/releases)
[![License](https://img.shields.io/badge/license-MPL--2.0-blue.svg)](LICENSE)
[![Tests](https://img.shields.io/github/workflow/status/tryandromeda/std/tests)](https://github.com/tryandromeda/std/actions)

## 🚀 Quick Start

```typescript
// Import specific modules
import { clamp, average } from "@andromeda/std/math";
import { createSignal, createEffect } from "@andromeda/std/signals";
import { chunk, unique } from "@andromeda/std/data";

// Or import everything
import * as std from "@andromeda/std";
```

## 📦 Modules

| Module | Description | Status |
|--------|-------------|--------|
| [🔢 **Math**](/math) | Mathematical functions, utilities, and calculations | ✅ Stable |
| [📡 **Signals**](/signals) | Reactive programming with signals and observers | ✅ Stable |
| [📊 **Data**](/data) | Data manipulation, arrays, and collection utilities | ✅ Stable |
| [📚 **Collections**](/collections) | Advanced data structures (Maps, Sets, Trees, etc.) | ✅ Stable |

## 🎯 Andromeda-Focused Design

This standard library is specifically designed and tested for the [Andromeda](https://github.com/tryandromeda/andromeda) TypeScript/JavaScript runtime. All modules have been verified to work within Andromeda's constraints and capabilities.

### Why This Focused Approach?

- **Runtime Compatibility**: All functions work reliably in Andromeda's environment
- **Performance Optimized**: Designed for Andromeda's specific performance characteristics  
- **Type Safety**: Full TypeScript support with comprehensive type definitions
- **Zero Dependencies**: Self-contained modules with no external dependencies
- **Tested & Verified**: Comprehensive test suite run on Andromeda runtime

## 🧪 Testing

All modules include comprehensive test suites:

```bash
# Test all modules
andromeda test

# Test specific module
andromeda test math/mod.test.ts
```

## 🤝 Contributing

Contributions are welcome! Please ensure all new code:

1. Works reliably in the Andromeda runtime
2. Includes comprehensive tests
3. Follows TypeScript best practices
4. Is properly documented with JSDoc comments

## 📄 License

This project is licensed under the MPL-2.0 License - see the [LICENSE](LICENSE) file for details.
