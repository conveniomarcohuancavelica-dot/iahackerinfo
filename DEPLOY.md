# Despliegue en Vercel y Render

El frontend Next.js se publica en Vercel y el backend Express en Render.
Conecta primero este proyecto a un repositorio Git remoto accesible desde ambos proveedores.

## Backend en Render

1. En Render, crea un **Blueprint** e importa el repositorio. Render detectará
   `render.yaml` en la raíz y propondrá el servicio `proyectoia-api`.
2. Configura `OPENAI_API_KEY` como variable secreta en Render. No la guardes en
   el repositorio ni la compartas en chats.
3. Conserva el valor de `OPENAI_MODEL` (`gpt-4o-mini`) o cámbialo según tu cuenta.
4. Después del primer despliegue, copia la URL pública del servicio, por ejemplo
   `https://proyectoia-api.onrender.com`.

El build valida los tipos de TypeScript, `tsx` ejecuta el backend y el servicio
expone `/health` para las comprobaciones de disponibilidad.

## Frontend en Vercel

1. Importa el mismo repositorio en Vercel y establece `client` como **Root
   Directory**.
2. Configura `NEXT_PUBLIC_API_URL` con la URL pública del backend, sin `/` al
   final, por ejemplo `https://proyectoia-api.onrender.com`.
3. Despliega el proyecto y copia su dominio público.

## Conectar el frontend y el backend

En Render, configura `CLIENT_ORIGIN` con el origen exacto del frontend Vercel,
por ejemplo `https://proyectoia-client.vercel.app` (sin `/` al final), y
reinicia el servicio. Si cambias el dominio del frontend, actualiza este valor.

`NEXT_PUBLIC_API_URL` se incorpora al compilar el frontend; si cambia la URL del
backend, actualiza la variable en Vercel y vuelve a desplegar.
