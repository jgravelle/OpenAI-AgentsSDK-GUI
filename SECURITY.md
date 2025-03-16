# Security Policy

**IMPORTANT**: This project is created by J. Gravelle (https://j.gravelle.us | j@gravelle.us) and is **not affiliated with, endorsed by, or sponsored by OpenAI**. It is an independent tool designed to work with the OpenAI Agents SDK.

## Reporting a Vulnerability

We take the security of OpenAI Agent Builder GUI seriously. If you believe you've found a security vulnerability, please follow these steps:

1. **Do not disclose the vulnerability publicly** until it has been addressed by the maintainers.
2. Email details of the vulnerability to J. Gravelle at j@gravelle.us.
3. Include as much information as possible, such as:
   - A description of the vulnerability
   - Steps to reproduce
   - Potential impact
   - Suggested fixes (if any)

## Response Process

When a security vulnerability is reported, the following process will be followed:

1. The maintainers will acknowledge receipt of the vulnerability report within 48 hours.
2. The team will investigate and determine the potential impact and severity.
3. A fix will be developed and tested.
4. A new release addressing the vulnerability will be published.
5. The vulnerability will be publicly disclosed after users have had sufficient time to update.

## Supported Versions

Only the latest version of OpenAI Agent Builder GUI receives security updates. Users are encouraged to keep their installations up to date.

## Security Best Practices

When using this application:

1. **API Keys**: Never share your OpenAI API key. The application stores it locally in your browser's localStorage and never transmits it to any server other than OpenAI's API.
2. **Agent Instructions**: Be cautious about the instructions you provide to agents, especially if they might handle sensitive information.
3. **Generated Code**: Review any generated code before using it in production environments.
4. **Updates**: Keep the application updated to benefit from the latest security patches.

## Third-Party Dependencies

This project uses several third-party dependencies. We regularly update these dependencies to incorporate security fixes. If you discover a security vulnerability in one of our dependencies, please report it according to the process above.