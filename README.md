# 🚀 MUEVETE – Backend E-commerce con Roles, Tickets y WebSockets

API RESTful para un e-commerce de productos de danza y merchandising,
desarrollada con Node.js, Express, MongoDB Atlas, Handlebars, Socket.io
y Passport JWT. Implementa autenticación por cookies, roles de usuario
(`admin` / `user`), gestión de carritos, generación de tickets con
validación de stock, y vistas en tiempo real mediante WebSockets.

## 🛠️ Tecnologías

| Tecnología | Uso |
|---|---|
| Node.js + Express | Servidor web |
| MongoDB Atlas + Mongoose | Base de datos y ODM |
| Passport + JWT | Autenticación vía cookies |
| bcrypt | Hasheo de contraseñas |
| express-handlebars | Motor de plantillas |
| Socket.io | Comunicación en tiempo real |
| Nodemailer | Recuperación de contraseña |
| dotenv | Variables de entorno |

## 📁 Estructura del proyecto

```
Backend II/
├── config/
├── src/
│   ├── config/
│   │   ├── config.js
│   │   ├── db.js
│   │   └── passport.config.js
│   ├── controllers/
│   ├── dao/
│   │   ├── models/
│   │   └── mongo/
│   ├── dtos/
│   ├── middlewares/
│   ├── repositories/
│   ├── routes/
│   ├── services/
│   ├── utils/
│   ├── views/
│   │   └── layouts/
│   ├── app.js
│   └── server.js
├── createAdmin.js
├── seed.js
└── package.json
```

## ⚙️ Instalación y configuración

### 1. Clonar el repositorio

```bash
git clone https://github.com/tu-usuario/backend-ii-ecommerce.git
cd backend-ii-ecommerce
```

### 2. Instalar dependencias

```bash
npm install
```

### 3. Configurar variables de entorno

Crear un archivo `.env` en la raíz basado en `.env.example`:

```env
PORT=3000
MONGODB_URI=mongodb+srv://<usuario>:<contraseña>@cluster0.xxxxx.mongodb.net/ecommerce_backend_ii
JWT_SECRET=tu_clave_secreta_muy_fuerte
COOKIE_NAME=access_token
NODEMAILER_USER=tu_email@gmail.com
NODEMAILER_PASS=tu_contraseña_aplicacion
NODEMAILER_HOST=smtp.gmail.com
NODEMAILER_PORT=587
CLIENT_URL_BASE=http://localhost:3000
PERSISTENCE=mongo
```

> Si no usás Nodemailer, podés dejar esos valores ficticios. La base de datos
> se crea automáticamente al insertar el primer documento.

### 4. Cargar productos de ejemplo

```bash
npm run seed
```

### 5. Crear usuario administrador

```bash
npm run createAdmin
```

### 6. Iniciar el servidor

```bash
npm run dev
```

Disponible en `http://localhost:3000`.

## 🔐 Credenciales de prueba

| Rol | Email | Contraseña |
|---|---|---|
| Admin | admin@example.com | admin123 |
| User | cliente@test.com | cliente123 |

## 🌐 Vistas disponibles

| URL | Descripción |
|---|---|
| `/products` | Catálogo con paginación, filtros y ordenamiento |
| `/products/:pid` | Detalle de producto |
| `/carts/:cid` | Vista del carrito |
| `/realtimeproducts` | Lista de productos en tiempo real (WebSockets) |
| `/ticket/:tid?cartId=...` | Comprobante de compra |
| `/home` | Bienvenida (redirige a `/products`) |

## 📡 Endpoints

### Autenticación

| Método | Endpoint | Descripción |
|---|---|---|
| POST | `/api/session/register` | Registra un usuario (`rol: user`) |
| POST | `/api/session/login` | Inicia sesión → devuelve cookie `access_token` |
| GET | `/api/session/current` | Usuario actual (DTO, sin password) |
| POST | `/api/session/logout` | Cierra sesión |
| POST | `/api/session/forgot-password` | Envía email de recuperación |
| POST | `/api/session/reset-password` | Restablece contraseña (token válido 1 hora) |

### Productos *(solo admin puede crear, actualizar o eliminar)*

