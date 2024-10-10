[![npm](https://img.shields.io/npm/v/hooli-cli.svg)](https://www.npmjs.com/package/hooli-cli) [![npm downloads](https://img.shields.io/npm/dm/hooli-cli.svg?style=flat-square)](https://npm-stat.com/charts.html?package=hooli-cli)

# hooli-cli

Hooli CLI is a command line tool for npm package management. This tool is designed to help you manage your npm packages and dependencies in a more efficient way.

## Installation

```bash
npm install -g hooli-cli
```

## Usage

```bash
hooli-cli [command]
```

Also, you can set an alias for easier access to the tool. For example:

```bash
alias hc=hooli-cli
```

## Commands

If no command is provided, the tool will show a list of available commands.

```bash
hooli-cli
```

<img src="https://res.cloudinary.com/dl1zrb1pw/image/upload/v1728593422/menu_mojwb3.png"
        alt="Picture"
        width="800"
        height="auto"
        style="display: block; margin: 0 auto" />

- `install` - Install a package

```bash
hooli-cli install
```

This command will open a prompt for you to enter the package name you want to install. After entering the package name, a list of available packages will be displayed for you to choose from.

<img src="https://res.cloudinary.com/dl1zrb1pw/image/upload/v1728593422/install_wgioqm.png"
		alt="Picture"
		width="800"
		height="auto"
		style="display: block; margin: 0 auto" />

- `uninstall` - Uninstall a package

```bash
hooli-cli uninstall
```

This command will show a list of installed packages for you to choose from. After selecting a one, or more, packages to uninstall, the selected packages will be removed from your project.

<img src="https://res.cloudinary.com/dl1zrb1pw/image/upload/v1728593422/uninstall_qqra8c.png"
		alt="Picture"
		width="800"
		height="auto"
		style="display: block; margin: 0 auto" />

- `scripts` - Run a script

```bash
hooli-cli scripts
```

This command will show a list of available scripts in your `package.json` file. After selecting a script to run, the selected script will be executed.

<img src="https://res.cloudinary.com/dl1zrb1pw/image/upload/v1728593422/scripts_p2syad.png"
		alt="Picture"
		width="800"
		height="auto"
		style="display: block; margin: 0 auto" />
