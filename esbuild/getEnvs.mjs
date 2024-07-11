import fs from "fs-extra";
import path, { dirname } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const __projroot = path.resolve(__dirname, "..") + "/";

const pkg = JSON.parse(fs.readFileSync(path.resolve(__projroot, "./package.json"), "utf-8"));
const version = pkg.version;
const production = ["production", "staging"].includes(process.env.NODE_ENV);

function parseEnvFile(src) {
  const text = fs.readFileSync(path.resolve(__projroot, src), "utf-8");
  return text.split('\n').filter(
    line => line.trim() !== ''
  ).reduce((result, line) => {
    const [key, value] = line.split('=');
    result[key] = JSON.stringify(value);
    return result;
  }, {});
}

export const getEnvs = () => ({
  "process.env.VERSION": JSON.stringify(version),
  "process.env.CONSOLE_COLORS": JSON.stringify(true),
  "process.env.PRODUCTION": JSON.stringify(production),
  "process.env.NODE_ENV": production ? "'production'" : JSON.stringify(process.env.NODE_ENV),
  "process.env.BUILD_TIMESTAMP": JSON.stringify((new Date()).getTime()),
  ...(production ? parseEnvFile(`./.env.${process.env.NODE_ENV}`) : parseEnvFile("./.env")),
});
