# VSCode Extension. TypeScript Library Structure Creator plus Tensor Git

The extension allows to creatre typescript library file strurture as it applies in [Tensor company](https://tensor.ru/) and to execute git routine
Library structure includes library files (only *.ts* or *.ts* and *.less*) and library folder with component files (main *.ts* file, style file, template file and interface folder and file).
Git routine includes following commands: *pull*, *create branch*, *checkout* on created branch, *commit*, *push*, *checkout* on rc branch.

## Features

* Command **Create TS library** lets you to create TS library, where styles are imported from components
* Command **Create TS + Less library** lets you to create TS library with *.less* file, where all style files are imported
* Command **Add component to library** lets you to create new component in existing library
* Command **Tensor Git** lets you execute git routine

## USAGE

You can activate the extension via command palette using extension title **Create TS library** / **Create TS + Less library** / **Add component to library** or via context menu on any folder
To create *TS* or *TS + Less* library open context menu on module folder and to create component open context menu on library folder
**IMPORTANT** You must create component in library with the same file structure as one this plugin creates

## Extension settings

You can configure the extension via VSCode user settings.
Configuration for TypeScript Library Structure Creator:
1. **separateResources** {boolean} specifies library inner structure. When *true* component style, template and interface files are created in separate folder in library folder

Configuration for Tensor Git:
1. **branchPrefix** {string} - part of branch name after version number
2. **branchNameSource** {string} - source for main branch name part:
* **popup** - you will be asked to specify branch name via popup window
* **clipboard** - branch name will be gotten from clipboard
* **random** - branch name will be created at random
3. **strictMode** specifies a behavior, when you are not allowed to execute git extension on non-rc branch

Default configuration:
```JSON
{
    "creator": {
        "separateResources": false
    },
    "git": {
        "branchPrefix": "tensor",
        "branchNameSource": "clipboard",
        "strictMode": true
    }
}
```

## Release

# 1.0.0

* Rename *Create Library* to *Create TS library*
* Add command *Create TS + Less library*
* Add command *Add component to library*

# 2.0.0

* Add configuration file for extension settings
* Add command *Tensor Git*
* Fix small bugs

# 3.0.0

* Add extenstion configuration to VSCode settings
* Update the inserted content
* Add opportunity to open component documentation

# 3.0.2

* Add standart classes snippets
