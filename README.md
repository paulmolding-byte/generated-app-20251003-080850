# VaporTrax

A retro-themed audio and video streaming application inspired by 90s web aesthetics.

[![Deploy to Cloudflare](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/paulmolding-byte/generated-app-20251003-072346)

VaporTrax is a visually striking media streaming platform that blends the functionality of modern services like Spotify with a nostalgic, retro-futuristic aesthetic. It allows users to browse, play, and create playlists of both audio (MP3) and video (MP4) content. The application features a distinct visual style reminiscent of early internet culture, utilizing pixel fonts, neon colors, glitch effects, and 3D wireframe elements. An administrator backend provides a simple interface for uploading new media metadata, including titles, artists, cover art, and media URLs.

## Key Features

-   **Retro-Futuristic UI:** A unique aesthetic inspired by 90s web design, featuring pixel fonts, neon glows, and CRT effects.
-   **Dual Media Support:** Stream both audio (MP3) and video (MP4) content seamlessly.
-   **Persistent Media Player:** Music and video playback continues as you navigate through the application.
-   **Playlist Management:** Create, view, and manage your personal playlists.
-   **Library & Likes:** Save your favorite tracks to your personal library.
-   **Admin Upload Panel:** A simple and secure backend interface for managing the media catalog.

## Technology Stack

-   **Frontend:** React, React Router, Vite
-   **Backend:** Cloudflare Workers, Hono
-   **State Management:** Zustand
-   **Styling:** Tailwind CSS, shadcn/ui
-   **Animation:** Framer Motion
-   **Icons:** Lucide React
-   **Persistence:** Cloudflare Durable Objects
-   **Runtime:** Bun

## Getting Started

Follow these instructions to get a local copy up and running for development and testing purposes.

### Prerequisites

-   [Bun](https://bun.sh/) installed on your machine.
-   [Wrangler CLI](https://developers.cloudflare.com/workers/wrangler/install-and-update/) for interacting with the Cloudflare platform.

### Installation

1.  **Clone the repository:**
    ```sh
    git clone https://github.com/your-username/vaportrax.git
    cd vaportrax
    ```

2.  **Install dependencies:**
    ```sh
    bun install
    ```

### Running the Development Server

To start the local development server, which includes both the Vite frontend and the Wrangler backend, run:

```sh
bun dev
```

This will start the application, typically on `http://localhost:3000`. The frontend will hot-reload on changes, and the worker will restart automatically.

## Project Structure

-   `src/`: Contains the frontend React application source code.
    -   `pages/`: Top-level page components.
    -   `components/`: Reusable UI components, including shadcn/ui elements.
    -   `lib/`: Utility functions and API client.
    -   `hooks/`: Custom React hooks.
-   `worker/`: Contains the Cloudflare Worker backend code built with Hono.
    -   `index.ts`: The main worker entry point.
    -   `user-routes.ts`: Application-specific API routes.
    -   `entities.ts`: Durable Object entity definitions.
-   `shared/`: Contains TypeScript types and mock data shared between the frontend and backend.

## Deployment

This project is designed for seamless deployment to the Cloudflare network.

1.  **Login to Wrangler:**
    Ensure you are logged into your Cloudflare account via the Wrangler CLI:
    ```sh
    wrangler login
    ```

2.  **Deploy the application:**
    Run the deploy script, which will build the application and deploy it using Wrangler.
    ```sh
    bun deploy
    ```

Alternatively, you can deploy your own version of VaporTrax with a single click.

[![Deploy to Cloudflare](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/paulmolding-byte/generated-app-20251003-072346)