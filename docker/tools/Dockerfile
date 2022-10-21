FROM minio/mc:RELEASE.2022-10-20T23-26-33Z
RUN microdnf update && microdnf install jq
COPY ./upload-dataset-mirror.sh /bin
ENTRYPOINT ["/bin/upload-dataset-mirror.sh"]