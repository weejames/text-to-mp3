# Text to MP3

A proof of concept that takes any url, extracts the content and uses AWS Polly to convert the text into an MP3.

Requires
* Node.JS v6.10.0
* An API Key for [Mercury](https://mercury.postlight.com/web-parser/)
* AWS credentials with permissions to access AWS Polly

Install with

```bash
npm install
```

Run with

```bash
MERCURY_API_KEY=KEY_IN_HERE node index.js URL_HERE
```
