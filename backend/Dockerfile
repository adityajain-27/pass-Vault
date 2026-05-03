# 1. Base Image
FROM node:20-alpine

# 2. Set Working Directory
WORKDIR /app

# 3. Copy Dependencies First (for caching)
COPY package.json package-lock.json* ./

# 4. Install Dependencies
RUN npm install

# 5. Copy the Rest of the Code
COPY . .

# 6. Expose Port
EXPOSE 5000

# 7. Start the Application
CMD ["npm", "start"]
