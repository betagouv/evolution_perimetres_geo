# Utilisation en ligne de commande

L'utilisation de base du paquet se fait en ajoutant un script npm dans le fichier package.json de son projet :
```json
{
  "scripts": {
    "evolution-geo": "evolution-geo"
  }
}
```

Maintenant, via la ligne de commande :
```shell
  yarn evolution-geo --help
  yarn evolution-geo [options] [commande]
```

## Options communes
- `-v, --verbose <level>`: Verbosity, default to env LOG_LEVEL (default: "error")
- `-h, --help` : display help for command

### Connection à la base de données
- `-u, --user <user>` : Postgresql user, default to env POSTGRES_USER (default: "postgres")
- `-W, --password <password>` : Postgresql password, default to env POSTGRES_PASSWORD
- `-H, --host <host>` : Postgresql host, default to env POSTGRES_HOST (default: "127.0.0.1")
- `-p, --port <port>` : Postgresql port, default to env POSTGRES_PORT (default: 5432)
- `-d, --database <database>` : Postgresql database, default to env POSTGRES_DB (default: "local")
- `-S, --schema <schema>` : Postgresql schema, default to env POSTGRES_SCHEMA (default: "public")

### Dossier de téléchargement
- `-d, --directory <directory>` : Path to download directory, default to env DOWNLOAD_DIRECTORY or os temporary directory if env missing (default to os tmp dir)


## Commande `import`
La commande `import` permet de jouer les datasets qui n'ont pas encore été importé.
- `--no-cleanup` : permet de désactiver la suppression des tables intermédiaires

## Commande `status`
La commande `status` permet de connaitre l'état des datasets dans la base de données cible.
