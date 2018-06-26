const chalk = require('chalk')

// export const info = chalk.blue
// export const success = chalk.green
// export const error = chalk.red

export const info = (_message: string) => {
  console.log(chalk.blue('+ ' + _message))
}

export const success = (_message: string) => {
  console.log(chalk.green('+ ' + _message))
}

export const error = (_message: string) => {
  console.log(chalk.red('- ' + _message))
}