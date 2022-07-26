import {Command, Flags} from '@oclif/core'
import { generateAccount } from '../../packages/account/dist';

export default class Account extends Command {
  static description = 'Manage account'

  static examples = [
    '<%= config.bin %> account -g',
  ]

  static flags = {
    // flag with a value (-n, --name=VALUE)
    generate: Flags.boolean({char: 'g', description: 'Generate account'}),
    // flag with no value (-f, --force)
    force: Flags.boolean({char: 'f'}),
  }

  static args = [{name: 'file'}]

  public async run(): Promise<void> {
    const {args, flags} = await this.parse(Account)

    if(flags.generate) {
      await generateAccount();
    }
  }
}
