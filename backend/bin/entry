#!/bin/bash
set -e

rake db:create
rake db:migrate
rake db:seed

exec "$@"
