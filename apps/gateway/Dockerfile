FROM node:22-alpine AS development

WORKDIR /usr/src/app

# Copy the root package.json and package-lock.json
COPY package*.json ./
COPY nest-cli.json ./
COPY tsconfig*.json ./
COPY .env ./
COPY apps/gateway ./apps/gateway
COPY libs ./libs

# Verify that package.json is copied
RUN ls -la /usr/src/app && cat /usr/src/app/package.json

RUN npm install

RUN npm run build gateway

EXPOSE 3000

CMD ['npm' 'run' 'start:dev' 'gateway']
# RUN npm run start:dev gateway

# # CMD ["npm", "start", "/usr/src/app/dist/apps/gateway/main.js" "--watch"]

# FROM node:22-alpine AS production

# ARG NODE_ENV=production
# ENV NODE_ENV=${NODE_ENV}

# WORKDIR /usr/src/app

# COPY package.json package-lock.json ./
# COPY tsconfig*.json ./
# COPY .env ./

# RUN npm install --only=production

# COPY apps/gateway ./apps/gateway

# COPY libs ./libs

# COPY --from=development /usr/src/app/dist ./dist

# CMD ["node", "dist/apps/gateway/main"]