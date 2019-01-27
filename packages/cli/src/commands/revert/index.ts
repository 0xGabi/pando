import Pando from '@pando/pando.js'
import chalk from 'chalk'
import ora from 'ora'
import yargs from 'yargs'

const builder = () => {
  return yargs
    .option('snapshot', {
      alias: 's',
      description: 'Snapshot id to revert to',
      required: true,
    })
    .help()
    .strict(false)
    .version(false)
}

const handler = async argv => {
  let spinner
  let pando

  try {
    spinner = ora(chalk.dim(`Reverting to snapshot ${argv.snapshot}`)).start()
    pando = await Pando.create(argv.configuration)
    const plant = await pando.plants.load()
    const fiber = await plant.fibers.current()
    await fiber.revert(argv.snapshot, argv.files)
    spinner.succeed(chalk.dim(`Reverted to snapshot ${argv.name}`))
  } catch (err) {
    spinner.fail(chalk.dim(err.message))
  }

  await pando.close()
}

/* tslint:disable:object-literal-sort-keys */
export const revert = {
  command: 'revert [files...]',
  desc: 'Revert to older version',
  builder,
  handler,
}
/* tslint:enable:object-literal-sort-keys */
