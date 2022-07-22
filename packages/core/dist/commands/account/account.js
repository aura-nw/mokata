"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@oclif/core");
const account_1 = require("account");
class Account extends core_1.Command {
    async run() {
        const { flags } = await this.parse(Account);
        if (flags.generate)
            (0, account_1.generateAccount)();
    }
}
exports.default = Account;
Account.description = 'Say hello world';
Account.examples = [
    `$ oex hello world
hello world! (./src/commands/hello/world.ts)
`,
];
Account.flags = {
    generate: core_1.Flags.string({ char: 'G' })
};
Account.args = [];
