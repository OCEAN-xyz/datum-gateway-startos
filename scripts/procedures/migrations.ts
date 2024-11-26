import { compat, matches, types as T } from "../deps.ts";

export const migration: T.ExpectedExports.migration =
  compat.migrations.fromMapping(
    {
      "0.2.1": {
        up: compat.migrations.updateConfig(
          (config) => {
            return config;
          },
          false,
          { version: "0.2.1", type: "up" }
        ),
        down: compat.migrations.updateConfig(
          (config) => {
            return config;
          },
          false,
          { version: "0.2.1", type: "down" }
        ),
      },
    },
    "0.2.1"
  );
