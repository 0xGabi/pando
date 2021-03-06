import Pando from '@pando/pando.js'
import chalk from 'chalk'
import ora from 'ora'
import yargs from 'yargs'

const builder = () => {
  return yargs
    .option('name', {
      alias: 'n',
      description: 'The local name of the organism',
      required: true,
    })
    .option('organization', {
      alias: 'o',
      description: 'The organization to add the organism to',
      required: true,
    })
    .help()
    .strict(false)
    .version(false)
}

const handler = async argv => {
  let pando
  let spinner

  try {
    spinner = ora(chalk.dim(`Adding organism '${argv.name}' to '${argv.organization}'`)).start()
    pando = await Pando.create(argv.configuration)
    const plant = await pando.plants.load()
    const organization = await plant.organizations.load({ name: argv.organization })
    await organization.organisms.add(argv.name, argv.address)
    spinner.succeed(chalk.dim(`Organism '${argv.name}' added to organization ${argv.organization}`))
  } catch (err) {
    spinner.fail(chalk.dim(err.message))
  }

  await pando.close()
}

/* tslint:disable:object-literal-sort-keys */
export const add = {
  command: 'add <address>',
  desc: 'Add an already deployed organism to the plant',
  builder,
  handler,
}
/* tslint:enable:object-literal-sort-keys */
