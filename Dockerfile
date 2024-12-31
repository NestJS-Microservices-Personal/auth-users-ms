FROM node:21-alpine3.20

WORKDIR /usr/src/app

# Copiar y solo instalar dependencias de desarrollo
COPY package.json package-lock.json ./
RUN npm install --only=development

# Copiar el resto del código fuente
COPY . .

# Exponer el puerto usado por la aplicación en desarrollo
EXPOSE 3004

# Comando de inicio en modo desarrollo
CMD ["npm", "run", "start:dev"]
