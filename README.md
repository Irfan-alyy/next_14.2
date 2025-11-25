# Next.js App with Prisma, NextAuth & MongoDB

This project is a modern full-stack application built using:

* **Next.js (App Router)**
* **Prisma ORM**
* **MongoDB (as the database)**
* **NextAuth.js (Authentication)**
* **TypeScript**

It provides a ready-to-use setup for full-stack development with authentication and database access.

---

## 🚀 Getting Started

### 1. **Install Dependencies**

```bash
npm install
# or
yarn
# or
pnpm install
# or
bun install
```

---

## ⚙️ Environment Variables

Create a `.env` file in the root directory:

```env
DATABASE_URL="mongodb+srv://<username>:<password>@cluster.mongodb.net/<dbname>?retryWrites=true&w=majority"

NEXTAUTH_SECRET="<YourRandomSecret>"
NEXTAUTH_URL="http://localhost:3000"

# For providers (optional):
GITHUB_ID=""
GITHUB_SECRET=""
GOOGLE_CLIENT_ID=""
GOOGLE_CLIENT_SECRET=""
```

Generate a secure NextAuth secret:

```bash
npx auth secret
```

---

## 🗄️ Prisma Setup

### 1. **Initialize Prisma (already done if project contains schema.prisma)**

```bash
npx prisma init
```

### 2. **Push Prisma Schema to MongoDB**

```bash
npx prisma db push
```

### 3. **Open Prisma Studio**

```bash
npx prisma studio
```

---

## 🔐 NextAuth Configuration

This project uses **NextAuth (App Router)** with Prisma Adapter and MongoDB.

The main configuration file is stored at:

```
app/api/auth/[...nextauth]/route.ts,
src/lib/auth.ts
```

You can add providers such as GitHub, Google, Credentials, etc.

---

## ▶️ Run the Development Server

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Visit your app at:

👉 [http://localhost:3000](http://localhost:3000)

---

## 📂 Project Structure

```
app/
 ├── api/
 │    └── auth/
 │         └── [...nextauth]/route.ts   // NextAuth configuration
           ---- 
 ├── page.tsx                            // Main page
 └── layout.tsx                          // Root layout

prisma/
 └── schema.prisma                       // Prisma schema with MongoDB provider

lib/
 ├── auth.ts                              // Auth configurations/helpers
 └── prisma.ts                            // Prisma Client instance

.env                                      // Environment variables
```

---

## 📘 Learn More

* **Next.js Documentation** – [https://nextjs.org/docs](https://nextjs.org/docs)
* **Prisma Documentation** – [https://www.prisma.io/docs](https://www.prisma.io/docs)
* **NextAuth.js Documentation** – [https://next-auth.js.org](https://next-auth.js.org)
* **MongoDB Atlas** – [https://www.mongodb.com/atlas](https://www.mongodb.com/atlas)

---

## 🚀 Deployment

The easiest deployment platform for Next.js + Prisma + MongoDB:

### **Vercel**

* Connect your GitHub repo
* Add `.env` variables in Vercel dashboard
* Use MongoDB Atlas as your database

### Prisma Best Practice for Vercel

Prisma Client is automatically optimized for serverless environments.
