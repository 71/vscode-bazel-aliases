# bazel-aliases

Give names to Bazel targets, allowing VS Code variables to refer to their
output, environment, and working directory.

## Overview

This extension adds the concept of an "active" Bazel target; set it with
`Bazel > Set Active Target` or by clicking this extension's status bar item. The
active target can then be built with `Bazel > Build Active Target`. It can also
be used in commands (including `launch.json` files) via
`bazel-aliases.active.{output,outputPath,envFile,workingDirectory}`.

If you'd like to have more than one "alias", define `bazel-aliases.aliases` in
`settings.json` like so:

```json
{
  "bazel-aliases.aliases": {
    "main": "//:main",
    "test": "//:test"
  }
}
```

Now the status bar item can be hovered to override these aliases, and new
commands `bazel-aliases.{main,test}.{output,...}` will be available.

### Environment file

The extension can be configured to load an environmemt file and automatically
include its entries in generated `.envFile` files.

The `.env` file location can be set in `settings.json` like so:

```json
{
  "bazel-aliases.envFile": "/path/to/env/file"
}
```

By default, no environment file will be used.

## Commands

For an alias `active` (the default alias), the following commands are defined:

- `bazel-aliases.active.build` builds the target.

- `bazel-aliases.active.output` builds the target and yields its absolute path.

- `bazel-aliases.active.run` builds the target and runs its output.

- `bazel-aliases.active.outputPath` yields the target's absolute path without
  building it.

- `bazel-aliases.active.envFile` builds the target and yields the absolute path
  to a file which contains the execution environment.

- `bazel-aliases.active.workingDirectory` builds the target and yields the
  absolute path of the working directory it would run under with `bazel run`.

- `bazel-aliases.active.update` sets the target corresponding to that alias for
  the current user/workspace.

## Example

This is especially useful with [CodeLLDB](https://github.com/vadimcn/codelldb);
here is an example `launch.json` which debugs the target referenced by `main` as
if by using `bazel run`:

```json
{
  "type": "lldb",
  "name": "Launch main executable",
  "request": "launch",
  "program": "${command:bazel-aliases.main.outputPath}",
  "envFile": "${command:bazel-aliases.main.envFile}",
  "cwd": "${command:bazel-aliases.main.workingDirectory}"
}
```
