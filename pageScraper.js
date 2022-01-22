const select = require ('puppeteer-select');
const scraperObject = {
    url: 'https://www.99acres.com/residential-land-in-greater-noida-ffid',
    async scraper(browser){
        let page = await browser.newPage();
        console.log(`Navigating to ${this.url}...`);
        // Navigate to the selected page
        await page.goto(this.url);
        await page.waitForSelector('.r_srp__rightSection', {visible: true});
        
        let scrapedData = []
        let count = 1
        async function scrapeCurrentPage(){
            let data = await page.evaluate(async () => {
                const wait = (duration) => { 
                    console.log('waiting', duration);
                    return new Promise(resolve => setTimeout(resolve, duration)); 
                };

                const scroll = async () => {
        
                    window.atBottom = false;
                    const scroller = document.documentElement;  // usually what you want to scroll, but not always
                    let lastPosition = -1;
                    while(!window.atBottom) {
                    scroller.scrollTop += 1000;
                    // scrolling down all at once has pitfalls on some sites: scroller.scrollTop = scroller.scrollHeight;
                    await wait(300);
                    const currentPosition = scroller.scrollTop;
                    if (currentPosition > lastPosition) {
                        console.log('currentPosition', currentPosition);
                        lastPosition = currentPosition;
                    }
                    else {
                        window.atBottom = true;
                    }
                    }
                    console.log('Done!');
            
                };

                await scroll()
                await wait(600);
            
                let results = []
                let items = document.querySelectorAll('.srpTuple__tupleDetails')
                console.log({items})
                items.forEach((item) => {
                    title = item.querySelector('a#srp_tuple_property_title > h2') != null ? item.querySelector('a#srp_tuple_property_title > h2').innerText : 'NULL'
                    price = item.querySelector('#srp_tuple_price') != null ? item.querySelector('#srp_tuple_price').innerText : 'NULL'
                    area = item.querySelector('#srp_tuple_primary_area') != null ? item.querySelector('#srp_tuple_primary_area').innerText : 'NULL'

                    results.push({
                        title,
                        price,
                        area
                    })
                })
                return results
            })
            await page.waitForFunction('window.atBottom == true', {
                timeout: 900000,
                polling: 1000 // poll for finish every second
            });
            console.log({ data })
            scrapedData = scrapedData.concat(data)

            const wait = (duration) => { 
                console.log('waiting', duration);
                return new Promise(resolve => setTimeout(resolve, duration)); 
            };

            while (count < 115) {
                count ++;
                await page.goto(`https://www.99acres.com/residential-land-in-greater-noida-ffid-page-${count}`);
                await page.waitForSelector('.r_srp__rightSection', {visible: true});    
                return scrapeCurrentPage(); // Call this function recursively
            }

            await page.close();
            return scrapedData;
        }
        let data = await scrapeCurrentPage();
        console.log({finalData: data});
        return data;    
    }
}

module.exports = scraperObject;