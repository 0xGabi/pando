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
  const spinner = ora(chalk.dim(`Switching to fiber ${argv.name}`)).start()
  const pando = await Pando.create(argv.configuration)

  try {
    const plant = await pando.plants.load()
    await plant.fibers.switch(argv.name)
    spinner.succeed(chalk.dim(`Switched to fiber ${argv.name}`))
  } catch (err) {
    spinner.fail(chalk.dim(err.message))
  }

  await pando.close()
}

/* tslint:disable:object-literal-sort-keys */
export const switch_ = {
  command: 'switch <name>',
  desc: 'Switch fibers',
  builder,
  handler,
}
