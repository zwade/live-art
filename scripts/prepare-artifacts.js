const childProcess = require('child_process');
const fs = require("fs");

const buildGz = (stub) => {
    const dir = stub ? `./challenge` : "/challenge"
    const files = [
        "package.json",
        "tsconfig.json",
        "yarn.lock",
        ".yarnrc.yml",
        ".yarn/plugins",
        ".yarn/releases",
        "client/index.html",
        "client/package.json",
        "client/tsconfig.json",
        "client/vite.config.js",
        "client/src",
        "server/README.md",
        "server/package.json",
        "server/tsconfig.json",
        "server/bongo-cat.json",
        "server/src",
    ];

    childProcess.execSync(`tar -cvzf ${dir}/bundle.tar.gz ${files.join(" ")}`);
    childProcess.execSync(`cd ${dir} && tar -cvzf artifacts.tar.gz bundle.tar.gz`);
}

const buildMetadata = (stub) => {
    const dir = stub ? `./challenge` : "/challenge"

    const existingFlag = process.env.FLAG;
    let prefix = "";
    let randomPart = "";
    if (!existingFlag) {
        console.warn("No flag found");
        prefix = "picoCTF"
        randomPart = "0123456789abcdef";
    } else {
        prefix = existingFlag.split("{")[0];
        randomPart = existingFlag.split("{")[1].split("}")[0];
    }

    const flag = `${prefix}{beam_me_up_reacty_${randomPart}}`;

    const metadata = JSON.stringify({ flag });

    fs.writeFileSync(`${dir}/metadata.json`, metadata);
}

const isStub = process.argv.includes("--stub");
buildGz(isStub);
buildMetadata(isStub);