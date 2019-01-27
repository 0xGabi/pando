import Pando from '@pando/pando.js'
import chalk from 'chalk'
import ora from 'ora'
import yargs from 'yargs'

const builder = () => {
  return yargs
    .option('message', {
      alias: 'm',
      description: 'A message describing the snapshot',
      required: false,
    })
    .help()
    .strict(false)
    .version(false)
}

const handler = async argv => {
  const spinner = ora(chalk.dim(`Creating snapshot`)).start()
  const pando = await Pando.create(argv.configuration)

  try {
    const plant = await pando.plants.load()
    const fiber = await plant.fibers.current()
    await fiber.snapshot(argv.message)
    spinner.succeed(chalk.dim(`Snapshot created`))
  } catch (err) {
    spinner.fail(chalk.dim(err.message))
  }

  await pando.close()
}

/* tslint:disable:object-literal-sort-keys */
export const snapshot = {
  command: 'snapshot',
  desc: 'Snapshot modifications',
  builder,
  handler,
}
