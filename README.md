# SpaceNavigator

A reading room for NASA's Astronomy Picture of the Day. The latest frame fills the first screen. A short run of recent pictures follows. The archive keeps a cached window of the last forty days.

Pictures and explanations come from NASA. SpaceNavigator is an independent project and is not part of NASA.

## Run

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

`npm run build` does not need API keys. Picture pages render at request time. If `NASA_API_KEY` is missing, those pages show an unavailable state instead of crashing. A date that is not a real Astronomy Picture of the Day returns the not-found screen.

The pictures are requested from `https://api.nasa.gov/planetary/apod`. When that response is the site logo instead of the photograph, SpaceNavigator reads the same day's published entry from NASA Science so the page still shows the picture.

## Environment

Copy `.env.example` to `.env.local`.

| Variable | Purpose |
| --- | --- |
| `NASA_API_KEY` | NASA API key. `DEMO_KEY` is enough for light local use. |
| `RESEND_API_KEY` | Resend API key for the footer signup. |
| `NEWSLETTER_TO_EMAIL` | Inbox that receives signup notices. |

Signups are sent from `SpaceNavigator <onboarding@resend.dev>`. If either Resend variable is missing, the form returns an error and does not pretend the signup worked. Do not commit `.env` or `.env.local`.
