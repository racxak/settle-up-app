#! /bin/bash

INIT_FLAG=${1:-no-init}

if [[ "$INIT_FLAG" == "init" ]]; then
    echo "Running compose with database initialization"
    export SPRING_FLYWAY_LOCATIONS="classpath:db/migration,classpath:db/data"
    
else
    echo "Running compose without database initialization"
    export SPRING_FLYWAY_LOCATIONS="classpath:db/migration"
fi

docker compose -p "shopping-list-backend" up -d --wait