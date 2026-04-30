# 🚀 Backend II - Ecommerce con Roles, Tickets y WebSockets

## 📖 Descripción

API RESTful para un e-commerce de productos de danza y merchandising, desarrollada con **Node.js**, **Express**, **MongoDB Atlas**, **Handlebars**, **Socket.io** y **Passport JWT**. Implementa autenticación por cookies, roles de usuario (`admin` / `user`), gestión de carritos de compra, generación de tickets por compra con validación de stock, y vistas en tiempo real mediante WebSockets.

Proyecto final para el curso **Backend II** de Coderhouse.

---

## 🛠️ Tecnologías utilizadas

- **Node.js** + **Express** – Servidor web
- **MongoDB Atlas** + **Mongoose** – Base de datos y ODM
- **Passport** + **JWT** – Autenticación vía cookies
- **bcrypt** – Hasheo de contraseñas
- **express-handlebars** – Motor de plantillas
- **Socket.io** – Comunicación en tiempo real
- **Nodemailer** – Recuperación de contraseña (opcional)
- **dotenv** – Variables de entorno
- **Postman** – Pruebas de API (recomendado)

---

## 📁 Estructura del proyecto (arquitectura por capas)
Backend II/
├── .env.example
├── package.json
├── seed.js # Carga productos iniciales
├── createAdmin.js # Crea usuario administrador
├── README.md
├── config/
│ └── config.js # Configuración centralizada
├── src/
│ ├── app.js # Configuración de Express, Handlebars, Socket.io
│ ├── server.js # Punto de entrada (levanta el servidor)
│ ├── utils.js # Utilidad __dirname para ES modules
│ ├── dao/
│ │ ├── factory.js # Patrón Factory (persistencia)
│ │ ├── models/ # Modelos Mongoose
│ │ └── mongo/ # DAOs específicos para MongoDB
│ ├── repositories/ # Capa de repositorios
│ ├── controllers/ # Lógica de negocio
│ ├── routes/ # Definición de rutas
│ ├── middlewares/ # handlePolicies, errorHandler, authJwt
│ ├── utils/ # bcrypt, jwt, cookieExtractor, mailer
│ ├── dtos/ # Data Transfer Object (UserDto)
│ ├── services/ # Servicios (product, cart, ticket)
│ ├── views/ # Plantillas Handlebars
│ └── public/ # Archivos estáticos (CSS, JS)
└── logs/ # (opcional)



---

## ⚙️ Instalación y configuración

