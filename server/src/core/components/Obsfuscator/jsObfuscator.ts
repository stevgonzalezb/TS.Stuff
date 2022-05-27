import Utils from '../Utils';
import fs from 'fs';
import fsExtra from 'fs-extra';
import path from 'path';
import jsObfuscator from 'javascript-obfuscator';

class Obfuscator {

	Common:Common;

	constructor(Common:Common) {
		this.Common = Common;
	}

	async Obfuscate() {
		const self = this;
		try {
			const targetFolder = await this.CopySourceProject();
			const obfuscatedFiles = await this.ReadFolderAndObfuscateFiles(targetFolder, []);
			self.Common.Logger.Info(`[jsObfuscator.ts].[Obfuscate] >> Obfuscated files:`);
			obfuscatedFiles.forEach((element:any) => self.Common.Logger.Info(`[jsObfuscator.ts].[Obfuscate] >> ${element}`));
			self.Common.Logger.Info(`************************************************`);
			return self.Common.Logger.Info(`[jsObfuscator.ts].[Obfuscate] >> Project successfully obfuscated: ${targetFolder}`);
		} catch (err) {
			return self.Common.Logger.Error(`[jsObfuscator.ts].[Obfuscate] >> Error obfuscating project: ${err.message}`);
		}
	}

	async CopySourceProject() {
		const self = this;
		try {
			const originalProjectPath = self.Common.Config.SourceProjectPath;
			const originalProjectName = originalProjectPath.substring(originalProjectPath.lastIndexOf('\\') + 1);
			const obfuscateFinalPath = `${self.Common.Config.ObfuscateProjectPath}\\${originalProjectName}_Ofuscado`;

			fsExtra.copySync(originalProjectPath, `${obfuscateFinalPath}`);
			self.Common.Logger.Info(`[jsObfuscator.ts].[CopySourceProject] >> Project successfully copied: ${obfuscateFinalPath}`);
			return obfuscateFinalPath;
		} catch (err) {
			throw new Error(`[jsObfuscator.js].[CopySourceProject] >> Error copying original project: ${err.message}`);
		}
	}

	async ReadFolderAndObfuscateFiles(dirPath:string, arrayOfFiles:any) {
		const self = this;
		try {
			const elements = fs.readdirSync(dirPath);
			const filesToIgnore = self.Common.Config.IgnoreFiles;
			arrayOfFiles = arrayOfFiles || [];

			await Utils.AsyncForeach(elements, async (element:any) => {
				const currentElementPath = `${dirPath}\\${element}`;
				if (fs.statSync(currentElementPath).isDirectory()) { // Si es carpeta, se ejecuta de manera recursiva
					arrayOfFiles = await self.ReadFolderAndObfuscateFiles(currentElementPath, arrayOfFiles)
				} else {
					if (path.extname(currentElementPath).toLowerCase() === '.js') { // Solo ofusca arhcivos con extensión .js
						if (!filesToIgnore.includes(path.basename(currentElementPath))) { // Se omite la ofuscasión de los archivos excluidos
							await this.ObfuscateFile(currentElementPath);
							arrayOfFiles.push(currentElementPath);
						} else {
							self.Common.Logger.Info(`[jsObfuscator.js].[ReadFolderAndObfuscateFiles] >> File obfuscation is omitted. "${currentElementPath}"`)
						}
					}
				}
			})
			return arrayOfFiles
		} catch (err) {
			throw new Error(`[jsObfuscator.js].[ReadFolderAndObfuscateFiles] >> Error processing project: ${err.message}`);
		}
	}

	async ObfuscateFile(filePath:string) {
		const self = this;
		try {
			const fileToObfuscate = fs.readFileSync(filePath, { encoding: 'utf8' });
			const obfuscationResult = jsObfuscator.obfuscate(fileToObfuscate);
			const uglyCode = obfuscationResult.getObfuscatedCode();

			fs.writeFileSync(filePath, uglyCode);
			return self.Common.Logger.Debug(`[jsObfuscator.js].[ObfuscateFile] >> File ${filePath} successfully obfuscated`);
		} catch (err) {
			throw new Error(`[ofuscador.js].[ObfuscateFile] >> File obfuscation error ${filePath}: ${err.message}`);
		}
	}
}

export = Obfuscator;