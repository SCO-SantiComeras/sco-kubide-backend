#!/bin/bash
#Para lanzar el script, lanzamos en una terminal posicionada en el fichero el siguiente comando: `./run-docker.sh $ENTORNO $BUILD`
#Posibles entornos: 'dev', 'prod'
echo "Parámetro entorno: $1"
echo "Parámetro build: $2"

#Entornos
dev="dev"
prod="prod"

#Build
true="true"
false="false"

if [[ $1 == $dev ]] ; then
    echo "Iniciando entorno de desarrollo"
    if [[ $2 == $true ]] ; then
        docker compose -f docker-compose.yml up --build
    else
        docker compose -f docker-compose.yml up
    fi
elif [[ $1 == $prod ]] ; then
    echo "Iniciando entorno de producción"
    if [[ $2 == $true ]] ; then
        docker compose -f docker-compose.prod.yml up --build
    else
        docker compose -f docker-compose.prod.yml up
    fi
else
    echo "Entorno introducido '$1' no es válido (dev/prod)"
fi