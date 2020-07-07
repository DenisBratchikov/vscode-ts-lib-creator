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

* Command **Create TS library** lets you to create TS library, where styles are imported from components
* Command **Create TS + Less library** lets you to create TS library with *.less* file, where all style files are imported
* Command **Add component to library** lets you to create new component in existing library

## USAGE

You can activate the extension via command palette using extension title **Create TS library** / **Create TS + Less library** / **Add component to library** or via context menu on any folder.
To create *TS* or *TS + Less* library open context menu on module folder and to create component open context menu on library folder.
**IMPORTANT** You must create component in library with the same file structure as one this plugin creates.

## Extension settings

There are no settings for now

## Release

# 1.0.0

* Rename *Create Library* to *Create TS library*
* Add command *Create TS + Less library*
* Add command *Add component to library*
