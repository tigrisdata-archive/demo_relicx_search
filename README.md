# Relicx session search demo with Next.js (REST API)

This example shows how to implement a fullstack app in TypeScript with
[Next.js](https://nextjs.org/) using [React](https://reactjs.org/) and
[Tigris TypeScript SDK](https://docs.tigrisdata.com/typescript/).

## Getting started

### 1. Seed the data

```shell
npm run seed
```

This seeds the search index with the data in [scripts/data/session.json.gz](scripts/data/session.json.gz)

### 2. Start the app

```shell
npm run dev
```

The app is now running, navigate to http://localhost:3000/ in your browser to explore its UI.

## Next.js API routes

All the Next.js API routes are defined under `pages/api/`. We have following
files exposing endpoints:

- `/api/search?q={searchString}&page={page}&size={size}&order={order}`: Search sessions
  - Query Parameters
    - `searchString` (required): This searches sessions by `record.*`
    - `size` (optional): This specifies how many sessions should be returned in
      the result
    - `page` (optional): This specifies the page number to be returned when
      there are more than one page of search results
    - `order` (optional): The sort order for results in either ascending or
      descending order. The value can either `asc` or `desc`
  - Example
    - `curl http://localhost:3000/api/items/search?q=chrome&size=1`

<details>
<summary>Expand for a code walkthrough</summary>

## 👀 Code walkthrough

### 📂 File structure

```text
├── package.json
├── lib
│   ├── tigris.ts
├── models
│   └── todoItems.ts
└── pages
    ├── index.tsx
    └── api
        └── items
            └── search.ts
```

### 🪢 Search model definition

[models/session.ts](search/models/session.ts) - The app  has a single 
search index `session` that stores the relicx sessions.

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
