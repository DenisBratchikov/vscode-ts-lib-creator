# VSCode Extension. TypeScript Library Structure Creator

The extension allows to creatre typescript library file strurture as it applies in [Tensor company](https://tensor.ru/)
Library structure includes:
1. Library file with component and component options interface exports
2. Library folder named like library file without extension and with **_**
3. Component file with common content
4. Style file (.less)
5. Template file (.wml)
6. Interface folder in library folder
7. Interface file in interface folder with common content

## Features

You can activate the extension via command palette using extension title **Create Library**.
There are three ways to set rigth imports:
- create config file (see Extension settings) and specify path to module content (including module name) in **rootDir** property. In this case you should input just library and component names
- create config file and path to module in **rootDir**. In this case you should input module name, library name and component name
- launch extension without config file. In this case you should input module, library and component names if the module folder is in your vscode explorer. Otherwise you should input just library and component names, the module name will be your project folder name

## Extension settings

You can specify following settings in **tensor.lib.json** file:
- `rootDir`: default root directory from your project folder, where the library in creating