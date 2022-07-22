import { Command } from '@oclif/core';
export default class Account extends Command {
    static description: string;
    static examples: string[];
    static flags: {
        generate: import("@oclif/core/lib/interfaces").OptionFlag<string | undefined>;
    };
    static args: never[];
    run(): Promise<void>;
}
