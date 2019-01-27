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
  const spinner = ora(chalk.dim(`Untracking ${argv.files}`)).start()
  const pando = await Pando.create(argv.configuration)

  try {
    const plant = await pando.plants.load()
    const fiber = await plant.fibers.current()
    await fiber.index.untrack(argv.files)
    spinner.succeed(chalk.dim(`Untracked ${argv.files}`))
  } catch (err) {
    spinner.fail(chalk.dim(err.message))
  }

  await pando.close()
}

/* tslint:disable:object-literal-sort-keys */
export const untrack = {
  command: 'untrack <files...>',
  desc: 'Untrack files for modifications',
  builder,
  handler,
}
/* tslint:enable:object-literal-sort-keys */
