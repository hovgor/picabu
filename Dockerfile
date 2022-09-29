FROM node:18.7.0

ENV HOST='127.0.0.1'
ENV PORT=3000
ENV DATABASE_HOST='localhost'
ENV DATABASE_PORT=5432
ENV DATABASE_USERNAME='picabuuser'
ENV DATABASE_PASSWORD='password'
ENV DATABASE_NAME='picabu2'
ENV SENDGRID_API_KEY='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'
ENV SEND_EMAIL_ADDRESS='gor95hov10@mail.ru'
ENV SEND_EMAIL_PASSWORD='P4JAGd1vKd1p1W4FAzdp'
ENV REDIS_HOST='localhost'
ENV REDIS_PORT=6379
ENV REDIS_PASSWORD='redis'
ENV NODE_ENV='local'
ENV HELP_CENTER_EMAIL='helpcenter123@mailinator.com'
ENV ALLOWED_ORIGINS='http://127.0.0.1:5500, http://localhost:5500, http://picabu.am, http://localhost'

WORKDIR /opt/app

ADD package.json package.json

RUN npm install

ADD . .

RUN npm run build 

RUN npm prune --production

CMD ["node", "./dist/main.js"]