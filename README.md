![Almost Gist Cover](public/cover.png)

# 🗃️ Almost Gist

> Platform to share your markdowns with anyone.

## 🧰 Tech Stack

- [Appwrite](https://appwrite.io/)
- [Next.js](https://nextjs.org/)
- [Geist UI](https://geist-ui.dev/)

## ⚙️ Setup Server

1. Setup Appwrite server
2. Create project `almostGist`
3. Install Appwrite CLI
4. Login with `appwrite login`
5. Enter `cd backend`
6. Deploy database structure with `appwrite deploy collection`
7. Deploy database seeds with `sh seed.sh`
8. Deploy functions with `appwrite deploy function`
9. Set variables on deployed functions. There is `backend/functions` folder for each function. They all have `README.md` describing what variables they need
10. Setup `GitHub` OAuth provider

## 👀 Setup Client

1. Install libarries `npm install`
2. Update `endpoint` in `services/appwrite.ts` (Appwrite endpoint from server setup)
3. Start server `npm run dev`

## 🚨 Setup Moderation

1. Tell your moderator to create an account (sign in with GitHub)
2. Add user to `Moderators` team. They will be able to edit and delete all gists, comments and reactions

## 🚀 Deploy client

1. Build with `npm build`
2. Deploy from `.next`

> If deploying to static hosting, use `npm run generate` instead, and deploy files from `out` folder.

3. Deploy frontend and backend on the same domain. For example, `myapp.com` and `appwrite.myapp.com`
4. Add frontend hostname as a platform in Appwrite project

## 🤝 Contributing

To contribute to frontend, make sure to use the [Geist UI](https://geist-ui.dev/) design system. Also, make sure to use [TanStack Query](https://tanstack.com/query/v4/) for state management.

When contributing to backend-related logic, make sure to sync-up `backend/appwrite.json` by running the `appwrite init` commands in the `backend` folder.

## 🖼️ Screenshots

![Screenshot](public/screenshots/ss1.png)
![Screenshot](public/screenshots/ss2.png)
![Screenshot](public/screenshots/ss3.png)
![Screenshot](public/screenshots/ss4.png)
![Screenshot](public/screenshots/ss5.png)

## 🤖 Auto-generated documentation

This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `pages/index.tsx`. The page auto-updates as you edit the file.

[API routes](https://nextjs.org/docs/api-routes/introduction) can be accessed on [http://localhost:3000/api/hello](http://localhost:3000/api/hello). This endpoint can be edited in `pages/api/hello.ts`.

The `pages/api` directory is mapped to `/api/*`. Files in this directory are treated as [API routes](https://nextjs.org/docs/api-routes/introduction) instead of React pages.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.

## 🏗️ TODOs

- update & delete (gist, comment)
- moderation (if mod, update&delete button on others stuff)