| Método | Endpoint | Descripción |
|---|---|---|
| GET | `/api/products` | Lista con paginación, filtros y ordenamiento |
| GET | `/api/products/:pid` | Obtiene un producto por ID |
| POST | `/api/products` | Crea un producto |
| PUT | `/api/products/:pid` | Actualiza un producto |
| DELETE | `/api/products/:pid` | Elimina un producto |

**Parámetros de consulta para `GET /api/products`:**

- `limit` (default `10`) — cantidad por página
- `page` (default `1`) — número de página
- `sort` — `asc` o `desc` por precio
- `query` — filtro: `category:merchandising`, `status:true` o texto libre

```
/api/products?limit=3&page=2&sort=asc&query=category:merchandising
```

### Carritos *(requieren autenticación)*

| Método | Endpoint | Descripción |
|---|---|---|
| POST | `/api/carts` | Crea un carrito vacío |
| GET | `/api/carts/:cid` | Obtiene el carrito con productos populados |
| POST | `/api/carts/:cid/products/:pid` | Agrega un producto (suma cantidad si ya existe) |
| PUT | `/api/carts/:cid/products/:pid` | Actualiza la cantidad de un producto |
| DELETE | `/api/carts/:cid/products/:pid` | Elimina un producto del carrito |
| PUT | `/api/carts/:cid` | Reemplaza todo el carrito |
| DELETE | `/api/carts/:cid` | Vacía el carrito |
| POST | `/api/carts/:cid/purchase` | Finaliza la compra, genera ticket y actualiza stock |

## 🎫 Flujo de compra

Al llamar a `POST /api/carts/:cid/purchase`:

1. Se valida el stock de cada producto en el carrito
2. Los productos con stock suficiente se descuentan y se incluyen en el ticket
3. Los productos sin stock se devuelven como `failedProducts` (quedan en el carrito)
4. Se genera un ticket con código único, fecha, monto total y email del comprador
5. La respuesta incluye el ticket, los productos comprados, los fallidos y el total

## ⚡ WebSockets

La vista `/realtimeproducts` se conecta via Socket.io. Al agregar o eliminar
un producto desde esa vista, la lista se actualiza instantáneamente en todos
los clientes conectados. Eventos: `newProduct`, `deleteProduct`, `updateProducts`.

## 🧪 Flujo de prueba con Postman

1. `POST /api/session/register` — crear usuario
2. `POST /api/session/login` — la cookie `access_token` se guarda automáticamente
3. `GET /api/session/current` — verificar que no expone la contraseña
4. `POST /api/carts` — crear carrito y guardar el `_id`
5. `GET /api/products` — obtener un `productId` válido
6. `POST /api/carts/:cid/products/:pid` con `{ "quantity": 2 }`
7. `GET /api/carts/:cid` — ver el carrito
8. `POST /api/carts/:cid/purchase` — finalizar compra y recibir ticket
9. Login como admin → probar `POST`, `PUT`, `DELETE` en `/api/products`
10. Con usuario normal → verificar `403 Forbidden` al intentar lo mismo

## 🧑‍💻 Scripts

| Comando | Descripción |
|---|---|
| `npm run dev` | Servidor con Nodemon (recarga automática) |
| `npm run seed` | Carga productos de ejemplo |
| `npm run createAdmin` | Crea el usuario administrador |
| `npm start` | Servidor en modo producción |

## ❓ Preguntas frecuentes

**¿Por qué `GET /api/carts` devuelve 404?**
Solo se puede acceder a un carrito específico via `GET /api/carts/:cid`.

**¿Cómo sé qué `cartId` tengo?**
Desde `GET /api/session/current` (campo `cart`), o en `localStorage` si
agregaste productos desde el navegador.

**¿Puedo probar la recuperación de contraseña sin Nodemailer?**
No, requiere una cuenta real y las variables de entorno configuradas.
Para Gmail usá una contraseña de aplicación, no la contraseña normal.

**¿El admin puede ver el carrito de otro usuario?**
No. El middleware `handlePolicies` y la validación `req.user.cart === cid`
lo impiden.

## 🧑‍💻 Autor

Fabian Mareco
