Pasos para correr el proyecto: 

  1. En el archivo .env ingresa tu contraseña para el usuario root de MySQL y aparte debes crear una base de datos con el nombre 'cns'
  2. En la terminal ejecutar el comando 'npm i' para instalar dependencias necesarias
  3. Una ves las dependencias instaladas podras correr los comandos 'npm run server' para arrancar el servidor y 'npm run css' para compilar los estilos css de tailwind
  4. Accede a tu navegador a la ruta 'http://localhost:3000/auth/personal/registro' para comprobar que esta iniciado el servidor correctamente 


Para importar algunos datos a la BD puedes ejecutar el comando en terminal: 
  npm run db:importar

Para hacer un truncate a las tablas puedes ejecutar el coamndo en terminal: 
  npm run db:eliminar