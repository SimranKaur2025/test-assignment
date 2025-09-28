import { v4 as uuidv4 } from "uuid";

export function generateUniqueServiceUrl(): string {
  const env = Cypress.env("ENV") || "local";  // default to 'local' if not passed
  return `https://httpbin.org/anything/${env}-service-${Date.now()}`;
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
