import { compat, matches, types as T } from "../deps.ts";

export const migration: T.ExpectedExports.migration =
  compat.migrations.fromMapping(
    {
      "0.2.1": {
        up: compat.migrations.updateConfig(
          (config) => {
            if (
              matches
                .shape({
                  logger: matches.shape({
                    log_to_file: matches.any,
                    log_file: matches.any,
                    log_level_file: matches.any,
                  }),
                })
                .test(config)
            ) {
              config.logger.log_to_file = false;
              config.logger.log_file = "/root/start9/logs.txt";
              config.logger.log_level_file = 1;
            }
            return config;
          },
          false,
          { version: "0.2.1", type: "up" }
        ),
        down: compat.migrations.updateConfig(
          (config) => {
            if (
              matches
                .shape({
                  logger: matches.shape({
                    log_to_file: matches.any,
                    log_file: matches.any,
                    log_level_file: matches.any,
                  }),
                })
                .test(config)
            ) {
              delete config.logger.log_to_file;
              delete config.logger.log_file;
              delete config.logger.log_level_file;
            }
            return config;
          },
          true,
          { version: "0.2.1", type: "down" }
        ),
      },
    },
    "0.2.1"
  );
