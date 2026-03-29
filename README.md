
<h1 align="center">MojiChat — Real-time Chat Application</h1>

<p align="center">
  <em>Ứng dụng nhắn tin thời gian thực — nhanh chóng, bảo mật và mượt mà.</em>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react&logoColor=white" alt="React"/>
  <img src="https://img.shields.io/badge/Vite-7-646CFF?style=flat-square&logo=vite&logoColor=white" alt="Vite"/>
  <img src="https://img.shields.io/badge/TypeScript-5.9-3178C6?style=flat-square&logo=typescript&logoColor=white" alt="TypeScript"/>
  <img src="https://img.shields.io/badge/Express-5-000000?style=flat-square&logo=express&logoColor=white" alt="Express"/>
  <img src="https://img.shields.io/badge/MongoDB-Mongoose-47A248?style=flat-square&logo=mongodb&logoColor=white" alt="MongoDB"/>
  <img src="https://img.shields.io/badge/Socket.IO-4-010101?style=flat-square&logo=socket.io&logoColor=white" alt="Socket.IO"/>
  <img src="https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white" alt="Tailwind CSS"/>
</p>

---
## 🚀 Demo
👉 [Trải nghiệm ngay tại đây](https://moji-chat-mern.vercel.app/)

---

## 📋 Mục lục

- [Giới thiệu](#-giới-thiệu)
- [Tính năng chính](#-tính-năng-chính)
- [Công nghệ sử dụng](#-công-nghệ-sử-dụng-tech-stack)
- [Kiến trúc dự án](#-kiến-trúc-dự-án)
- [Cài đặt & Khởi chạy](#-cài-đặt--khởi-chạy-getting-started)
- [Biến môi trường](#-biến-môi-trường-environment-variables)
- [API Endpoints](#-api-endpoints)
- [Cơ chế Refresh Token](#-cơ-chế-tự-động-refresh-token)
- [WebSocket Events](#-websocket-events)
- [Đóng góp dự án](#-đóng-góp-dự-án-contributing)
- [License](#-license)

---

## 💡 Giới thiệu

**MojiChat** là một ứng dụng trò chuyện trực tuyến (**Real-time Chat Application**) Full-stack được xây dựng theo mô hình **MERN Stack** (MongoDB, Express, React, Node.js). Ứng dụng hỗ trợ giao tiếp theo thời gian thực với giao diện hiện đại, thân thiện với người dùng, cùng hệ thống xác thực an toàn bằng Access Token / Refresh Token.

---

## ✨ Tính năng chính

| Tính năng | Mô tả |
|---|---|
| 💬 **Chat thời gian thực** | Gửi & nhận tin nhắn tức thì với độ trễ cực thấp nhờ WebSockets (Socket.IO) |
| 👥 **Chat nhóm** | Tạo và quản lý các cuộc trò chuyện nhóm nhiều thành viên |
| 👤 **Chat 1-1** | Nhắn tin riêng tư giữa hai người dùng |
| 🖼️ **Gửi hình ảnh** | Hỗ trợ chia sẻ hình ảnh trong cuộc trò chuyện, upload lên Cloudinary |
| 😀 **Emoji Picker** | Bộ chọn Emoji phong phú tích hợp sẵn (emoji-mart) |
| 🤝 **Hệ thống kết bạn** | Gửi / nhận / chấp nhận / từ chối lời mời kết bạn |
| 🟢 **Trạng thái Online** | Hiển thị trạng thái trực tuyến của bạn bè theo thời gian thực |
| 🔔 **Tin nhắn chưa đọc** | Badge thông báo số tin nhắn chưa đọc cho mỗi cuộc trò chuyện |
| ♾️ **Infinite Scroll** | Cuộn lên để tải thêm tin nhắn cũ (lazy loading) |
| 🌙 **Dark / Light Mode** | Chuyển đổi giao diện sáng / tối dễ dàng |
| 🔐 **Xác thực bảo mật** | JWT Access Token + Refresh Token (httpOnly Cookie) với cơ chế tự động gia hạn |
| 📱 **Responsive Design** | Giao diện tối ưu trên mọi kích thước màn hình |
| 📖 **API Docs (Swagger)** | Tài liệu API tương tác tại `/api-docs` |

---

## 🚀 Công nghệ sử dụng (Tech Stack)

### 💻 Frontend

| Công nghệ | Phiên bản | Vai trò |
|---|---|---|
| [React](https://react.dev/) | `19.2` | UI Library |
| [Vite](https://vitejs.dev/) | `7.3` | Build Tool & Dev Server |
| [TypeScript](https://www.typescriptlang.org/) | `5.9` | Type Safety |
| [Tailwind CSS](https://tailwindcss.com/) | `4.2` | Utility-first CSS Framework |
| [Shadcn UI](https://ui.shadcn.com/) + [Radix UI](https://www.radix-ui.com/) | — | Component Library (Accessible, Composable) |
| [Zustand](https://github.com/pmndrs/zustand) | `5.0` | State Management |
| [Socket.IO Client](https://socket.io/) | `4.8` | Real-time Communication |
| [Axios](https://axios-http.com/) | `1.13` | HTTP Client (kèm Interceptors auto refresh token) |
| [React Hook Form](https://react-hook-form.com/) + [Zod](https://zod.dev/) | — | Form Validation |
| [React Router](https://reactrouter.com/) | `7.13` | Client-side Routing |
| [Lucide React](https://lucide.dev/) | — | Icon Library |
| [Sonner](https://sonner.emilkowal.dev/) | — | Toast Notifications |
| [emoji-mart](https://github.com/missive/emoji-mart) | `5.6` | Emoji Picker |

### ⚙️ Backend

| Công nghệ | Phiên bản | Vai trò |
|---|---|---|
| [Node.js](https://nodejs.org/) | `v18+` | Runtime Environment |
| [Express](https://expressjs.com/) | `5.2` | Web Framework |
| [MongoDB](https://www.mongodb.com/) + [Mongoose](https://mongoosejs.com/) | `8.23` | Database & ODM |
| [Socket.IO](https://socket.io/) | `4.8` | Real-time Engine (WebSockets) |
| [JSON Web Token](https://github.com/auth0/node-jsonwebtoken) | `9.0` | Xác thực (Access Token) |
| [bcrypt](https://github.com/kelektiv/node.bcrypt.js) | `6.0` | Mã hóa mật khẩu |
| [Cloudinary](https://cloudinary.com/) | `2.9` | Cloud Image Storage |
| [Multer](https://github.com/expressjs/multer) | `2.1` | File Upload Middleware |
| [Swagger UI Express](https://github.com/scottie1984/swagger-ui-express) | `5.0` | API Documentation |
| [cookie-parser](https://github.com/expressjs/cookie-parser) | — | Đọc Cookie từ request |
| [Nodemon](https://nodemon.io/) | `3.1` | Hot Reload (Dev) |

---

## 🏗 Kiến trúc dự án

```
MOJI_CHAT/
├── backend/                          # 🖥️ Server-side (Node.js + Express)
│   ├── src/
│   │   ├── controllers/              # Business Logic
│   │   │   ├── authController.js     #   → Đăng ký, Đăng nhập, Refresh Token
│   │   │   ├── conversationController.js  #   → CRUD Cuộc trò chuyện
│   │   │   ├── friendController.js   #   → Quản lý bạn bè & lời mời
│   │   │   ├── messageController.js  #   → Gửi / Lấy tin nhắn
│   │   │   └── userController.js     #   → Thông tin người dùng
│   │   ├── models/                   # Mongoose Schemas
│   │   │   ├── Conversation.js       #   → Cuộc trò chuyện (direct / group)
│   │   │   ├── Friend.js            #   → Quan hệ bạn bè
│   │   │   ├── FriendRequest.js     #   → Lời mời kết bạn
│   │   │   ├── Message.js           #   → Tin nhắn (text / image)
│   │   │   ├── Session.js           #   → Phiên đăng nhập (Refresh Token)
│   │   │   └── User.js              #   → Người dùng
│   │   ├── middlewares/             # Express Middlewares
│   │   │   ├── authMiddleware.js    #   → Xác thực JWT
│   │   │   ├── friendMiddleware.js  #   → Validate nghiệp vụ bạn bè
│   │   │   ├── socketMiddleware.js  #   → Xác thực Socket.IO
│   │   │   └── uploadMiddleware.js  #   → Xử lý file upload (Multer)
│   │   ├── routers/                 # API Route Definitions
│   │   ├── socket/                  # Socket.IO Server Setup
│   │   ├── libs/                    # Database Connection
│   │   ├── swagger.json             # API Documentation
│   │   └── server.js                # Entry Point
│   ├── utils/                       # Helper Functions
│   └── package.json
│
├── frontend/                        # 🎨 Client-side (React + Vite + TypeScript)
│   ├── src/
│   │   ├── components/              # React Components
│   │   │   ├── auth/                #   → Đăng nhập, Đăng ký, ProtectedRoute
│   │   │   ├── chat/                #   → Chat UI (ChatWindow, MessageItem, ...)
│   │   │   ├── sidebar/             #   → Sidebar Navigation
│   │   │   ├── profile/             #   → Trang cá nhân
│   │   │   ├── friendRequest/       #   → Quản lý lời mời kết bạn
│   │   │   ├── AddFriendModal/      #   → Modal thêm bạn
│   │   │   ├── createNewChat/       #   → Tạo cuộc trò chuyện mới
│   │   │   ├── newGroupChat/        #   → Tạo nhóm chat
│   │   │   ├── skeleton/            #   → Loading Skeletons
│   │   │   └── ui/                  #   → Shadcn UI Components
│   │   ├── hooks/                   # Custom React Hooks
│   │   ├── lib/                     # Utilities
│   │   │   ├── axios.ts             #   → Axios Instance + Interceptors
│   │   │   └── utils.ts             #   → Helper Functions
│   │   ├── pages/                   # Page Components
│   │   │   ├── ChatAppPage.jsx     #   → Trang chính
│   │   │   ├── SignInPage.jsx      #   → Trang đăng nhập
│   │   │   └── SignUpPage.jsx      #   → Trang đăng ký
│   │   ├── services/               # API Service Layer
│   │   │   ├── authService.ts      #   → Auth API calls
│   │   │   ├── chatService.ts      #   → Chat API calls
│   │   │   ├── friendService.ts    #   → Friend API calls
│   │   │   └── userService.ts      #   → User API calls
│   │   ├── stores/                 # Zustand State Management
│   │   │   ├── useAuthStore.ts     #   → Authentication State
│   │   │   ├── useChatStore.ts     #   → Chat & Messages State
│   │   │   ├── useFriendStore.ts   #   → Friends State
│   │   │   ├── useSocketStore.ts   #   → Socket.IO Connection State
│   │   │   ├── useThemeStore.ts    #   → Dark/Light Theme State
│   │   │   └── useUserStore.ts     #   → User Profile State
│   │   ├── types/                  # TypeScript Type Definitions
│   │   ├── App.tsx                 # Root Component + Routing
│   │   ├── main.tsx                # Entry Point
│   │   └── index.css               # Global Styles
│   ├── tailwind.config.ts
│   ├── vite.config.ts
│   └── package.json
│
├── .gitignore
└── README.md
```

---

## 🛠 Cài đặt & Khởi chạy (Getting Started)

### Yêu cầu hệ thống (Prerequisites)

- [Node.js](https://nodejs.org/) phiên bản **v18.x** trở lên
- [MongoDB](https://www.mongodb.com/) (Atlas hoặc local)
- Tài khoản [Cloudinary](https://cloudinary.com/) (để lưu trữ hình ảnh)
- Trình quản lý gói: `npm` / `yarn` / `pnpm`

### 1️⃣ Clone Repository

```bash
git clone https://github.com/<your-username>/MojiChat.git
cd MojiChat
```

### 2️⃣ Cài đặt & Khởi chạy Backend

```bash
# Di chuyển vào thư mục backend
cd backend

# Cài đặt dependencies
npm install

# Tạo file .env và cấu hình biến môi trường (xem mục bên dưới)
cp .env.example .env

# Khởi chạy server (development mode)
npm run dev
```

> Server mặc định chạy tại `http://localhost:5001`

### 3️⃣ Cài đặt & Khởi chạy Frontend

```bash
# Mở terminal mới, di chuyển vào thư mục frontend
cd frontend

# Cài đặt dependencies
npm install

# Khởi chạy client (development mode)
npm run dev
```

> Client mặc định chạy tại `http://localhost:5173`

### 4️⃣ Build Production

```bash
# Trong thư mục frontend
npm run build

# Trong thư mục backend
npm start
```

---

## 🔑 Biến môi trường (Environment Variables)

### Backend (`backend/.env`)

```env
PORT=5001
MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/mojichat
ACCESS_TOKEN_SECRET=your_jwt_secret_key_here
CLIENT_URL=http://localhost:5173

# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

### Frontend (`frontend/.env.development`)

```env
VITE_API_URL=http://localhost:5001/api
```

### Frontend (`frontend/.env.production`)

```env
VITE_API_URL=https://your-production-api-domain.com/api
```

---

## 📡 API Endpoints

> 📖 Tài liệu API chi tiết có thể truy cập tại: `http://localhost:5001/api-docs` (Swagger UI)

### 🔓 Public Routes

| Method | Endpoint | Mô tả |
|---|---|---|
| `POST` | `/api/auth/signup` | Đăng ký tài khoản |
| `POST` | `/api/auth/signin` | Đăng nhập |
| `POST` | `/api/auth/refresh` | Làm mới Access Token |
| `POST` | `/api/auth/signout` | Đăng xuất |

### 🔒 Protected Routes *(Yêu cầu Access Token)*

| Method | Endpoint | Mô tả |
|---|---|---|
| `GET` | `/api/users/...` | Lấy / cập nhật thông tin người dùng |
| `GET` | `/api/conversations` | Lấy danh sách cuộc trò chuyện |
| `POST` | `/api/conversations` | Tạo cuộc trò chuyện mới |
| `GET` | `/api/messages/:conversationId` | Lấy tin nhắn của cuộc trò chuyện |
| `POST` | `/api/messages/:conversationId` | Gửi tin nhắn |
| `GET` | `/api/friends` | Lấy danh sách bạn bè |
| `POST` | `/api/friends/request` | Gửi lời mời kết bạn |
| `PUT` | `/api/friends/accept` | Chấp nhận lời mời kết bạn |
| `DELETE` | `/api/friends/reject` | Từ chối lời mời kết bạn |

---

## 🔐 Cơ chế Tự động Refresh Token

MojiChat triển khai hệ thống **xác thực hai lớp** (Dual Token Authentication) đảm bảo trải nghiệm người dùng liền mạch:

```
┌─────────┐       ①  Request + Access Token          ┌──────────┐
│         │ ──────────────────────────────────────→  │          │
│         │                                          │          │
│         │       ②  Response 403 (Token expired)    │          │
│         │ ←──────────────────────────────────────  │          │
│         │                                          │          │
│ CLIENT  │       ③  POST /auth/refresh              │  SERVER  │
│ (Axios  │          + Refresh Token (Cookie)        │          │
│  Inter- │ ──────────────────────────────────────→  │          │
│ ceptor) │                                          │          │
│         │       ④  New Access Token                │          │
│         │ ←──────────────────────────────────────  │          │
│         │                                          │          │
│         │       ⑤  Retry Original Request          │          │
│         │          + New Access Token              │          │
│         │ ──────────────────────────────────────→  │          │
│         │                                          │          │
│         │       ⑥  Success Response                │          │
│         │ ←──────────────────────────────────────  │          │
└─────────┘                                          └──────────┘
```

**Chi tiết quy trình:**

1. **Gắn Token tự động** — Axios Request Interceptor tự động gắn `Access Token` vào header `Authorization: Bearer <token>` cho mỗi request.
2. **Phát hiện hết hạn** — Khi server trả về `403 Forbidden`, Response Interceptor chặn lỗi này.
3. **Làm mới Token** — Interceptor gửi request ngầm tới `/api/auth/refresh` kèm `Refresh Token` (lưu trong httpOnly Cookie).
4. **Cập nhật & Retry** — Token mới được cập nhật vào Zustand store → Axios tự động retry request gốc bị thất bại.
5. **Fail-safe** — Nếu refresh cũng thất bại (ví dụ: Refresh Token hết hạn sau 14 ngày), user sẽ được đưa về trang đăng nhập. Retry tối đa **4 lần** để tránh vòng lặp vô hạn.

---

## 🔌 WebSocket Events

| Event | Hướng | Mô tả |
|---|---|---|
| `connection` | Client → Server | Kết nối Socket.IO (kèm xác thực JWT) |
| `online-users` | Server → Client | Broadcast danh sách user đang online |
| `join-conversation` | Client → Server | Tham gia phòng chat (room) khi tạo conversation mới |
| `new-message` | Server → Client | Nhận tin nhắn mới real-time |
| `disconnect` | Client → Server | Ngắt kết nối & cập nhật trạng thái offline |

---

## 🤝 Đóng góp dự án (Contributing)

Mọi đóng góp để giúp MojiChat hoàn thiện hơn đều được hoan nghênh! 🎉

1. **Fork** repository này
2. **Tạo branch** mới cho tính năng: `git checkout -b feature/ten-tinh-nang`
3. **Commit** thay đổi: `git commit -m "feat: thêm tính năng mới"`
4. **Push** lên branch: `git push origin feature/ten-tinh-nang`
5. **Tạo Pull Request** để được review


---

<p align="center">
  Authored by <strong>Hunter Nguyen (Hau Nguyen)</strong>
</p>
