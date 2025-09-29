# Test Assignment – Kong Gateway Manager (Cypress + TypeScript)

## Overview
This repository contains automated tests for Kong Manager using Cypress with TypeScript.  
The goal of this assignment is to demonstrate:
- Test design with Page Object Model (POM)
- Writing critical positive and negative test cases
- Reusable utilities for unique test data generation  
- CI pipeline integration with GitHub Actions  

---
## Setup Instructions
```bash
# Clone the repo
git clone https://github.com/SimranKaur2025/test-assignment.git
cd test-assignment

# Install dependencies
npm install

# Start Kong Manager (Docker)
docker compose up -d

# Kong Manager will be available at:
# http://localhost:8002

# Run Cypress tests
npx cypress open   # Interactive mode
npx cypress run    # Headless mode (CI/CD)

## Environment Configuration
All tests run against a local *Kong Manager* instance on http://localhost:8002 
- `baseUrl` is defined directly in **cypress.config.ts** for simplicity.  
- In a real-world setup:
  - Environment-specific configs (**dev / stage / prod**) would be externalized in dotenv `.env` files.
  - CI/CD pipelines would inject these variables dynamically, ensuring no hardcoded URLs in tests.

---

## Framework & Dependencies
- The **`package.json`** defines Cypress test scripts for running all specs or individual ones, along with CI and Mochawesome reporting setup.  
- It also manages dependencies like Cypress, TypeScript,UUID, etc, supporting a clean and scalable test framework.  

## Test Scenarios: Implemented

### TC01 – Create Service via Full URL (HTTPS)
- Navigates through Workspaces → Gateway Services
- Creates a service with a unique name/URL,  
- Validates the success toast, and confirms it appears in the list with correct protocol and host.  
- Handles both Empty State and Toolbar add buttons by using a combined selector.  
- Cypress automatically retries until one is visible, ensuring reliable clicks across different UI states without branching logic.  
---
### TC02 – e2e_create_route
- Create a new Service from scratch.  
- Add a new Route associated with the created service.  
- Validate that the route is successfully listed under the service.  
> Note: This is an end-to-end scenario — it creates a service first and then a route to complete the flow.
---
### TC03 – error_validation_duplicate_servicename
- Attempt to create another service with an already existing name.  
- Verify that duplicate service name error validation is displayed.  
---
### TC04 – error_validation_invalid_url
- Added data-driven negative tests for the Full URL field using multiple invalid inputs:  
- Missing protocol, Random text, Whitespace, Overly long values  
- All trigger the same inline error message and keep Save disabled.  
- A valid URL clears the error and enables saving.  
---
### TC05 – Traffic flows through Proxy (200 OK)
- Tests validate service creation, routing, and proxy flows in Kong.  
Covers both:  
- Happy paths (200 OK with headers)  
- Negative cases (invalid URLs, duplicate names, 404 routes) 

### TC06 – Disable / Enable Service
- Creates a new Gateway Service, verifies it appears in the list.  
- Then disables and re-enables the service.  
- Screenshots are attached at each step for clarity.

---

## Test Data Cleanup (Delete Service)
- Each test run creates new services/routes.  
- Without cleanup, tests may fail on duplicates or leave stale data.  
- A `deleteService()` method is already implemented in **serviceDetailPage.ts**.  
- Currently **not invoked** in test cases (due to time constraint), but ready to be used in teardown or future enhancements.  

---

## Planned (Not Implemented – Due to Time Constraint)
- Create Service via Protocol/Host/Port/Path  
- Route Creation for an Existing Service (without creating service first)  
- Name, Tag, and Audit basics  
- Delete Service + Verify Removal  
- Host validation (malformed/invalid host)  
- Route path behavior: strip vs keep (default)    
- Delete Route → Verify traffic is blocked  
- Invalid upstream (unreachable host)  
- Path edge cases on Service
- Create Service with base path and Route without path
- Duplicate Route path conflict  

### Non-Functional & UX Validations
- List sorting & filtering behavior  
- Form autosuggest & help links usability  
- Field-level validation beyond required (covering all optional fields in future)  

Honestly, many more scenarios can be automated as the coverage expands — but this list highlights next priorities and the long-term vision. 

---

## Notes:
- Focused on critical workflows & required field validations due to time constraint.  
- Optional fields and their validations can be covered in future expansions.  
- Added a few negative test cases (invalid URL, duplicate service name) — many more can be added if needed.  
- Additional test cases are listed in the Planned section to show future vision and scalability. 
- Avoided using fixed waits like `cy.wait(5000)`.  
- Instead, rely on Cypress’s built-in retry mechanism with explicit timeouts for stability.
- This ensures tests wait just long enough for elements to render, improving both reliability and execution speed.     

