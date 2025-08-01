## Overview

Test the app on =https://sterlingkeep-coding-challenge.vercel.app/

This project is a responsive social posting platform where users can:

- **Authenticate** via GitHub OAuth using Supabase
- **Create/view posts** with text or optional image uploads , the image are stored using vercel blob
- **Comment** on posts (text/images)
- **Like** on posts -**Share** Posts, wich create a dynamic route where the user can see the individual shared posts
- **Browse content** without authentication

**Key Technologies**:

- **Frontend**: Next.js 15 (App Router) with TypeScript
- **Backend**: Supabase (PostgreSQL database + Auth + Storage)
- **Session Managment**:Supabase Gitbug Oauth provider
- **Styling**: Tailwind CSS for responsive design
- **Styling**: Vercel blob for storing images
- **Deployment**: Vercel (frontend) + Supabase (backend)

## Architecture

- **Actions**:
- `/actions/auth/actions.ts`:Sign with github provider using supabase auth logic as well log off
- `/actions/auth/user-info.ts`:getUser function creates a Supabase client and tries to fetch the currently authenticated user on the server.
- `/actions/comments/create.ts`:Allows the logged in user to add a comment to a post by linking the comment to the post_id.
- `/actions/posts/create.ts`:Allows the logged in user to create a post , can add a text message, image or both
- `/actions/posts/getPostById.ts`:Get a single post previously shared by the user on a dynamic route
- `/actions/posts/getPost.ts`:Searchs for all the post in de database , this is used on the feed component
- `/actions/posts/like.ts`:adds a like to a specific post through its post_id

- **App Router**:
- `/app/api/callback/route.ts`:This API route handles OAuth login by exchanging a Supabase auth code for a session and redirects the user to the appropriate page based on the environment and login success.
- `/app/login/page.tsx`: Login page with github provider and redirect to the Feed page ('/')
- `/app/post/[id]/page.tsx`:Dynamic route generated by a share link. This route only bring one specific post by its post_id
- `/app/global.css`:Stored tailwind classes and smalls css animations used in the <Header> component
- `/app/layout.tsx`:Defines the global structure of the app, applying custom Google fonts, global styles, and a persistent <Header> component across all pages
- `/app/page.tsx`:This server component fetches the authenticated user on the server side using getUser(), and conditionally renders a CreatePostCard if the user is logged in. it also wrapps the content of other server side components and client component

- **Components**:

- `/Components/feed`
- `comment-form.tsx`:Area where the user can comment with text or image a post
- `create-post-card.tsx`:Conditional render component if a user is logged in.It allows to create a post with image and/or text
- `feed-form.tsx`:Area where all the posts are fetched and map to render as many <PostCard> as post there is
- `post-card.tsx`:Reusable components that renders the post info

- `/Components/layout`
- `header.tsx`:Sticky header that is present throught the layout of all areas

- `/Components/login`
- `login-card.tsx`:Login interface using Github provider

- `/Components/ui`
- `arcade-button.tsx`:Reusable button component that handles multiple user actions through the app

- **Hooks**
- `useCommentForm.tsx`:Handles and format the comment creation structure from the front end so its accepted by the backend
- `useComment.tsx`:Renders more comments according the limit set
- `useComment.tsx`:Handles the like actions from the client side

- **Lib**
- `/posts/format.posts.ts`:Helper function so that matches the structure we got from supabase to the one on Types Folder

- `/supabase/client.ts`: Initializes a Supabase client for making authenticated reads and writes to the database from the browser(more client side oriented).
- `/supabase/server.ts`: Initializes a Supabase client for performing server-side database operations, including reading/writing data and managing user sessions securely.(more server side oriented)

- `/vercelblob/upload.ts`:Handles the image upload to Vercel storage servers
- **Middleware**
- `middleware.ts`This middleware uses Supabase’s server client to check if the user is authenticated for actions that require an active session.

- **Types**
- `supabase.ts`:Types that represent the schema from supabase db
- `types.ts`:TypeScript interfaces used throughout the app to ensure consistent data structures.

### Backend (Supabase) with Postgres sql

## Methodology

I built this retro arcade-themed social platform using Next.js 15 as the core framework, using it's architecture for performance and developer experience. The App Router structure allowed me to cleanly separate concerns:
Server Components handle initial data fetching (posts, comments) directly from Supabase PostgreSQL, ensuring fast page loads with minimal client-side JavaScript.
Client Components manage interactive elements like the post creation form and real-time comment updates, using Supabase subscriptions for instant updates when new content appears.
For File storage, I chose Vercel Blob over Supabase Storage for its zero-config deployment synergy with next.js and edge network performance.
Decided to give it an arcade retro look to keep a theme for the challenge .

## Instructions

Test the app on =https://sterlingkeep-coding-challenge.vercel.app/
or dowload it locally

1. Clone the Repository
   Clone the repository and on the terminal=>cd respawnnotes
   npm install
   Create a .env.local file in the root directory and populate it with your Supabase & Vercel Blob keys:

# Supabase

NEXT_PUBLIC_SUPABASE_URL=your-supabase-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key (for admin actions)
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_GITHUB_REDIRECT=http://localhost:3000/api/auth/callback

# Vercel Blob (if using image uploads)

BLOB_READ_WRITE_TOKEN=your-vercel-blob-token

npm run dev
The app should now be running at:
👉 http://localhost:3000
