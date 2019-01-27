import Pando from '@pando/pando.js'
import chalk from 'chalk'
import ora from 'ora'
import yargs from 'yargs'

const builder = () => {
  return yargs
    .option('message', {
      alias: 'm',
      description: 'A message describing the individuation',
      required: false,
    })
    .strict(false)
    .help()
    .version(false)
}

const handler = async argv => {
  let pando
  let spinner

  try {
    spinner = ora(chalk.dim(`Pushing individuation to ${argv.organism}`)).start()
    pando = await Pando.create(argv.configuration)

    const plant = await pando.plants.load()
    const [organizationName, organismName] = argv.organism.split(':')
    await plant.publish(organizationName, organismName, argv.message)

    spinner.succeed(chalk.dim(`Individuation pushed to ${argv.organism}`))
  } catch (err) {
    spinner.fail(chalk.dim(err.message))
  }

  await pando.close()
}

/* tslint:disable:object-literal-sort-keys */
export const individuate = {
  command: 'individuate <organism>',
  alias: 'indiv',
  desc: 'Individuate organism',
  builder,
  handler,
}
/* tslint:enable:object-literal-sort-keys */
