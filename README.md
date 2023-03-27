### command to update database tables with new models. Have to run from within Docker container

npx prisma migrate dev --name <name>

### Adding a new Data Source.

- types-general.ts: add new source to Datasources enum, details to DataSourceMetadataRecord const
- data-files.service: add to dataFileBaseNamesRecord const
- add new model to Prisma schema, update db by prisma.push() or ultimately migrate
- add router, controller, service, for new data source
