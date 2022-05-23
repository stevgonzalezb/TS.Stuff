import Utils from '../Utils';
import fs from 'fs';
import fsExtra from 'fs-extra';
import path from 'path';
import jsObfuscator from 'javascript-obfuscator';

class Ofuscador {

	Common:any;

	constructor(Common:any) {
		this.Common = Common;
	}

	async Obfuscate() {
		const self = this;
		try {
			const targetFolder = await this.CopySourceProject();
			const obfuscatedFiles = await this.ReadFolderAndObfuscateFiles(targetFolder, []);
			self.Common.Logger.Info(`[ofuscador.js].[Ofuscar] >> Archivos ofuscados:`);
			self.Common.Logger.Info(`************************************************`);
			obfuscatedFiles.forEach((element:any) => self.Common.Logger.Info(`[ofuscador.js].[Ofuscar] >> ${element}`));
			self.Common.Logger.Info(`************************************************`);
			return self.Common.Logger.Info(`[ofuscador.js].[Ofuscar] >> Proyecto ofuscado de manera exitosa: ${targetFolder}`);
		} catch (err) {
			return self.Common.Logger.Error(`[ofuscador.js].[Ofuscar] >> Error ofuscando proyecto: ${err.message}`);
		}
	}

	async CopySourceProject() {
		const self = this;
		try {
			const originalProjectPath = self.Common.Config.SourceProjectPath;
			const originalProjectName = originalProjectPath.substring(originalProjectPath.lastIndexOf('\\') + 1);
			const obfuscateFinalPath = `${self.Common.Config.ObfuscateProjectPath}\\${originalProjectName}_Ofuscado`;

			fsExtra.copySync(originalProjectPath, `${obfuscateFinalPath}`);
			self.Common.Logger.Info(`[ofuscador.js].[CopySourceProject] >> Proyecto copiado de manera exitosa: ${obfuscateFinalPath}`);
			return obfuscateFinalPath;
		} catch (err) {
			throw new Error(`[ofuscador.js].[CopySourceProject] >> Error copiando proyecto original: ${err.message}`);
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
							self.Common.Logger.Info(`[ofuscador.js].[ReadFolderAndObfuscateFiles] >> Se omite la ofuscación del archivo "${currentElementPath}"`)
						}
					}
				}
			})
			return arrayOfFiles
		} catch (err) {
			throw new Error(`[ofuscador.js].[ReadFolderAndObfuscateFiles] >> Error procesando proyecto: ${err.message}`);
		}
	}

	async ObfuscateFile(filePath:string) {
		const self = this;
		try {
			const fileToObfuscate = fs.readFileSync(filePath, { encoding: 'utf8' });
			const obfuscationResult = jsObfuscator.obfuscate(fileToObfuscate);
			const uglyCode = obfuscationResult.getObfuscatedCode();

			fs.writeFileSync(filePath, uglyCode);
			return self.Common.Logger.Debug(`[ofuscador.js].[ObfuscateFile] >> Archivo ${filePath} ofuscado de manera exitosa`);
		} catch (err) {
			throw new Error(`[ofuscador.js].[ObfuscateFile] >> Error ofuscando archivo ${filePath}: ${err.message}`);
		}
	}
}

export = Ofuscador;