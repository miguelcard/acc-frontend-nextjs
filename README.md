This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

[http://localhost:3000/api/hello](http://localhost:3000/api/hello) is an endpoint that uses [Route Handlers](https://beta.nextjs.org/docs/routing/route-handlers). This endpoint can be edited in `app/api/hello/route.ts`.

This project uses [`next/font`](https://nextjs.org/docs/basic-features/font-optimization) to automatically optimize and load Inter, a custom Google Font.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.

## Pre-launch checklist

Deep links for invitations (iOS Universal Links / Android App Links) are implemented but use placeholders. Find them all with `grep -r YOUR_ --exclude-dir=node_modules --exclude-dir=.next .`

- [ ] **Production domain:** replace `YOUR_PRODUCTION_DOMAIN` in `android/app/src/main/AndroidManifest.xml` and `ios/App/App/App.entitlements`, and set `FRONTEND_URL` in production.
- [ ] **Apple Team ID:** replace `YOUR_TEAM_ID` in `public/.well-known/apple-app-site-association`.
- [ ] **SHA-256 fingerprints:** replace `YOUR_DEBUG_SHA256_FINGERPRINT` and `YOUR_RELEASE_SHA256_FINGERPRINT` in `public/.well-known/assetlinks.json`. The release one is the Play App Signing certificate (Play Console > App Integrity), not the upload key.
- [ ] Make sure the host serves `/.well-known/*` over HTTPS without redirects or 404s.
- [ ] Test on real signed builds (TestFlight / Play internal track); emulators are unreliable for link verification.
