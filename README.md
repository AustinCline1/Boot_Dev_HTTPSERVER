# Chirper API - A Twitter Clone

This is a Twitter clone API built with TypeScript and Express, following the [Boot.dev](https://boot.dev) guide. The API allows users to create, read, and delete chirps (tweets) with authentication and content moderation.

## 🚀 Features

- User authentication with JWT
- Create and delete chirps
- View all chirps with sorting options
- Filter chirps by author
- Content moderation (automated word filtering)
- RESTful API design

## 📋 Prerequisites

- Node.js (v18 or higher)
- npm (Node Package Manager)
- PostgreSQL database

## 🛠 Installation

1. Clone the repository:
```git clone <your-repository-url> cd chirper-api```
2. Install dependencies: 
```npm install```
3.
3. Set up environment variables:
   Create a `.env` file in the root directory with the following variables:
```env DATABASE_URL=postgresql://username:password@localhost:5432/chirper JWT_SECRET=your_jwt_secret_here PORT=3000```
4. Initialize the database:
```npm run db:migrate```
5. Start the server:
```npm run dev```


## 🔑 API Endpoints

### Chirps

#### Create a Chirp
- **POST** `/chirps`
- Requires authentication
- Request body:
- json { "body": "Your chirp text here" }


#### Get All Chirps
- **GET** `/chirps`
- Optional query parameters:
    - `sort`: `asc` or `desc` (default: `asc`)
    - `authorId`: Filter chirps by author

#### Get Single Chirp
- **GET** `/chirps/:chirpId`

#### Delete Chirp
- **DELETE** `/chirps/:chirpId`
- Requires authentication
- Only the chirp author can delete their chirps

## 🔒 Authentication

The API uses JWT (JSON Web Tokens) for authentication. Include the token in the Authorization header:
```Authorization: Bearer <your_jwt_token>```

## ⚙️ Technical Details

- **Framework**: Express 5.1.0
- **Language**: TypeScript 5.8.3
- **Database ORM**: Drizzle ORM
- **Authentication**: JSON Web Tokens (jsonwebtoken 9.0.2)
- **Password Hashing**: bcrypt 6.0.0
- **Testing**: Vitest 3.1.4

## 🧪 Running Tests
```npm test```

## 📝 Content Moderation

The API includes automatic content moderation that:
- Limits chirps to 140 characters
- Filters out specific inappropriate words
- Replaces filtered words with '****'


