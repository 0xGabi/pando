import Pando from '@pando/pando.js'
import chalk from 'chalk'
import ora from 'ora'
import yargs from 'yargs'

const builder = () => {
  return yargs
    .strict(false)
    .help()
    .version(false)
}

const handler = async argv => {
  const spinner = ora(chalk.dim(`Tracking ${argv.files}`)).start()
  const pando = await Pando.create(argv.configuration)

  try {
    const plant = await pando.plants.load()
    const fiber = await plant.fibers.current()
    await fiber.index.track(argv.files)
    spinner.succeed(chalk.dim(`Tracked ${argv.files}`))
  } catch (err) {
    spinner.fail(chalk.dim(err.message))
  }

  await pando.close()
}

/* tslint:disable:object-literal-sort-keys */
export const track = {
  command: 'track <files...>',
  desc: 'Track files for modifications',
  builder,
  handler,
}
/* tslint:enable:object-literal-sort-keys */
