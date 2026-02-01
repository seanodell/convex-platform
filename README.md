# Convex + Next.js

A full-stack application template combining Convex (backend) with Next.js (frontend). Designed for designers and developers to collaborate in Builder Fusion.

## Quick Start in Fusion

**No setup needed!** Just open this project in Fusion and start editing:

- The preview shows your changes **instantly**
- Edit the UI in the `app/` folder
- The backend message shows when you're in frontend-only mode

That's it.

## Editing for Designers

### I just want to edit the UI

Great! You're already in the right mode. The app runs in **frontend-only mode** by default:

- Edit `app/page.tsx` to change what users see
- Edit `app/globals.css` to change colors, fonts, spacing, etc.
- Edit files in `components/` to change reusable parts
- Changes appear instantly in the preview

The "Backend not connected" message is expected—it just means the data features aren't active yet.

### I want to test with real data

To add a backend and connect to real data:

1. Deploy Convex to a cloud environment
2. Get your Convex deployment URL
3. Set `NEXT_PUBLIC_CONVEX_URL` in `.env.local` to your deployed backend
4. Restart the project—full stack will work

Or, for local development:

```bash
npm run dev:fullstack
```

Note: Full stack local development works best on your own machine, not in Fusion.

## Local Development (On Your Machine)

If you're developing locally:

```bash
npm install
npm run dev
```

Then open `http://localhost:3000` in your browser.

### Frontend only:

```bash
npm run dev:frontend
```

### Full stack (frontend + local backend):

```bash
npm run dev:fullstack
```

## File Guide

### Frontend (UI/Design)

```
app/
├── page.tsx          ← Main page - edit this to change the UI
├── layout.tsx        ← Wraps all pages
└── globals.css       ← Styling - edit this to change colors, fonts, etc.

components/
├── ConvexClientProvider.tsx  ← Connects to backend (don't edit this)
```

### Backend (Data & Functions)

```
convex/
├── myFunctions.ts    ← Backend functions - edit to add/change logic
├── schema.ts         ← Database structure - edit to add/change data
└── _generated/       ← Auto-generated (don't edit)
```

## Troubleshooting

### Blank page / nothing shows

- Wait a few seconds for the page to load
- Try refreshing the preview
- Make sure you're viewing `http://localhost:3000` (not another port)

### Changes aren't showing up

- Did you save the file?
- Wait a second for the preview to refresh automatically
- Try refreshing manually

### "Backend not connected" message shows

This is normal! It means:
- You're in frontend-only mode (editing the UI)
- No database backend is connected yet
- The button and data features won't work, but you can still design the UI

To add a backend, see "I want to test with real data" above.

## Learn More

- **[Convex Docs](https://docs.convex.dev)** - Database & backend functions
- **[Next.js Docs](https://nextjs.org/docs)** - Frontend framework
- **[Convex + Next.js Integration](https://docs.convex.dev/home)** - Full guide

## Next Steps

1. **Try editing**: Change the text in `app/page.tsx`
2. **Change colors**: Edit `app/globals.css`
3. **Add components**: Create new files in `components/`
4. **Get the backend**: Follow "I want to test with real data" above

Happy building! 🚀
