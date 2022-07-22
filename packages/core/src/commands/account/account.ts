import {Command, Flags} from '@oclif/core'
import { generateAccount } from 'account'

export default class Account extends Command {
  static description = 'Say hello world'

  static examples = [
    `$ oex hello world
hello world! (./src/commands/hello/world.ts)
`,
  ]

  static flags = {
    generate: Flags.string({char: 'G'})
  }

  static args = []

  async run(): Promise<void> {
    const {flags} = await this.parse(Account)
    if(flags.generate) generateAccount()
  }
}
