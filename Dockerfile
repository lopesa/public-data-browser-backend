FROM node:18-alpine
RUN apk add g++ make py3-pip
ARG NODE_ENV=development
ENV NODE_ENV=${NODE_ENV}
WORKDIR /home/node/app
# RUN npm install
# COPY ./ .
EXPOSE 3001 9229
CMD ["npm", "run", "dev:debug"]