### 1. Clonar el repositorio
```bash
git clone https://github.com/tu-usuario/backend-ii-ecommerce.git
cd backend-ii-ecommerce
2. Instalar dependencias
bash
npm install
3. Configurar variables de entorno
Crea un archivo .env en la raíz basado en .env.example:

env
PORT=3000
MONGODB_URI=mongodb+srv://<usuario>:<contraseña>@cluster0.xxxxx.mongodb.net/ecommerce_backend_ii?retryWrites=true&w=majority
JWT_SECRET=tu_clave_secreta_muy_fuerte
COOKIE_NAME=access_token
NODEMAILER_USER=tu_email@gmail.com
NODEMAILER_PASS=tu_contraseña_aplicacion
NODEMAILER_HOST=smtp.gmail.com
NODEMAILER_PORT=587
CLIENT_URL_BASE=http://localhost:3000
PERSISTENCE=mongo
⚠️ Importante:

Si no usas Nodemailer, puedes dejar los valores ficticios.

La base de datos ecommerce_backend_ii se creará automáticamente al insertar el primer documento.

4. Cargar productos de ejemplo
bash
npm run seed
5. Crear usuario administrador
bash
npm run createAdmin
6. Iniciar el servidor
bash
npm run dev
El servidor estará disponible en http://localhost:3000.

🔐 Credenciales de prueba
Rol	Email	Contraseña
Admin	admin@example.com	admin123
User	cliente@test.com	cliente123
(opcional)	cualquier email registrado	la que elijas
Puedes registrar nuevos usuarios desde la API o desde la vista /products (sin necesidad de formulario, usa Postman o la consola del navegador).

🌐 Vistas disponibles (frontend)
URL	Descripción
/products	Catálogo de productos con paginación, filtros y ordenamiento
/products/:pid	Detalle de un producto (con botón “Agregar al carrito”)
/carts/:cid	Vista del carrito (ver productos, cantidades, eliminar, vaciar, comprar)
/realtimeproducts	Lista de productos actualizada en tiempo real con WebSockets (agregar/eliminar productos)
/ticket/:tid?cartId=...	Comprobante de compra (ticket) después de finalizar la compra
/home	Página de bienvenida (redirige a /products)
📡 API REST (endpoints)
Autenticación
Método	Endpoint	Cuerpo (JSON)	Descripción
POST	/api/session/register	{"first_name":"Juan","last_name":"Perez","email":"juan@test.com","password":"123456"}	Registra un usuario normal (rol user)
POST	/api/session/login	{"email":"admin@example.com","password":"admin123"}	Inicia sesión y devuelve cookie access_token
GET	/api/session/current	–	Devuelve el usuario actual (DTO, sin password)
POST	/api/session/logout	–	Cierra sesión (elimina cookie)
POST	/api/session/forgot-password	{"email":"admin@example.com"}	Envía email de recuperación (requiere Nodemailer)
POST	/api/session/reset-password	{"token":"...","newPassword":"nueva123"}	Restablece contraseña (token válido 1 hora)
Productos (solo admin puede crear/actualizar/eliminar)
Método	Endpoint	Descripción
GET	/api/products	Lista productos con paginación, filtros y ordenamiento (ver más abajo)
GET	/api/products/:pid	Obtiene un producto por ID
POST	/api/products	Crea un nuevo producto (requiere admin)
PUT	/api/products/:pid	Actualiza un producto (requiere admin)
DELETE	/api/products/:pid	Elimina un producto (requiere admin)
Parámetros de consulta para GET /api/products:

limit (default 10) – cantidad por página

page (default 1) – número de página

sort – asc o desc por precio

query – filtro: category:merchandising o status:true o texto libre (busca en título, descripción, código)

Ejemplo:
/api/products?limit=3&page=2&sort=asc&query=category:merchandising

Carritos (requieren autenticación)
Método	Endpoint	Cuerpo (JSON)	Descripción
POST	/api/carts	–	Crea un carrito vacío (generalmente se asocia automáticamente al usuario)
GET	/api/carts/:cid	–	Obtiene el carrito con productos populados (solo el dueño)
POST	/api/carts/:cid/products/:pid	{"quantity":1} (opcional, default 1)	Agrega un producto al carrito (suma cantidad si ya existe)
PUT	/api/carts/:cid/products/:pid	{"quantity":5}	Actualiza la cantidad de un producto
DELETE	/api/carts/:cid/products/:pid	–	Elimina un producto del carrito
PUT	/api/carts/:cid	{"products":[{"product":"id","quantity":2}]}	Reemplaza todo el carrito
DELETE	/api/carts/:cid	–	Vacía el carrito completamente
POST	/api/carts/:cid/purchase	–	Finaliza la compra: valida stock, descuenta, genera ticket y devuelve productos no procesados
Tickets (solo consulta)
Método	Endpoint	Descripción
GET	/api/tickets/:tid	Obtiene un ticket por ID (no es obligatorio en la consigna, pero útil)
Nota: Los tickets se generan automáticamente al comprar y se guardan en la colección tickets.

🧪 Pruebas recomendadas con Postman
Configuración previa
Crea una colección en Postman con las requests a http://localhost:3000

Asegúrate de que Postman maneje automáticamente las cookies (por defecto lo hace).

Flujo de pruebas
1. Registrar un usuario normal
text
POST /api/session/register
Body raw JSON:
{
  "first_name": "Cliente",
  "last_name": "Uno",
  "email": "cliente@test.com",
  "password": "cliente123"
}
2. Login como usuario normal
text
POST /api/session/login
Body:
{
  "email": "cliente@test.com",
  "password": "cliente123"
}
→ La cookie access_token se guarda automáticamente.

3. Ver usuario actual (DTO)
text
GET /api/session/current
→ No debe mostrar la contraseña.

4. Crear un carrito (si no se creó automáticamente)
text
POST /api/carts
→ Guarda el _id devuelto.

5. Agregar un producto al carrito
Primero obtén un productId válido de GET /api/products. Luego:

text
POST /api/carts/:cid/products/:pid
Body: { "quantity": 2 }
6. Ver el carrito
text
GET /api/carts/:cid
7. Finalizar compra (genera ticket)
text
POST /api/carts/:cid/purchase
→ Devolverá un ticket y actualizará el stock.

8. Probar operaciones de admin (requiere login como admin)
Login con admin@example.com / admin123

POST /api/products – crear producto

PUT /api/products/:pid – actualizar producto

DELETE /api/products/:pid – eliminar producto

9. Verificar que un usuario normal no puede crear/actualizar/eliminar productos
Debe recibir 403 Forbidden o 401 Unauthorized.

⚡ WebSockets – Tiempo real
La vista /realtimeproducts se conecta mediante Socket.io.

Al agregar o eliminar un producto (desde el formulario de esa misma vista), la lista se actualiza instantáneamente en todos los clientes conectados.

Los eventos utilizados son: newProduct, deleteProduct, updateProducts.

🎫 Generación de tickets (compra)
Cuando se llama a POST /api/carts/:cid/purchase:

Se verifica el stock de cada producto en el carrito.

Si hay stock suficiente, se resta la cantidad comprada y se añade el producto a la lista de comprados.

Si no hay stock, el producto se añade a failedProducts y no se compra.

Se crea un ticket con:

code único (ej: TICKET-1742345678900-ABC123)

purchase_datetime automático

amount = total de la compra

purchaser = email del usuario logueado

El carrito se actualiza eliminando los productos comprados (quedan solo los fallidos).

La respuesta incluye el ticket, los productos comprados, los fallidos y el total.

🧑‍💻 Scripts útiles (en package.json)
Comando	Descripción
npm run dev	Inicia el servidor con Nodemon (recarga automática)
npm run seed	Carga productos de ejemplo en la base de datos
npm run createAdmin	Crea el usuario administrador por defecto
npm start	Inicia el servidor en modo producción
📦 Variables de entorno (.env.example)
env
PORT=3000
MONGODB_URI=mongodb+srv://<user>:<password>@cluster0.xxxxx.mongodb.net/ecommerce_backend_ii
JWT_SECRET=mi_clave_secreta
COOKIE_NAME=access_token
NODEMAILER_USER=email@gmail.com
NODEMAILER_PASS=xxxx xxxx xxxx xxxx
NODEMAILER_HOST=smtp.gmail.com
NODEMAILER_PORT=587
CLIENT_URL_BASE=http://localhost:3000
PERSISTENCE=mongo
Nota: Para usar Nodemailer con Gmail, necesitas una contraseña de aplicación (no la contraseña normal de Gmail).
❓ Preguntas frecuentes
¿Por qué GET /api/carts devuelve 404?
Porque la consigna no requiere listar todos los carritos. Solo se puede acceder a un carrito específico mediante GET /api/carts/:cid.

¿Cómo sé qué cartId tengo?
Después de login, puedes obtenerlo desde GET /api/session/current (campo cart). También se guarda en localStorage cuando agregas productos desde el navegador.

¿Puedo probar la recuperación de contraseña sin Nodemailer?
No, necesitas una cuenta de email real y configurar correctamente las variables. 

¿El administrador puede ver el carrito de otros usuarios?
No. El middleware handlePolicies y la validación de propiedad (req.user.cart === cid) impiden que un usuario acceda a un carrito que no le pertenece.

📝 Licencia
Este proyecto es de uso académico para Coderhouse. Puedes usarlo como base para tu propio proyecto.

👨‍💻 Autor
Desarrollado como parte del curso Backend II – Coderhouse.
Para dudas o mejoras, contacta al autor a través del repositorio.

