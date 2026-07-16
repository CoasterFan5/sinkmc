import AdmZip from "adm-zip";
import YAML from "yaml";
import z from "zod";

const pluginYmlSchema = z.object({
  name: z.string(),
  version: z.string(),
  main: z.string(),
  depend: z.array(z.string()).optional(),
});

export type PluginInfo = z.infer<typeof pluginYmlSchema>;
type PluginParserResponse =
  ({ isError: false } & PluginInfo) | { isError: true; message: string };

/**
 * Takes an ArrayBuffer of a plugin JAR and returns basic plugin info (name, version, main, etc.)
 * parsed from plugin.yml, or an error if the file is missing or malformed.
 */
export const pluginParser = (buffer: Buffer): PluginParserResponse => {
  try {
    const zip = new AdmZip(buffer);
    const entry = zip.getEntry("plugin.yml");
    const raw = entry?.getData().toString();

    if (!raw) {
      return { isError: true, message: "Missing plugin.yml" };
    }

    const result = pluginYmlSchema.safeParse(YAML.parse(raw));

    if (!result.success) {
      return {
        isError: true,
        message: `Bad plugin.yml (${JSON.stringify(result.error.issues)})`,
      };
    }

    return { isError: false, ...result.data };
  } catch (e) {
    return {
      isError: true,
      message: `Something went wrong with parsing. (${e})`,
    };
  }
};
