const xl = require('excel4node');

const pageScraper = require('./pageScraper');
const createSheet = (data) => {
    return new Promise(resolve => {  
    // setup workbook and sheet
        var wb = new xl.Workbook();
        var ws = wb.addWorksheet('Sheet');

        ws.cell(1, 1)
            .string('title')

        ws.cell(1, 2)
            .string('price')

        ws.cell(1, 3)
            .string('area')

        for (let i = 0; i < data.length; i++) {
			console.log("HERE ", i)
            let row = i + 2
            ws.cell(row, 1)
            .string(data[i].title)
            ws.cell(row, 2)
            .string(data[i].price)
            ws.cell(row, 3)
            .string(data[i].area)
        }
  
  	resolve( wb )})
}
async function scrapeAll(browserInstance){
    let browser;
    try{
        browser = await browserInstance;
        const data = await pageScraper.scraper(browser);
        console.log({fiasdada: data})
		createSheet(data).then( file => {
			file.write('Data.xlsx');
		})
		console.log("DONE")

    }
    catch(err){
        console.log("Could not resolve the browser instance => ", err);
    }
}

module.exports = (browserInstance) => scrapeAll(browserInstance)