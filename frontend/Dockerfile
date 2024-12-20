# Usa l'immagine ufficiale di Node.js come base
FROM node:18-alpine

# Imposta la directory di lavoro all'interno del container
WORKDIR /app

# Copia i file di dipendenze
COPY frontend/package.json frontend/package-lock.json /app/

# Installa le dipendenze
RUN npm install

# Copia il resto del codice
COPY frontend /app/

# Costruisce il progetto React
RUN npm run build

# Imposta il comando per avviare il server
CMD ["npm", "start"]