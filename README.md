# iori-bot-v2

stable version `27ab126`

### deploy heroku

`git push heroku master`

### deploy docker

build `docker build -t frog1123/iori-bot-v2:<version>`

run

`docker run -e BOT_TOKEN='<bot_token>' DATABASE_URL='<database_url>' frog1123/iori-bot:<version>`
