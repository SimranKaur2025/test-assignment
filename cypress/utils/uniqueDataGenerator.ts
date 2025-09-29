import { v4 as uuidv4 } from "uuid";

export function generateUniqueServiceUrl(): string {
  return `https://httpbin.org/v/${Date.now().toString().slice(-5)}`;
}

// Generate a unique service name
export function generateUniqueServiceName(): string {
  return `service-${Date.now()}`;
}

export function getKongServiceUrl(): string {
  return "http://httpbin.konghq.com";
}

export function generateUniqRouteName(): string {
  return `route-${uuidv4().slice(0, 8)}`;
}

export function generateUniqRoutePath(): string {
  const random = Math.random().toString(36).slice(2, 5); // 3 chars
  return `/test/${random}`;
}

// generate an invalid URL
export function generateInvalidServiceUrl(): string {
  const random = Math.random().toString(36).slice(2, 8);
  return `invalid-url-${random}`;

}

export const INVALID_URLS: string[] = [
  "abc123",                  // random string
  "httpbin.org",             // missing protocol
  "www.api.kong.com",        // host only, no protocol
  "ftp://example.com",       // unsupported scheme
  "https://",                // protocol only
  "https://api. kong.com",   // whitespace in URL
  "https://api!kong.com",    // illegal char in host
  // ~82–85 chars, boundary case
  "https://this-is-a-very-long-invalid-url-example-that-should-break-validation-because-of-length.com"
];
