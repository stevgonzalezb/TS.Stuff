import utils from '../Utils';
import puppeteer from 'puppeteer';
import mssql from 'mssql';

class Scrapper {

    Common:any;
    Sql:any;

	constructor(Common:any, Sql:any) {
		this.Common = Common;
		this.Sql = Sql;
	}

	async Scrape() {
		const self = this;
		try {
			const browserInstance = await self.StartBrowser();
			const countriesUrls = await self.GetCountriesUrls(browserInstance);
			const dataToInsert = await self.GetAndFormatFinalData(browserInstance, countriesUrls);
			const dataInsertion = await self.InsertToDataBase(dataToInsert);

			if (dataInsertion.success) {
				return self.Common.Logger.Info(`[scraper.js].[Scrape] >> Inserción exitosa en base de datos`);
			} else {
				return self.Common.Logger.Error(`[scraper.js].[Scrape] >> Error durante inserción en base de datos: ${dataInsertion.error}`);
			}

		} catch (err) {
			return self.Common.Logger.Error(`[scraper.js].[Scrape] >> Error realizando scraping: ${err.message}`);
		}
	}

	async StartBrowser() {
		const self = this;
		try {
			self.Common.Logger.Debug(`[scraper.js].[StartBrowser] >> Abriendo el navegador......`);
			const browser = await puppeteer.launch({
				headless: false,
				args: ["--disable-setuid-sandbox"],
				'ignoreHTTPSErrors': true
			});
			return browser;
		} catch (err) {
			self.Common.Logger.Error(`[scraper.js].[StartBrowser] >> No se pudo crear una instancia del navegador: ${err.message}`);
			throw new Error(`No se pudo crear una instancia del navegador: ${err.message}`);
		}
	}

	async GetCountriesUrls(browser:any) {
		const self = this;
		try {
			const mainUrl = self.Common.Config.CIAWebPageUrl;
			const page = await browser.newPage();
			self.Common.Logger.Debug(`[scraper.js].[GetCountriesUrls] >> Navegando hacia ${mainUrl}...`);
			await page.goto(mainUrl);
			await page.waitForSelector('.Resources');

			const numberOfPages = await page.$$eval('.card-media__controls-wrapper > span', async (numOfPagesLabel:any) => {
				numOfPagesLabel = numOfPagesLabel.map((el:any) => el.textContent);
				const pageInfo = numOfPagesLabel[1]; // Label de cantidad de páginas en el segundo de tres de spans => ['Previous Page', 'Page 01 of XX', 'Next Page']
				const num = parseInt(pageInfo.slice(-2),0);
				return num;
			});

			let fullCountriesUrls:any = [];
			for (let i = 1; i <= numberOfPages; i++) {
				const currentCountriesUrls = await self.GetAndFormatCountriesListPage(page);
				fullCountriesUrls = fullCountriesUrls.concat(currentCountriesUrls);
				if (i < numberOfPages) await self.ScrollAndClickNextpage(page);
			}
			await page.close();
			self.Common.Logger.Info(`[scraper.js].[GetCountriesUrls] >> Finalzia obtención de URLs de países`);
			return fullCountriesUrls;
		} catch (err) {
			self.Common.Logger.Error(`[scraper.js].[GetCountriesUrls] >> Error obteniendo urls de los países de la página de la CIA: ${err.message}`);
			throw new Error(`Error obteniendo urls de los países de la página de la CIA: ${err.message}`);
		}
	}

	async GetAndFormatFinalData(browser:any, countriesUrls:any) {
		const self = this;
		try {
			let allCountriesData:any = [];
			await utils.AsyncForeach(countriesUrls, async (countryUrl:any) => {
				const page = await browser.newPage();
				const formattedUrl = countryUrl.slice(0, -1);
				const country = formattedUrl.substring(formattedUrl.lastIndexOf('/') + 1);
				self.Common.Logger.Debug(`[scraper.js].[GetAndFormatFinalData] >> Navegando hacia ${countryUrl}...`);
				await page.goto(countryUrl);
				await page.waitForSelector('.free-form-content__content');

				const countryData = await page.$$eval('.wysiwyg-wrapper h3, .wysiwyg-wrapper p', async (unstructuredData:any) => {
					unstructuredData = unstructuredData.map((el:any) => el.textContent);
					return unstructuredData;
				});

				const formattedCountryData = await self.FormatCountryData(countryData, country);
				allCountriesData = allCountriesData.concat(formattedCountryData);
				await page.close();
			});
			await browser.close();
			self.Common.Logger.Info(`[scraper.js].[GetAndFormatFinalData] >>Finaliza formateo de data de todos los países`);
			return allCountriesData;
		} catch (err) {
			self.Common.Logger.Error(`[scraper.js].[GetAndFormatData] >> Error obteniendo y formateando data final: ${err.message}`);
			throw new Error(`Error obteniendo datos de país: ${err.message}`);
		}
	}

