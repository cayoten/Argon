FROM node:alpine3.16

# Set the working directory
WORKDIR /argon

# Load dependencies early to take advantage of Docker caching
COPY package*.json ./

# The following steps are taken in one dockerfile command maximize caching and help reduce the size of the final image.
# Steps:
# 1. Install make, g++, and python3
# 2. Install npm dependencies
# 3. Remove make, g++, and python3
# 4. Remove apk cache
RUN apk add make g++ python3 && \
npm i && \
apk del make g++ && \
rm -rf /var/cache/apk/*

# Copy the rest of the files
COPY . .

# Define the entrypoint
CMD ["npm", "index.js"]
