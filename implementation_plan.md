# KrushiMitra Enhancement — Implementation Plan

Adds 6 features on top of the existing MERN/Gemini stack: user onboarding, farmer profile context, contextual AI, chat history with sidebar, multi-language UI, and Claude-style layout — without removing or breaking any existing feature.

---

## Proposed Changes

### Backend Models

#### [MODIFY] [user.js](file:///e:/Research_Project/backend/models/user.js)
Add `farmerProfile` sub-document and `onboardingDone` flag to existing User schema.

```js
farmerProfile: {
  language: String,
  country: String,
  state: String,
  crop: String,
  soilType: String,
  irrigation: String,
  experience: String,
},
onboardingDone: { type: Boolean, default: false }
```

#### [NEW] [chat.js](file:///e:/Research_Project/backend/models/chat.js)
Chat session schema:
```js
{ userId, title, messages:[{role,content,createdAt}], context:{...farmerProfile}, createdAt }
```

---

### Backend Routes

#### [NEW] [chat.js](file:///e:/Research_Project/backend/routes/chat.js)
- `GET  /api/chat` — list user's chats (title + createdAt, no messages)
- `POST /api/chat` — create new chat session with initial context snapshot
- `GET  /api/chat/:id` — get single chat with full messages
- `DELETE /api/chat/:id` — delete a specific chat
- `POST /api/chat/:id/message` — add a message pair (user+ai) to an existing chat

#### [MODIFY] [auth.js](file:///e:/Research_Project/backend/routes/auth.js)
Add `PUT /api/auth/profile` — save farmerProfile + set `onboardingDone: true`. Protected by `requireAuth + ensureAuth`.

#### [MODIFY] [ai.js](file:///e:/Research_Project/backend/routes/ai.js)
- Accept `context` (farmerProfile) in request body alongside `question`
- Build contextual system prompt incorporating farmer data and language
- Keep RAG / existing Gemini call intact

#### [MODIFY] [index.js](file:///e:/Research_Project/backend/index.js)
Register `/api/chat` route.

---

### Frontend Store / Utils

#### [NEW] [store/farmerProfile.js](file:///e:/Research_Project/frontend/src/store/farmerProfile.js)
Helpers to get/set farmer profile and language in localStorage.

#### [NEW] [i18n/translations.js](file:///e:/Research_Project/frontend/src/i18n/translations.js)
Translation map for mr / hi / en covering all UI labels (onboarding, chat, buttons etc.).

---

### Frontend Components — New

#### [NEW] [components/Onboarding.jsx](file:///e:/Research_Project/frontend/src/components/Onboarding.jsx)
2-step flow:
- Step 1: Language picker (Marathi / Hindi / English)
- Step 2: Farmer details form (name, country, state, crop, soilType, irrigation, experience)
- On submit: PUT /api/auth/profile, save to localStorage, redirect to chat (`/`)

#### [NEW] [components/Sidebar.jsx](file:///e:/Research_Project/frontend/src/components/Sidebar.jsx)
- List of past chat sessions fetched from `/api/chat`
- "New Chat" button
- Click chat → navigate to `/?chatId=xxx`
- Delete button per chat
- Shows farmer name + language badge

#### [NEW] [components/ChatLayout.jsx](file:///e:/Research_Project/frontend/src/components/ChatLayout.jsx)
Wrapper for the Claude-style layout:
- Left: `<Sidebar>` (collapsible on mobile)
- Center: `<Chat>` with all messages
- No top Navbar (already in sidebar header)

---

### Frontend Components — Modified

#### [MODIFY] [components/Chat.jsx](file:///e:/Research_Project/frontend/src/components/Chat.jsx)
- Read `chatId` from URL query params; load existing messages on mount
- Read farmerProfile from localStorage and send as `context` to `/api/ai/ask`
- After each Q/A pair, POST to `/api/chat/:id/message` to persist
- If no chatId in URL → after first question, create new chat via `POST /api/chat` and update URL
- Use i18n labels (placeholder, button text) based on selected language
- Voice recognition lang follows selected language

#### [MODIFY] [components/Protected.jsx](file:///e:/Research_Project/frontend/src/components/Protected.jsx)
Redirect to `/login` (using `<Navigate>`) instead of showing a text message. Also add a general `AuthGuard` wrapper for all routes.

#### [MODIFY] [App.jsx](file:///e:/Research_Project/frontend/src/App.jsx)
- Add `/onboarding` route → `<Onboarding>`
- Wrap `<Chat>` in `<ChatLayout>` (sidebar + chat)
- Auth guard: unauthenticated → `/login`
- Post-login check: if `onboardingDone === false` → `/onboarding`
- Remove `<Navbar>` from Chat page (it's now in the sidebar header)

---

## Verification Plan

### Automated
- Backend starts with no errors: `npm start` in `/backend`
- Frontend builds with no errors: `npm run dev` in `/frontend`

### Manual (step-by-step)
1. Open `http://localhost:5173` — should redirect to `/login`
2. Register a new user — should redirect to `/onboarding`
3. Complete onboarding (pick Marathi, fill form) — should redirect to `/`
4. Chat page shows sidebar on left, empty chat center
5. Type a question, press Ask — AI response should use farmer context
6. Refresh page — chat reloads from history in sidebar
7. Click "New Chat" — blank chat, URL changes to no chatId
8. Ask another question — new chat appears in sidebar
9. Delete a chat from sidebar — it disappears
10. Logout → revisit `/` → back to `/login`
