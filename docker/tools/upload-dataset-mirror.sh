#!/usr/bin/env bash
# USAGE cat file | ./upload-dataset-mirror
mc config host add minio $AWS_ENDPOINT $AWS_ACCESS_KEY_ID $AWS_SECRET_ACCESS_KEY
mkdir -p temp
IN_S3=$(mc ls minio/$AWS_BUCKET --json | jq '.key')
IFS=' : '
while read hash_name url; do
  echo "processing [$hash_name] $url"
  if [[ $hash_name == "Done" ]];
    then
      echo "All files are been processed"
      break
  fi
  FIND=$(grep "$hash_name" <<< $IN_S3)
  if [ -z $FIND ]
    then
        echo "not found"
        curl -o ./temp/$hash_name "$url"
        mc cp ./temp/$hash_name minio/$AWS_BUCKET
    else
        echo "found"
    fi
done < "${1:-/dev/stdin}"
