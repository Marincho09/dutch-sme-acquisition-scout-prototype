# Security policy

## Reporting a vulnerability

Please report suspected vulnerabilities privately to the repository owner rather than opening a public issue. Include the affected route or component, reproduction steps, expected behavior, and impact where possible.

## Secrets and data handling

- `OPENAI_API_KEY` belongs only in `.env.local` during development or in server-side deployment environment variables.
- Environment files, build output, coverage, and generated research exports are excluded from Git.
- The MVP stores completed profiles in the current browser's local storage. Do not upload confidential target lists to a shared browser profile.
- Source URLs and model output are untrusted external input and should be reviewed before they are used in an investment decision or outreach.

Supported versions follow the latest commit on the `main` branch while the project remains an MVP.
