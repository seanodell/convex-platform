# Convex + Next.js

A full-stack application template combining Convex (backend) with Next.js (frontend). Designed to work seamlessly in Builder Fusion.

## Getting Started (In Fusion)

**You don't need to do anything special!** When you open this project in Fusion:

1. The development server starts automatically
2. Both the backend and frontend run together
3. Your preview shows the live application at `http://localhost:3000`

That's it. You can start editing right away.

## Getting Started (Local Development)

If you're developing locally on your machine:

```bash
npm install
npm run dev
```

Then open `http://localhost:3000` in your browser.

## Making Changes

### Edit the Frontend (UI/Design)
- Files are in the `app/` folder
- Edit `app/page.tsx` to change what users see
- Changes appear instantly in your preview

### Edit the Backend (Data/Functions)
- Files are in the `convex/` folder
- Edit `convex/myFunctions.ts` to add/change backend logic
- Edit `convex/schema.ts` to change your database structure
- Changes appear instantly

## File Guide

```
app/                    ← Frontend (what users see)
├── page.tsx           ← Main page
├── layout.tsx         ← Page wrapper
└── globals.css        ← Styling

convex/                 ← Backend (data & logic)
├── myFunctions.ts     ← Backend functions
└── schema.ts          ← Database structure

components/             ← Reusable UI components
```

## What's Running?

When you start the project:

- **Frontend**: Next.js at `http://localhost:3000`
- **Backend**: Convex at `http://127.0.0.1:3210`
- **Your View**: Shows the frontend interface

Both communicate automatically. You don't need to worry about the backend URL—it's already configured.

## Troubleshooting

### Blank page or "Loading..." won't go away
- Wait a few seconds for everything to start
- Refresh the page
- Check that you're viewing `http://localhost:3000`, not another port

### Changes aren't showing up
- Make sure you saved the file
- Wait a second or two for the preview to refresh
- Try refreshing manually in the preview

### Error about connection
- The frontend can't reach the backend
- This usually fixes itself—wait 10 seconds and refresh
- If it persists, contact support

## Learn More

- **[Convex Docs](https://docs.convex.dev)** - Backend database and functions
- **[Next.js Docs](https://nextjs.org/docs)** - Frontend framework
- **[Convex + Next.js Guide](https://docs.convex.dev/home)** - Integration guide

## Next Steps

1. **Try it out**: Click "+ Generate random number" to add data
2. **Edit the UI**: Change text in `app/page.tsx`
3. **Add more features**: Modify `convex/myFunctions.ts` and `app/page.tsx`

Happy building! 🚀
