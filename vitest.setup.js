// vitest.setup.js

import { beforeEach, afterEach, vi } from 'vitest'
// vitest.setup.js

// Mock global de fetch para todos los tests
beforeEach(() => {
  global.fetch = vi.fn()
})

afterEach(() => {
  vi.restoreAllMocks() // Limpia todos los mocks después de cada test
})
