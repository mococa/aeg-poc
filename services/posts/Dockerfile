FROM alpine

# Set the working directory to /app
WORKDIR /app

# Adding node to run the built app
RUN apk add --update nodejs npm

# Copy the root tsconfig.json to /app
COPY ./dist ./dist
COPY ./package.json ./package.json

# Set environment variables
ENV NODE_ENV production
ENV PORT 4002

# Expose the desired port
EXPOSE 4002

# Start the application
CMD ["npm", "run", "start"]
