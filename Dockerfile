FROM node:latest

# Build time env
ARG NEXT_PUBLIC_API_BASE_URL
WORKDIR /app

COPY package.json yarn.lock /app/

# Install app dependencies
RUN yarn install --frozen-lockfile

# Copy app to source directory
COPY . /app

# Build Next.js
RUN yarn build

# USER node
CMD ["yarn", "start"]
