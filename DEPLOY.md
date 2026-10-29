# Despliegue en Vercel y Render

El frontend Next.js se publica en Vercel y el backend Express en Render.
Conecta primero este proyecto a un repositorio Git remoto accesible desde ambos proveedores.

## Backend en Render

1. En Render, crea un **Blueprint** e importa el repositorio. Render detectará
   `render.yaml` en la raíz y propondrá el servicio `proyectoia-api`.
2. Crea una clave de Gemini en Google AI Studio y configúrala como variable
   secreta `GEMINI_API_KEY` en Render. No la guardes en el repositorio ni la
   compartas en chats.
3. Genera un secreto aleatorio de al menos 32 caracteres y guárdalo como
   `API_SHARED_SECRET` en Render. Añade el mismo valor en Vercel como
   `BACKEND_API_TOKEN`; no lo compartas ni lo pongas en el código. Puedes
   generarlo localmente con:

   ```powershell
   node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
   ```
4. El modelo predeterminado es `gemini-2.5-flash`; puedes cambiar `GEMINI_MODEL`
   si tu cuenta tiene acceso a otro modelo compatible.
5. Después del primer despliegue, copia la URL pública del servicio, por ejemplo
   `https://proyectoia-api.onrender.com`.

El build valida los tipos de TypeScript, `tsx` ejecuta el backend y el servicio
expone `/health` para las comprobaciones de disponibilidad.

## Frontend en Vercel

1. Importa el mismo repositorio en Vercel y establece `client` como **Root
   Directory**.
2. Configura `BACKEND_API_URL` con la URL pública del backend, sin `/` al
   final, por ejemplo `https://proyectoia-api.onrender.com`.
3. Configura `BACKEND_API_TOKEN` con el mismo secreto que `API_SHARED_SECRET`
   en Render. Ambas variables se usan solo en el servidor; el navegador no recibe
   el secreto ni contacta directamente al backend. Elimina `NEXT_PUBLIC_API_URL`
   si quedó configurada de un intento anterior.
4. Despliega el proyecto y conserva activada la protección de acceso de Vercel.

## Conectar el frontend y el backend

El navegador usa rutas del mismo origen en Vercel. El servidor de Next.js reenvía
las solicitudes al backend e incluye el secreto compartido; no se necesita
exponer la clave de OpenAI ni habilitar CORS para el dominio de Vercel.
