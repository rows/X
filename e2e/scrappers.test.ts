import { promises as fs } from 'fs';
import { resolve } from 'path';

describe('Google', () => {
  beforeAll(async () => {
    await page.setRequestInterception(true);

    page.on('request', async (request) => {
      const data = await fs.readFile(resolve(__dirname, './wikipedia/index.html'));

      if (request.url().endsWith('/')) {
        request.respond({
          status: 200,
          contentType: 'text/html',
          body: data,
        });
      } else {
        request.continue();
      }
    });
  });

  it('should be titled "Google"', async () => {
    const extensionId = 'phpjngkjjocinjepokdimcomfmgkogbe';

    const extPage = await browser.newPage();
    const extensionUrl = `chrome-extension://${extensionId}/index.html`;

    await page.bringToFront();
    await page.goto('https://wikipedia.com', { waitUntil: 'domcontentloaded' });
    await extPage.goto(extensionUrl, { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(1000);
    await extPage.bringToFront();
    const button = await extPage.waitForSelector('.copy-btn');
    await button.click();
    await page.bringToFront();

    const context = await browser.defaultBrowserContext();
    await context.overridePermissions('https://wikipedia.com', ['clipboard-read']);
    const clipboard = await page.evaluate(() => navigator.clipboard.readText());

    expect(clipboard).toBe(
      'Name\tLocation\tVisitors in 2023 and 2022\n' +
        'Louvre\tParis , France\t8,900,000 (2023) [2 ]\n' +
        "Musée d'Orsay\tParis , France\t5.2 million (including Musée de l'Orangerie ) (2023) [3 ]\n" +
        'National Museum of Natural History\tWashington, D.C. , United States\t4,400,000 (2023) [4 ]\n' +
        'National Museum of Korea\tSeoul , South Korea\t4.18 million (2023) [5 ]\n' +
        "Musée National d'Histoire Naturelle\tParis , France\t3.8 million ((2023) [7 ]\n" +
        'Prado Museum\tMadrid, Spain\t3,209,285 (2023) [9 ]\n' +
        'Guggenheim Museum Bilbao\tBilbao , Spain\t1,324,000 (2023) [10 ]\n' +
        'Vatican Museums\tVatican City\t5,080,866 (2022)\n' +
        'Natural History Museum\tLondon , United Kingdom\t4,654,608 [11 ] (2022)\n' +
        'British Museum\tLondon , United Kingdom\t4,097,253 [1 ] [11 ] (2022)\n' +
        'Tate Modern\tLondon , United Kingdom\t3,883,160 [11 ] (2022)\n' +
        'Guangdong Museum\tGuangzhou , China\t3,359,700 [12 ] (2022)\n' +
        'Mevlana Museum\tKonya , Turkey\t3,352,505 [13 ] (2022)\n' +
        'National Gallery of Art\tWashington, D.C. , United States\t3,256,433 (2022) [1 ]\n' +
        'Metropolitan Museum of Art\tNew York City , United States\t3,208,832 [a ] [1 ] (2022)\n' +
        'State Hermitage Museum\tSaint Petersburg , Russia\t2,812,913 [1 ] (2022)\n' +
        'National Gallery\tLondon , United Kingdom\t2,727,119 [11 ] <2022)\n' +
        'State Russian Museum\tSaint Petersburg , Russia\t2,651,688 [1 ] (figures below are from 2022)\n' +
        'National Museum of Marine Science and Technology\tKeelung , Taiwan\t2,582,444 [14 ]\n' +
        'Victoria and Albert Museum\tLondon , United Kingdom\t2,370,261 [11 ]\n' +
        'London Science Museum\tLondon , United Kingdom\t2,334,930 [11 ]\n' +
        'Chinese Aviation Museum\tBeijing , China\t2,300,000 [15 ]\n' +
        'National Museum of Natural Science\tTaichung , Taiwan\t2,299,808 [14 ]\n' +
        'Galleria degli Uffizi\tFlorence , Italy\t2,222,692 [1 ]\n' +
        'Museum of Modern Art\tNew York City , United States\t2,190,440 [1 ]\n' +
        'Topography of Terror\tBerlin , Germany\t2,100,000 [16 ]\n' +
        'M+\tHong Kong , China\t2,034,331 [1 ]\n' +
        'Opium War Museum  [zh ]\tDongguan , China\t2,025,800 [17 ]\n' +
        "Cité des Sciences et de l'Industrie\tParis , France\t1,992,823 [18 ]\n" +
        'National Museum of Scotland\tEdinburgh , United Kingdom\t1,973,751 [11 ]\n' +
        'State Tretyakov Gallery\tMoscow , Russia\t1,910,000 [1 ]\n' +
        'National Taiwan Science Education Center\tTaipei , Taiwan\t1,878,504 [14 ]\n' +
        'National Science and Technology Museum\tKaohsiung , Taiwan\t1,875,372 [14 ]\n' +
        'National Museum of Modern and Contemporary Art\tSeoul , South Korea\t1,806,641 [1 ]\n' +
        'Smithsonian Museum of American History\tWashington, D.C. , United States\t2,100,000 (2023) [19 ]\n' +
        'Rijksmuseum\tAmsterdam , Netherlands\t1,766,084 [1 ]\n' +
        'California Science Center\tLos Angeles , United States\t1,694,000 [20 ]\n' +
        'National Museum of China\tBeijing , China\t1,630,911 [21 ]\n' +
        'Royal Museums Greenwich\tLondon , United Kingdom\t1,628,580 [11 ]\n' +
        'Nanjing Museum\tNanjing , China\t1,610,000 [22 ]\n' +
        'Zhejiang Museum of Natural History\tHangzhou , China\t1,581,263 [23 ]\n' +
        'National Gallery of Victoria\tMelbourne , Australia\t1,580,303 [1 ]\n' +
        'Jianchuan Museum Cluster\tChengdu , China\t1,538,143 [24 ]\n' +
        'Houston Museum of Natural Science\tHouston , United States\t1,520,000 [20 ]\n' +
        'Tokyo Metropolitan Art Museum\tTokyo , Japan\t1,509,970 [1 ]\n' +
        'Changzhou Museum\tChangzhou , China\t1,508,229 [25 ]\n' +
        'Humboldt Forum\tBerlin , Germany\t1,500,000 [1 ]\n' +
        'National Museum of Anthropology\tMexico City , Mexico\t1,494,587 [26 ]\n' +
        'National Museum of History\tMexico City , Mexico\t1,486,379 [26 ]\n' +
        'National Air and Space Museum [b ]\tWashington, D.C. , United States\t1,486,000 [27 ]\n' +
        'Kaohsiung Museum of Fine Arts\tKaohsiung , Taiwan\t1,461,406 [14 ]\n' +
        'Acropolis Museum\tAthens , Greece\t1,451,727 [1 ]\n' +
        'China Science and Technology Museum\tBeijing , China\t1,431,189 [28 ]\n' +
        "Galleria dell'Accademia\tFlorence , Italy\t1,428,369 [1 ]\n" +
        'Suzhou Museum\tSuzhou , China\t1,417,412 [29 ]\n' +
        'Chengdu Museum\tChengdu , China\t1,404,735 [30 ]\n' +
        'Shanghai Science and Technology Museum\tShanghai , China\t1,403,179 [31 ]\n' +
        'The National Art Center, Tokyo\tTokyo , Japan\t1,400,096 [1 ]\n' +
        'Louis Vuitton Foundation\tParis , France\t1,398,525 [1 ]\n' +
        'Tokyo National Museum\tTokyo , Japan\t1,372,132 [1 ]\n' +
        'National Museum in Kraków\tKraków , Poland\t1,365,425 [1 ]\n' +
        'Centro Cultural Banco do Brasil\tSão Paulo , Brazil\t1,364,208 [1 ]\n' +
        'Van Gogh Museum\tAmsterdam , Netherlands\t1,364,023 [1 ]\n' +
        'National Museum of Nature and Science\tTokyo , Japan\t1,350,000 [20 ]\n' +
        'Kunsthistorisches Museum\tVienna , Austria\t1,345,617 [1 ]\n' +
        'Tianjin Natural History Museum\tTianjin , China\t1,320,752 [32 ]\n' +
        'Palacio de Cristal del Retiro\tMadrid , Spain\t1,318,823 [c ] [1 ]\n' +
        'Scottish National Gallery\tEdinburgh , United Kingdom\t1,277,230 [1 ]\n' +
        'National Gallery Singapore\tSingapore\t1,262,189 [1 ]\n' +
        'Museo Reina Sofía\tMadrid , Spain\t1,253,183 [d ] [1 ]'
    );
  }, 70000);
});
