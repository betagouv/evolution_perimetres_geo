# Utilisation avancée

Au lieu d'utiliser la ligne de commande, vous pouvez utiliser le paquet pour ajouter de nouveaux datasets ou commander les migrations de manière fonctionnelle.

## Créer un nouveau dataset
Les datasets doivent implémenter l'interface `DatasetInterface` tel que :
```typescript=
interface DatasetInterface {
  // la clé utilisée pour savoir si le dataset a été joué
  static readonly uuid: string;
  // la table intermédiaire du dataset
  static readonly table: string;
  // pour construire la classe, elle reçoit une connexion pool Postgresql, un file provider et un schema sql sur lequel se positionner
  static new (connection: Pool, file: FileManager, targetSchema: string): DatasetInterface;
  // permet de planifier des datasets dépendants les uns des autres
  validate(state: StateManagerInterface): Promise<void>;
  // permet de créer les table intermédiaire
  before(): Promise<void>;
  // permet de gérer le téléchargement
  download(): Promise<void>;
  // permet la transformation du datasets
  transform(): Promise<void>;
  // charge les données dans la table intermédiaire
  load(): Promise<void>;
  // importe les données dans les tables finales
  import(): Promise<void>;
  // détruit les tables intermédiaires
  after(): Promise<void>;
}
```

Pour faciliter l'implémentation, il existe une classe abstraite qui gère la plupart des cas, vous pouvez l'étendre en créant une nouvelle classe de la façon suivante :
```typescript=
import { AbstractDataset, ArchiveFileTypeEnum, FileTypeEnum } from '@betagouvpdc/evolution-geo';

export class MyDataset extends AbstractDataset {
  static producer = 'insee';
  static dataset = 'com';
  static year = 2021;
  static table = 'insee_com_2021';

  readonly url: string = 'https://www.insee.fr/fr/statistiques/fichier/5057840/commune2021-csv.zip';
  readonly fileArchiveType: ArchiveFileTypeEnum = ArchiveFileTypeEnum.Zip;
  readonly rows: Map<string, [string, string]> = new Map([
    ['typecom', ['0', 'varchar(4)']],
    ['arr', ['1', 'varchar(5)']],
    ['libelle', ['9', 'varchar']],
    ['com', ['11', 'varchar(5)']],
  ]);

  readonly extraBeforeSql = `ALTER TABLE ${this.tableWithSchema} ALTER COLUMN arr SET NOT NULL;`;

  fileType: FileTypeEnum = FileTypeEnum.Csv;
  sheetOptions = {};

  readonly tableIndex = 'arr';
  readonly importSql = `
    UPDATE ${this.targetTableWithSchema} AS a
      SET l_arr = t.libelle, com = t.com
    FROM ${this.tableWithSchema} t
    WHERE a.arr = t.arr AND t.typecom = 'ARM';
  `;
}
```

## Utiliser le nouveau dataset
```typescript=
import { buildMigrator, datasets } from '@betagouvpdc/perimeters';
import { MyDataset } from './MyDataset';

async function main(): Promise<void> {
    datasets.datasets.add(MyDataset);
    const migrator = buildMigrator({ app: { migrations: datasets.datasets }});
    await migrator.prepare();
    await migrator.run();
}
```
