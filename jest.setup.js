import '@testing-library/jest-dom'

// Mock Next.js router
jest.mock('next/router', () => ({
  useRouter() {
    return {
      route: '/',
      pathname: '/',
      query: '',
      asPath: '',
      push: jest.fn(),
      pop: jest.fn(),
      reload: jest.fn(),
      back: jest.fn(),
      prefetch: jest.fn().mockResolvedValue(undefined),
      beforePopState: jest.fn(),
      events: {
        on: jest.fn(),
        off: jest.fn(),
        emit: jest.fn(),
      },
    }
  },
}))

// Mock Next.js image
jest.mock('next/image', () => ({
  __esModule: true,
  default: (props) => <img {...props} />,
}))

// Mock CSS modules
jest.mock('*.module.css', () => ({
  __esModule: true,
  default: (className) => className,
}))

// Mock CSS imports
jest.mock('*.css', () => ({}))

// Polyfill Web APIs for Node.js test environment
import { TextEncoder, TextDecoder } from 'util'

// Make TextEncoder/TextDecoder available globally
global.TextEncoder = TextEncoder
global.TextDecoder = TextDecoder

// Mock fetch API
global.fetch = jest.fn()

// Mock Response constructor for Next.js API routes
global.Response = class MockResponse {
  constructor(body, init = {}) {
    this.body = body
    this.status = init.status || 200
    this.headers = init.headers || {}
  }
  
  static json(data, init = {}) {
    return new MockResponse(JSON.stringify(data), init)
  }
  
  async json() {
    if (typeof this.body === 'string') {
      return JSON.parse(this.body)
    }
    return this.body
  }
}

// Mock Request constructor for Next.js API routes
global.Request = class MockRequest {
  constructor(input, init = {}) {
    this.url = typeof input === 'string' ? input : input.url
    this.method = init.method || 'GET'
    this.headers = new Map(Object.entries(init.headers || {}))
    this.body = init.body
    this.json = async () => {
      if (typeof this.body === 'string') {
        return JSON.parse(this.body)
      }
      return this.body
    }
  }
}

// Mock URL constructor with searchParams
global.URL = class MockURL {
  constructor(url, base) {
    this.url = url
    const [path, search] = url.split('?')
    this.pathname = path
    this._searchParams = new Map()
    
    if (search) {
      search.split('&').forEach(param => {
        const [key, value] = param.split('=')
        this._searchParams.set(key, decodeURIComponent(value || ''))
      })
    }
  }
  
  get searchParams() {
    return this._searchParams
  }
}