	async FormatCountryData(unstructuredData:any, country:any) {
		const self = this;
		try {
			self.Common.Logger.Debug(`[scraper.js].[GetAndFormatDataByCountry] >> Obteniendo y formateando datos de país (${country})...`);
			const formattedList = [];
			while (unstructuredData.length > 0) {
				const currentPerson = unstructuredData.splice(0, 2);
				formattedList.push({ position: currentPerson[0], name: currentPerson[1] || '', country })
			}
			return formattedList;
		} catch (err) {
			self.Common.Logger.Error(`[scraper.js].[GetAndFormatDataByCountry] >> Error obteniendo y formateando datos de país: ${err.message}`);
			throw new Error(`Error obteniendo datos de país: ${err.message}`);
		}
	}

	async GetAndFormatCountriesListPage(page:any) {
		const self = this;
		try {
			self.Common.Logger.Debug(`[scraper.js].[GetAndFormatCountriesListPage] >> Inicia obtención y formateo de urls de países desde paginación`);
			const urls = await page.$$eval('.Resources a', async (countries:any) => {
				countries = countries.map((country:any) => country.href);
				countries.shift(); // Primer enlace, se elimina porque no es de un país
				return countries;
			});
			return urls;
		} catch (err) {
			self.Common.Logger.Error(`[scraper.js].[GetAndFormatCountriesListPage] >> Error obteniendo y formateando en paginación de países: ${err.message}`);
			throw new Error(err.message);
		}
	}

	async ScrollAndClickNextpage(page:any) {
		const self = this;
		try {
			self.Common.Logger.Debug(`[scraper.js].[ScrollAndClickNextpage] >> Haciendo scroll y click en paginación de países...`);
			// Se realiza scroll para poder hacer click en el span de siguiente
			await page.evaluate(async () => {
				await new Promise<void>((resolve, reject) => {
					let totalHeight = 0;
					const distance = 100;
					const timer = setInterval(() => {
						const scrollHeight = document.body.scrollHeight;
						window.scrollBy(0, distance);
						totalHeight += distance;

						if (totalHeight >= scrollHeight) {
							clearInterval(timer);
							resolve();
						}
					}, 100);
				});
			});
			await page.click('.pagination__arrow-right')
		} catch (err) {
			self.Common.Logger.Error(`[scraper.js].[ScrollAndClickNextpage] >> Error realizando scroll y click en paginación de países: ${err.message}`);
			throw new Error(err.message);
		}
	}

	async InsertToDataBase(recordsToInsert:any) {
		const self = this;
		try {
			self.Common.Logger.Debug(`[scraper.js].[InsertToDataBase] >> Inicia inserción a base de datos`);
			await utils.AsyncForeach(recordsToInsert, async (ciaRecord:any) => {
				const spInsertParams = [
					{
						name: 'Position',
						type: mssql.VarChar,
						value: ciaRecord.position
					},
					{
						name: 'Name',
						type: mssql.VarChar,
						value: ciaRecord.name
					},
					{
						name: 'Country',
						type: mssql.VarChar,
						value: ciaRecord.country
					}];
				const insertionProcess = await self.Sql.ExecuteSP(self.Common.Config.StoredProcedures.Insertion, spInsertParams);
				self.Common.Logger.Debug(`[scraper.js].[InsertToDataBase] >> Resultado de inserción: ${insertionProcess.recordest.Result}`);
			})
			return { success: true, result: 'OK', error: 'null' };
		} catch (err) {
			self.Common.Logger.Error(`[scraper.js].[InsertToDataBase] >> Error insertando en base de datos: ${err.message}`);
			return { success: false, result: 'null', error: err.message };
		}
	}
}

export = Scrapper;