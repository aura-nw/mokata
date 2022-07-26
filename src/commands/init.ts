import {Command, Flags} from '@oclif/core'
import {InitConfig} from '../../packages/init'

export default class Init extends Command {
  static description = 'Init env'

  static examples = [
    '<%= config.bin %> <%= command.id %>',
  ]

  public async run(): Promise<void> {
    const initConfig = new InitConfig();
    await initConfig.init();
  }
}
