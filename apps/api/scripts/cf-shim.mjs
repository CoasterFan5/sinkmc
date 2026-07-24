/**
 * Load via: tsx --import ./scripts/cf-shim.mjs <script>
 * I dont even know anymore tbh I didnt write this but I blame Cloudflare.
 */
import { register } from "node:module";
import { pathToFileURL } from "node:url";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
register(pathToFileURL(join(__dirname, "cf-loader.mjs")).href, import.meta.url);
