export $(cat ../.env | xargs)
tmux new -s watch "node ./watch.js"