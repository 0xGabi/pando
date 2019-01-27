/* tslint:disable:no-console */
import Pando from '@pando/pando.js'
import chalk from 'chalk'
import figures from 'figures'
import yargs from 'yargs'
import * as ui from '../../../ui/display'

const builder = () => {
  return yargs
    .option('organization', {
      alias: 'o',
      description: 'The organization to list organisms in',
      required: true,
    })
    .help()
    .strict(false)
    .version(false)
}

const handler = async argv => {
  const pando = await Pando.create(argv.configuration)

  try {
    const plant = await pando.plants.load()
    const organization = await plant.organizations.load({ name: argv.organization })
    const organisms = await organization.organisms.list()

    for (const organism of organisms) {
      console.log(chalk.cyan.bold.underline(organism.name) + ' ' + chalk.magenta.bold(organism.address))
      console.log('')
    }
  } catch (err) {
    ui.error(err.message)
  }

  await pando.close()
}

/* tslint:disable:object-literal-sort-keys */
export const list = {
  command: 'list',
  aliases: ['ls'],
  desc: 'List organisms',
  builder,
  handler,
}
