# Stage 1: Build the application
FROM node:18-alpine AS builder

WORKDIR /app

# Copy the package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the project files
COPY . .

# Build the application
RUN npm run build

# Stage 2: Serve the application
FROM node:18-alpine AS runner

WORKDIR /app

# Copy the necessary files from the build stage
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/public ./public  # Ensure the 'public' folder exists and is copied

# Expose the port
EXPOSE 3000

# Start the application
CMD ["npm", "start"]