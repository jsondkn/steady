# Steady prototype

A client-side React and TypeScript prototype for the Steady wellbeing check-in journey.

## Run locally

1. Install Node.js 20 or later.
2. In this folder, run `npm install`.
3. Run `npm run dev`.
4. Open the local URL printed by Vite.

To make a production build, run `npm run build`. To preview that build locally, run `npm run preview`.

## Prototype assumptions and limits

- The 62/100 overview score is carried over from the supplied design and labelled as illustrative. It is not calculated from the check-in or health data.
- The seven-day mood chart and earlier comments are illustrative examples. Today's mood and optional note are held only in React memory and clear when the page is refreshed or the session ends.
- Sleep and step charts use static illustrative values. They are not connected to Apple Health, a wearable, or another live service.
- Activity ideas are static examples. The original “AI recommended” label is replaced with “Sample activities” because this prototype does not make AI recommendations.
- The reflection panel explains that no live AI chat is connected. It does not send the optional note anywhere.
- Starting an activity changes the local page state only. It does not run a timer, play media, or save progress.
- Support links open the listed phone/text actions or official NHS information. The app does not send data to those services.
- No user testing, clinical review, or validation with real wellbeing data has been completed.

## Deploy on Vercel

### Deploy from GitHub

1. Create a GitHub repository and push this project, including `package.json` and `package-lock.json`.
2. Sign in to Vercel and choose **Add New → Project**.
3. Import the GitHub repository and select the project.
4. Confirm the detected framework is **Vite**.
5. Set **Build Command** to `npm run build` and **Output Directory** to `dist`.
6. Leave **Install Command** as `npm install`. No environment variables are required.
7. Select **Deploy**. Vercel will provide a shareable URL when the build finishes.
8. Open the deployed URL on a phone-sized screen and test the check-in, overview, activity detail and Support links.

### Deploy with the Vercel CLI

1. Install the Vercel CLI with `npm install --global vercel`.
2. From this project folder, run `vercel` and follow the prompts to sign in and link the project.
3. For a production deployment, run `vercel --prod`.

The app uses client-side page state rather than URL routes, so no rewrite configuration is needed.
