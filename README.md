# Relicx session search demo with Next.js (REST API)

This example shows how to implement a fullstack app in TypeScript with
[Next.js](https://nextjs.org/) using [React](https://reactjs.org/) and
[Tigris TypeScript SDK](https://docs.tigrisdata.com/typescript/).

## Getting started

### 1. Install the packages

```shell
npm install
```

### 2. Setup the environment variables

Setup the client credentials locally. You can grab the client credentials from the
[Application Keys page for your project](https://console.preview.tigrisdata.cloud/project/demo_relicx_search/application-keys).
Copy the file `.env.example` to `.env` and fill in the values of the environment variables
`TIGRIS_CLIENT_ID` and `TIGRIS_CLIENT_SECRET`.

### 3. Start the app in development mode

```shell
npm run dev
```

The app is now running, navigate to http://localhost:3000/ in your browser to explore its UI.

<details>
<summary>Expand for a code walkthrough</summary>

## Deployment

The app is setup to be deployed to fly.io which is a modern application deployment platform.

The application can be deployed by using the following command:

```bash
fly deploy
```

## 👀 Code walkthrough

### 📂 File structure

```text
├── package.json
├── lib
│   ├── tigris.ts
├── search
│   └── models
        └── sessionv3.ts
└── pages
    ├── index.tsx
    └── api
        └── items
            └── search-meta.ts
            └── searchv2.ts
```

### 🪢 Search model definition

[models/sessionv3.ts](search/models/sessionv3.ts) - The app has a single
search index `sessionv3` that stores the relicx sessions.

### 🌐 Connecting to Tigris

[lib/tigris.ts](lib/tigris.ts) - Centralizes the Tigris client creation.
This is beneficial for serverless environments like Vercel Serverless
Functions, Netlify Functions, and AWS Lambda. It allows reusing the client
across requests.

</details>

## Next steps

- Check out the [Tigris docs](https://docs.tigrisdata.com/)
- Join our [Discord server](http://discord.tigrisdata.com/) and share your
  feedback
