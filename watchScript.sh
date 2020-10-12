export $(cat .env | xargs)
node ./Migrator/watch.js