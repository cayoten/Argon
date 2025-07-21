FROM node:alpine3.21

# Set the working directory
WORKDIR /argon


# The following steps are taken in one dockerfile command maximize caching and help reduce the size of the final image.
# Steps:
# 1. Install make, g++, and python3
# 2. Install npm dependencies
# 3. [removed]
# 4. Remove apk cache
RUN apk add make g++ python3 && \
rm -rf /var/cache/apk/*


# Copy the rest of the files 
# [skipped because we will mount the files in via compose]
# COPY . .

# Let entrypoint do the dependency handling (e.g. npm install)
ENTRYPOINT ["/bin/sh", "docker-entrypoint.sh"]

# Define what the image "runs"
CMD ["node", "index.js"]
