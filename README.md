# 📸 ShadowX Image Uploader

<div align="center">
  <img src="https://readme-typing-svg.herokuapp.com?font=Montserrat&weight=600&size=32&pause=1000&color=61DAFB&center=true&vCenter=true&width=720&height=70&lines=ShadowX+Image+Uploader;Node.js+%7C+Express+%7C+MongoDB+%7C+EJS;Simple+and+Fast+Image+Sharing" alt="Typing SVG" />
  
  <div>
    <img src="https://img.shields.io/badge/Status-Production_Ready-2ea44f?style=for-the-badge&logo=vercel&logoColor=white" alt="Status" />
    <img src="https://img.shields.io/badge/Version-1.0.0-blue?style=for-the-badge&logo=semantic-release&logoColor=white" alt="Version" />
    <img src="https://img.shields.io/badge/License-MIT-yellow?style=for-the-badge&logo=open-source-initiative&logoColor=white" alt="License" />
  </div>
  
  <div style="margin-top: 10px;">
    <img src="https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white" alt="Node" />
    <img src="https://img.shields.io/badge/Express-000000?style=for-the-badge&logo=express&logoColor=white" alt="Express" />
    <img src="https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white" alt="MongoDB" />
    <img src="https://img.shields.io/badge/EJS-555555?style=for-the-badge&logo=ejs&logoColor=white" alt="EJS" />
    <img src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwindcss&logoColor=white" alt="Tailwind" />
  </div>
</div>

<p align="center">
  <a href="https://shadowx-image-uploader.onrender.com/" target="_blank">
    <img src="https://img.shields.io/badge/🚀_Live_Demo-Open_App-brightgreen?style=for-the-badge&logo=google-chrome&logoColor=white" alt="Live Demo" />
  </a>
  <br />
  <small>Hosted on Render • Auto-scaled • Public demo</small>
</p>

---

## 🚀 Overview

**ShadowX Image Uploader** is a minimal, production-ready web app to upload an image (as a data URL), store it with a name in MongoDB, and instantly fetch or browse it later. Built with Node.js, Express, MongoDB (Mongoose), and EJS views styled via Tailwind CDN.

- 🔼 Upload an image with a name
- 🔎 Find an image by name
- 🖼️ Preview a just-uploaded image via a shareable URL
- 🗂️ Browse all uploaded images

---

## 🛠️ Tech Stack

<div align="center">

