#!/bin/bash
set -e

if [[ "$1" == "runserver" ]]; then
    cd /usr/src/app
    
    npm run prisma:migrateOnly
    [ "$PRISMA_PUSH" == "1" ] && npm run prisma:push || echo "Skip prisma pushing"
    [ "$RUN_SEED" == "1" ] && npm run prisma:seed || echo "Skip seeding"
    [ "$RUN_SEED" == "1" ] && npm prune --production || echo "Skip prune"
    [ "$RUN_SEED" == "1" ] && echo "Skip server up" || npm run start:prod
fi

exec "$@"
