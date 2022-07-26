import {Command, Flags} from '@oclif/core'
import { generateAccount } from '../../packages/account';

export default class Account extends Command {
  static description = 'Manage account'

  static examples = [
    '<%= config.bin %> <%= command.id %>',
  ]

  static flags = {
    // flag with a value (-n, --name=VALUE)
    name: Flags.string({char: 'n', description: 'name to print'}),
    // flag with no value (-f, --force)
    force: Flags.boolean({char: 'f'}),
  }

  static args = [{name: 'file'}]

  public async run(): Promise<void> {
    const {args, flags} = await this.parse(Account)

    if(flags.name) {
      console.log('alo');
      await generateAccount();
    }
  }
}