| Frontend | Backend | Database | Tools |
|----------|---------|----------|-------|
| ![EJS](https://img.shields.io/badge/EJS-555555?style=flat-square&logo=ejs&logoColor=white) | ![Node](https://img.shields.io/badge/Node.js-43853D?style=flat-square&logo=node.js&logoColor=white) | ![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=flat-square&logo=mongodb&logoColor=white) | ![Tailwind](https://img.shields.io/badge/Tailwind-38B2AC?style=flat-square&logo=tailwindcss&logoColor=white) |
| ![HTML](https://img.shields.io/badge/HTML5-E34F26?style=flat-square&logo=html5&logoColor=white) | ![Express](https://img.shields.io/badge/Express-000000?style=flat-square&logo=express&logoColor=white) |  | ![Nodemon](https://img.shields.io/badge/Nodemon-76D04B?style=flat-square&logo=nodemon&logoColor=white) |

</div>

---

## 📂 Project Structure

```
📦 ImageUpload/
├── app.js                 # Express app, routes, server bootstrap
├── db/
│   └── db.js              # Mongoose connection (uses MONGO_URI)
├── model/
│   └── user.js            # Mongoose model: { name, imageUrl, createdAt }
├── public/
│   └── images/favicon/    # Static assets (favicon)
├── views/
│   ├── index.ejs          # Home: upload form + preview page
│   ├── find.ejs           # Find by name form + result
│   └── all.ejs            # Grid of all uploaded images
├── package.json
└── README.md
```

---

## 🔗 Pages & Flow

- **Home (`GET /`)**: Renders `index.ejs` with upload form. After successful upload, redirects to `GET /prev/:id` to show the saved image.
- **Preview (`GET /prev/:id`)**: Fetches the uploaded document by id and renders `index.ejs` in preview mode with the `fetchedImageUrl`.
- **Find by Name**
  - `GET /findImage`: Renders `find.ejs` with a search form
  - `POST /findImage`: Finds by `name` (lowercased) and renders `find.ejs` with the image or a friendly message
- **All Images (`GET /all/images`)**: Renders `all.ejs` to show all uploaded images in a responsive grid

```mermaid
flowchart LR
  A[Home /] -- Upload -> B((POST /upload))
  B --> C{201 Created?}
  C -- yes: id --> D[Preview /prev/:id]
  C -- no: error --> A
  A -- Find by name --> E[GET /findImage]
  E -- submit name --> F((POST /findImage))
  F -- found --> G[find.ejs shows image]
  F -- not found --> H[Message: Upload it]
  A -- See all --> I[GET /all/images]
  I --> J[all.ejs grid]
```

---

## 🧠 How It Works

1. User selects a file; browser `FileReader` converts it to a Base64 Data URL.
2. App builds `{ name, imageUrl }` payload and sends it to `POST /upload`.
3. Server validates inputs, normalizes `name`, ensures uniqueness, stores document.
4. Server returns the created document; client redirects to `/prev/:id` to show it.

```mermaid
sequenceDiagram
  autonumber
  actor U as User
  participant B as Browser (index.ejs)
  participant S as Express Server
  participant DB as MongoDB

  U->>B: Choose image + enter name
  B->>B: FileReader -> base64 (data URL)
  B->>S: POST /upload { name, imageUrl }
  S->>S: Validate body, lowercase name
  S->>DB: insertOne({ name, imageUrl, createdAt })
  DB-->>S: insertedId
  S-->>B: 201 { user: { _id, ... } }
  B->>S: GET /prev/:id
  S->>DB: findById(id)
  DB-->>S: doc { imageUrl }
  S-->>B: 200 index.ejs with fetchedImageUrl
```

---

## 🧩 API & Routes

| **Method** | **Path**         | **Purpose**                       | **Request Body**                 | **Response (success)**                     |
|------------|------------------|-----------------------------------|----------------------------------|--------------------------------------------|
| GET        | `/`              | Render home (upload form)         | -                                | HTML                                       |
| GET        | `/prev/:id`      | Show preview of uploaded image    | -                                | HTML (index.ejs with `fetchedImageUrl`)    |
| POST       | `/upload`        | Create image document             | `{ name, imageUrl }`             | `201 { message, user }`                    |
| GET        | `/findImage`     | Render find form                  | -                                | HTML                                       |
| POST       | `/findImage`     | Find by name and render result    | `{ name }`                        | HTML (find.ejs with image or message)      |
| GET        | `/all/images`    | Render grid of all images         | -                                | HTML (all.ejs list)                        |

- **Validation & Errors**
  - 400: Missing `name` or `imageUrl` on upload; missing `name` on find
  - 400: Duplicate `name` on upload (user already exists)
  - 500: Generic server/database errors

---

## 🗄️ Database Model

```js
// model/user.js
{
  name: String,        // required, unique by application logic (lowercased)
  imageUrl: String,    // required (Base64 data URL or remote URL)
  createdAt: Date      // default: now
}
```

```mermaid
classDiagram
  class User {
    String _id
    String name
    String imageUrl
    Date createdAt
  }
```

### Mongo Collection, Indexes, and Constraints

- Collection: `users`
- Suggested indexes:
  - `{ name: 1 }` unique: true (enforce uniqueness at DB level)
  - `{ createdAt: -1 }` (optimize recent listing)
- Size considerations: base64 images increase document size by ~33%; consider moving to object storage in future.

### Example Document

```json
{
  "_id": "66fa0e6b5c9f9a0012e7abcd",
  "name": "lucky",
  "imageUrl": "data:image/png;base64,iVBORw0KGgoAAA...",
  "createdAt": "2025-09-14T10:21:38.221Z"
}
```

### ER Perspective (single-collection)

```mermaid
erDiagram
  USERS {
    string _id PK
    string name UK
    string imageUrl
    date createdAt
  }
```

- Connection uses `MONGO_URI` via `db/db.js` with `mongoose.connect`.

---

## 🌐 Live Demo

<div align="center">
  <a href="https://shadowx-image-uploader.onrender.com/" target="_blank">
    <img src="https://img.shields.io/badge/Open_Live_Demo-ShadowX_Image_Uploader-2ea44f?style=for-the-badge&logo=google-chrome&logoColor=white" alt="Open Live Demo" />
  </a>
  <br/>
  <sub>If the instance is sleeping, please wait a few seconds for cold start.</sub>
</div>

---

## ⚙️ Installation & Setup

### Prerequisites
```bash
Node.js 18+
MongoDB Atlas or local MongoDB
```

### Quick Start
```bash
# 1) Clone
git clone <repo-url>
cd ImageUpload

# 2) Install deps
npm install

# 3) Configure env
# Create .env in project root with:
# MONGO_URI=mongodb+srv://<user>:<pass>@<cluster>/<db>?retryWrites=true&w=majority
# PORT=3000

# 4) Run
npm start
# App on http://localhost:3000
```

---

## 🖥️ Usage Guide

1) Open the Home page `/`.
2) Enter a unique name and choose an image file.
3) Click Upload. You will be redirected to `/prev/:id` to preview the stored image.
4) Use `/findImage` to fetch by name.
5) Visit `/all/images` to browse everything.

