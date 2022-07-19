'use strict';
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildWithOptimizer = exports.build = void 0;
const dockerode_1 = __importDefault(require("dockerode"));
const child_process_1 = require("child_process");
const build = function (options) {
    return __awaiter(this, void 0, void 0, function* () {
        const docker = new dockerode_1.default(options.dockerOptions);
        // TODO find a way to auto pull docker image when perform docker run 
        // (like --pull="missing" option when using command line)
        (0, child_process_1.execSync)(`docker pull ${options.dockerImageName}`, { stdio: 'inherit' });
        // Example of similar docker command:
        //     docker run -v '$PWD:/code' -w='/code' --entrypoint /bin/bash rust -c 'cargo schema'
        const buildWithSchemaCmd = 'rustup target add wasm32-unknown-unknown && RUSTFLAGS="-C link-arg=-s" cargo wasm && cargo schema';
        yield docker.run(options.dockerImageName, ['-c', buildWithSchemaCmd], process.stdout, {
            "WorkingDir": "/code",
            "Entrypoint": "/bin/bash",
            'Hostconfig': {
                'autoRemove': true,
                'Binds': [`${options.smartContractDirectory}:/code`],
            },
        }).then(response => console.log(response[0].StatusCode));
    });
};
exports.build = build;
// build smart contract using docker image: cosmwasm/rust-optimizer
const buildWithOptimizer = function (options) {
    return __awaiter(this, void 0, void 0, function* () {
        const docker = new dockerode_1.default(options.dockerOptions);
        // TODO find a way to auto pull docker image when perform docker run 
        // (like --pull="missing" option when using command line)
        (0, child_process_1.execSync)(`docker pull ${options.dockerImageName}`, { stdio: 'inherit' });
        // Example of similar docker command:
        //     docker run --rm \
        //         --mount type=bind,source="$(pwd)",target=/code \
        //         --mount type=bind,source="$(pwd)/target",target=/code/target \
        //         --mount type=volume,source=registry_cache,target=/usr/local/cargo/registry \
        //         cosmwasm/rust-optimizer:0.12.6
        yield docker.run(options.dockerImageName, [], process.stdout, {
            'Volumes': {
                'registry_cache': {}
            },
            'Hostconfig': {
                'autoRemove': true,
                'Binds': [`${options.smartContractDirectory}:/code`,
                    `${options.smartContractDirectory}/target:/code/target`,
                    'registry_cache:/usr/local/cargo/registry'],
            },
        }).then(response => console.log(response[0].StatusCode));
    });
};
exports.buildWithOptimizer = buildWithOptimizer;
