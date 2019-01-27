import Pando from '@pando/pando.js'
import chalk from 'chalk'
import ora from 'ora'
import yargs from 'yargs'

const builder = () => {
  return yargs
    .help()
    .strict(false)
    .version(false)
}

const handler = async argv => {
  let pando
  let spinner

  try {
    spinner = ora(chalk.dim(`Deploying '${argv.name}'`)).start()
    pando = await Pando.create(argv.configuration)
    const plant = await pando.plants.load()
    await plant.organizations.deploy(argv.name)
    spinner.succeed(chalk.dim(`Organization '${argv.name}' deployed`))
  } catch (err) {
    spinner.fail(chalk.dim(err.message))
  }

  await pando.close()
}

/* tslint:disable:object-literal-sort-keys */
export const deploy = {
  command: 'deploy <name>',
  desc: 'Deploy a new Aragon organization',
  builder,
  handler,
}
/* tslint:enable:object-literal-sort-keys */