---

## 🛡️ Security Notes

- Uploaded content is stored as base64 in MongoDB; size is limited via JSON/body parser (`10mb`).
- Name uniqueness enforced in application (one image per name).
- Static assets served from `public/`.

---

## 🧭 Roadmap / Enhancements

- Persist files to object storage (e.g., S3/Cloudinary) vs base64 in DB
- Add delete/update image endpoints
- Add pagination to `/all/images`
- Add server-side validation for image MIME/size
- Add rate limiting & basic auth for admin operations

---

## 👨‍💻 Developer

<div align="center">
  <img src="https://readme-typing-svg.herokuapp.com?font=Montserrat&weight=500&size=24&pause=1000&color=61DAFB&center=true&vCenter=true&width=500&height=50&lines=Lucky+Longre;Full-Stack+Developer;Problem+Solver" alt="Developer" />
  
  <p><em>Computer Science Student & Aspiring Software Developer</em></p>
  
  <div style="margin: 20px 0;">
    <a href="https://lucky-longre.onrender.com/" target="_blank">
      <img src="https://img.shields.io/badge/🌐_Portfolio-Visit_Website-0A66C2?style=for-the-badge&logo=vercel&logoColor=white" alt="Portfolio" />
    </a>
    <a href="mailto:officialluckylongre@gmail.com">
      <img src="https://img.shields.io/badge/📧_Email-Contact_Me-D14836?style=for-the-badge&logo=gmail&logoColor=white" alt="Email" />
    </a>
    <a href="https://www.linkedin.com/in/lucky-longre/" target="_blank">
      <img src="https://img.shields.io/badge/💼_LinkedIn-Connect-0A66C2?style=for-the-badge&logo=linkedin&logoColor=white" alt="LinkedIn" />
    </a>
  </div>
  
  <p>
    <img src="https://img.shields.io/badge/Course-Computer_Science-brightgreen?style=flat-square" alt="Course" />
    <img src="https://img.shields.io/badge/Specialization-Full_Stack_Development-blue?style=flat-square" alt="Specialization" />
    <img src="https://img.shields.io/badge/Location-New_Delhi,_India-orange?style=flat-square" alt="Location" />
  </p>
</div>

### 💼 Technical Expertise

<div align="center">

| **Frontend Technologies** | **Backend Technologies** | **Database & Tools** |
|--------------------------|-------------------------|---------------------|
| HTML5, CSS3, JavaScript, Tailwind | Node.js, Express.js, REST APIs | MongoDB, Mongoose |
| EJS, Responsive Design | Authentication Systems | Git, GitHub |
| Basic jQuery/AJAX | File Upload Systems | Postman, VS Code |

</div>

### 🚀 Development Philosophy

- **Problem-Solving First**: Understand the user problem before writing code.
- **User-Centric Design**: Keep flows simple, fast, and accessible.
- **Security-Minded**: Validate inputs and protect data by default.
- **Performance Focused**: Favor efficient, maintainable implementations.
- **Continuous Learning**: Iterate with feedback and new best practices.

### 📈 Goals

- **Short-term**: Build and ship practical, production-ready web apps.
- **Medium-term**: Deepen expertise in scalable backends and cloud storage/CDNs.
- **Long-term**: Lead full-stack projects and mentor budding developers.

---

<p align="center">
  <img src="https://user-images.githubusercontent.com/73097560/115834477-dbab4500-a447-11eb-908a-139a6edaec5c.gif" />
  <br />
  <strong>ShadowX Image Uploader</strong> — Simple, fast, and ready to share.
</p>
