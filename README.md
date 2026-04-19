# 🛡️ Safety Hub v1 — Enterprise Safety Management System

[![Laravel](https://img.shields.io/badge/Laravel-11.x-FF2D20?style=for-the-badge&logo=laravel)](https://laravel.com)
[![React](https://img.shields.io/badge/React-18.x-61DAFB?style=for-the-badge&logo=react)](https://reactjs.org)
[![Ant Design](https://img.shields.io/badge/Ant%20Design-5.x-0170FE?style=for-the-badge&logo=ant-design)](https://ant.design)
[![Inertia.js](https://img.shields.io/badge/Inertia.js-v1.x-9553E9?style=for-the-badge&logo=inertia)](https://inertiajs.com)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4.x-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com)

**Safety Hub v1** is a specialized Enterprise Management System designed for the coal mining industry. Built with a robust Laravel back-end and a premium React + Ant Design front-end, it provides a seamless experience for managing complex master data, safety reporting, and role-based access control.

---

## ✨ Key Features

-   **🔐 Robust Security**: 
    -   JWT-based authentication integrated with Laravel Session.
    -   Granular Role-Based Access Control (RBAC) down to menu and action level.
-   **📊 Dynamic Dashboard**: Real-time statistics and historical data visualization.
-   **🛠️ Extensive Master Data**: 
    -   Comprehensive management for Companies, Departments, Locations, Shifts, Roster, Incidents, and more.
    -   Supports complex mining-specific data like CCOW, Unsafe Acts, and Injury Conditions.
-   **🎨 Premium UI/UX**:
    -   **Ant Design v5**: Modern, sleek components with highly customizable themes.
    -   **TanStack Table v8**: High-performance data tables with integrated search, pagination, and sorting.
    -   **Dark/Light Mode**: Full theme switching support with persistent preferences.
    -   **Responsive Design**: Optimized for both desktop and tablet workflows.
-   **🚀 Modern Stack**: Inertia.js bridge for a single-page application (SPA) feel without the complexity of a separate API.

---

## 🛠️ Technology Stack

| Layer | Technology |
|---|---|
| **Backend** | [Laravel 11](https://laravel.com) |
| **Frontend** | [React 18](https://react.dev) + [Inertia.js](https://inertiajs.com) |
| **UI Components** | [Ant Design v5](https://ant.design) |
| **Data Grid** | [TanStack Table v8](https://tanstack.com/table) |
| **Styling** | [Tailwind CSS v4](https://tailwindcss.com) |
| **Auth** | Sanctum + [Tymon JWT-Auth](https://github.com/tymondesigns/jwt-auth) |
| **Build Tool** | [Vite](https://vitejs.dev) |

---

## 🚀 Getting Started

### Prerequisites

-   PHP 8.2 or higher
-   Composer
-   Node.js & NPM
-   MySQL or SQLite

### Installation Steps

1.  **Clone the repository**
    ```bash
    git clone https://github.com/yourusername/safetyv1.git
    cd safetyv1
    ```

2.  **Install PHP Dependencies**
    ```bash
    composer install
    ```

3.  **Install Node Dependencies**
    ```bash
    npm install
    ```

4.  **Environment Setup**
    ```bash
    cp .env.example .env
    php artisan key:generate
    php artisan jwt:secret
    ```

5.  **Database Configuration**
    Update your `.env` file with your database credentials, then run:
    ```bash
    php artisan migrate --seed
    ```

6.  **Run Development Server**
    ```bash
    # In terminal 1 (Laravel)
    php artisan serve

    # In terminal 2 (Frontend)
    npm run dev
    ```

---

## 📁 Project Structure

```text
app/
├── Http/Controllers/        # Backend logic (Admin, MasterData, Auth)
├── Models/                 # Database models (User, Role, Menu, etc.)
resources/js/
├── Components/             # Reusable React components
├── Contexts/               # Global state (Theme, Auth)
├── Layouts/                # Dashboard and Auth layouts
├── Pages/                  # Inertia page components
│   ├── Admin/              # RBAC & User management
│   ├── MasterData/         # All 20+ Master Data modules
│   └── Dashboard/          # Analytics & Overview
├── Utils/                  # Helper functions & Token management
routes/
├── web.php                 # App routes (Inertia)
└── api.php                 # API endpoints (JWT)
```

---

## 🌍 Localization

The system currently defaults to Indonesian (`id_ID`) for Ant Design components to cater to localized mining operations, but it can be easily toggled to English in `app.jsx`.

## 📄 License

The Laravel framework is open-sourced software licensed under the [MIT license](https://opensource.org/licenses/MIT).

---

<p align="center">
  Built with ❤️ for Industrial Safety & Efficiency.
</p>
