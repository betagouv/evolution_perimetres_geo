import DBMigrate from 'db-migrate'

export async function ignImport():Promise<void>{
  try{
    console.log ('Start IGN migrations')
    const dbm = DBMigrate.getInstance(true, {cmdOptions: {'migrations-dir':'./src/db/migrations'}})
    await dbm.up(0,'ign')
  } 
  catch(err){
    console.log(err)
  }
}