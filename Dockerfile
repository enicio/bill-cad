FROM node:slim AS build
WORKDIR /app
COPY package*.json ./
COPY prisma ./prisma/
RUN npm install
COPY . .
RUN npm run build
RUN npm ci --omit dev && npm cache clean --force

# Stage 2: Create the production image
FROM node:20
WORKDIR /app
COPY --from=build /app/prisma ./prisma
COPY --from=build /app/dist ./dist
COPY --from=build /app/node_modules ./node_modules
EXPOSE 3333
CMD []