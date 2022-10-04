#!/bin/bash
mkdir temp
IFS=' : '
while read hash_name url; do
    mc find ALIAS/PATH --name $hash_name
    curl -o ./temp/$hash_name "$url"
    echo "Download $hash_name : $url"
done < test.txt