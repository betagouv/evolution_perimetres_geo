# Évolutions-geo - Évolutions des mailles géographiques

## Objectifs

Ce programme sert à agréger les données géographiques issues de différents producteurs de données afin d'obtenir une table postgresql de périmètres et de mailles géographiques françaises versionnées par année.

Il est actuellement utilisé par deux projets Beta.gouv :
- Le registre de preuve de covoiturage
- L'observatoire du covoiturage

## Installation
Vous pouvez utiliser npm ou yarn pour installer le paquet :
```shell
  yarn add @betagouvpdc/evolution-geo
```

Attention, le programme nécessite :
- 7zip
- une base de données postgresql >= 12 avec postgis >= 3
