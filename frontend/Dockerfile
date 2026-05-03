# ==========================================
# STAGE 1: Build the React Application
# ==========================================
FROM node:20-alpine as build-stage

WORKDIR /app

# Copy package files and install dependencies
COPY package.json package-lock.json* ./
RUN npm install

# Copy the rest of the frontend code and build it
COPY . .
RUN npm run build

# ==========================================
# STAGE 2: Serve the App using Nginx
# ==========================================
# We throw away the Node.js environment and start fresh with Nginx!
FROM nginx:alpine

# Copy our custom Nginx config to support React routing
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy ONLY the built files from STAGE 1 (the "dist" folder) into the Nginx server
COPY --from=build-stage /app/dist /usr/share/nginx/html

# Expose port 80 (standard web traffic port)
EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]
