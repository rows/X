# RowsX Chrome Extension

RowsX is a versatile Chrome extension designed to streamline web scraping tasks, specifically tailored for websites with HTML tables. 

## How to run it on dev mode?

To start, you'll need to install the project on your local machine.
This requires Node.js to be installed on your system.
Once you've cloned the repository, execute the following command in your terminal to install the project's dependencies:

```bash
npm i
```

Once you've installed the project's dependencies,
you can initiate development mode by running the following command in your terminal:

```bash
npm run dev
```

Once your development environment is set up, follow these steps to start using our Chrome extension on your machine:

> [!NOTE]
> You need to do this just one time.
>  
> 1. Open the Chrome extensions page at [chrome://extensions](chrome://extensions/).
> 2. In the top right corner, you have a switch called "Developer Mode". Just activate it.
> 3. Click the "Load unpacked" button.
> 4. Select the directory containing your extension project. For example `~/repos/rows/x/dist`.
> 5. Your extension should now be loaded and running in development mode.
> 6. Pin the extension to reach it easily :smiley:
> 7. You can make changes to your extension files, and they will automatically be reflected in the browser.

## How to add a new scrapper?

There are 2 different ways of building a custom scrapper:
1. **The data is loaded from a list**
```js
{
    header: 'ProductHunt results',
    listElementsQuery: '<DOM query to find all elements for a list>',
    elementParser: [
        //...
        { title: 'Product image', query: '<CSS query that will find an image on each element>', type: 'image' },
        { title: 'Product name', query: '<CSS query that will find the desired text>', type: 'text' },
        //...
     ]
}
```
In this configuration the only thing that changes is the `type`, and it could be of different types:
- `image`, it will extract the src link of the image and will be used as `=IMAGE("<img link>")` on cells
- `text` will extract all the text of the element
- `clean-url` will get the src without query parameters, this is helpful in sites like LinkedIn.
- `link` it will return the href src
- `get-attribute`, is the most exotic one, because it will get the HTML value of a specific attribute because some elements have descriptions as aria-label. For example, G2.com has data for lazy loading, and the real image source is at the attribute `data-deferred-image-src`, for that scenario we need to use this parameter like this `{ title: 'Logo', query: '[class*="product-listing__img"] > img', type: 'get-attribute', attribute: 'data-deferred-image-src' },`.

2. **The data is loaded from a DIV table (not the conventional HTML table)** - There is an example of a configuration for those scenarios:
```js
parseTables: {
    header: "Custom div parser", // <- title that will presented on RowsX UI.
    tables: [
        { rows: '<DOM query to find all rows>', cols: '<DOM query to find all cols>' },
        { rows: '<DOM query to find all rows>', cols: '<DOM query to find all cols>' },
    ],
    mergeTablesBy: 'row' // <- it will merge the tables by row or by column this is opcional
}
```
> [!TIP]
> The `mergeTablesBy` property defines the strategy for combining multiple tables into a single dataset. This parameter is optional and could be set as `row`, which means that tables will be merged by rows, resulting in a single table with all rows combined. If set to `column`, tables will be merged by columns, resulting in a single table with all columns combined.

### When use `.example` and `[class*="example"]`

<img width="724" alt="image" src="https://github.com/rows/X/assets/7489569/674d5939-9991-471b-99b5-240b24e0a8f7">

<img width="726" alt="image" src="https://github.com/rows/X/assets/7489569/59cc34ab-bbaa-46e4-aef3-b19d8b7fd4e6">



## How does this work with the Rows? :thinking:
In the following image, you can see how it works and each step will have a better explanation:

![image](https://github.com/rows/X/assets/7489569/49213252-613d-46d2-beb8-3a196ce75511)

1. **User Initiates Action** - The user clicks on the rowsX icon on their browser, prompting the extension to take action. This action triggers the opening of the RowsX UI, which is the main interface for interacting with the extension.
2. **The RowsX UI is displayed and Event Trigger** - Initially, the RowsX UI displays an empty state component, indicating that no data has been extracted. This signifies the extension is ready to start extracting data from the current web page. And after rendering everything it will trigger the `rows-x:scrap` event.
3. **Background Script Activation** - Upon displaying the empty state component, the RowsX UI emits an event named `rows-x:scrap`. This event will be listened to by the service worker who is running in the `background.js` script, which is responsible for handling background tasks and communication with the extension's popup window.
4. **Data Extraction Process** - The background.js script receives the `rows-x:scrap` event and starts the data extraction process. It first attempts to identify a suitable scraper based on the URL of the current web page. If a matching scraper is found, it utilizes that scraper to extract the relevant data from the page. If no matching scraper is found, the script falls back to extracting data directly from HTML tables on the page.
5. **Transmitting Extracted Data** - Upon completing data extraction, the service worker sends the extracted data to the RowsX UI as JSON. The JSON response follows a structured format that the UI can readily parse and display.
```json
[
  ...,
  {
    "title": "Best Amazon products",
    "table": [
      ["header_1", "header_2", "header_3"],
      ["cell_1", "cell_2", "cell_3"],
      ["cell_4", "cell_5", "cell_8"],
      ["cell_7", "cell_8", "cell_9"],
    ]
  }
  ...
]
```
6. **Sharing Extracted Data with Rows App** - When the user clicks on the "Open in Rows" button, it initiates the transfer of extracted data to the Rows app. This triggers an event named `rows_x:store`, which signals the service worker to convert the extracted data into a TSV format. The converted data is then packaged and prepared for transfer to the Rows app.
7. **Injecting Data into Rows App** - Once the data is prepared, the service worker opens a new tab and navigates to the Rows app's URL, https://rows.com/new. The `background.js` will inject the prepared TSV data into the `LocalStorage` of the Rows app. This allows the Rows app to access and utilize the extracted data directly, enabling the user to further manipulate and analyze the data within the Rows app environment.
The data will be stored under the key `rows_x` and will follow the following structure:
```json
{ "source": "%ROWS_X%", "data": "header_1\theader_2\theader_3\ncell_1\t..." }
```
8. The app renders and will look for the value of `rows_x` at `LocalStorage`, if there is any data it will load the info to the clipboard
9. After that the app will trigger a paste event that will load the TSV into a new Table.
10. The user sees the scrapped information in Table 1 of a new Page.


## Contributions
Contributions to RowsX are welcome! If you have issues or suggestions for improving the extension, please feel free to open an issue or submit a pull request on the GitHub repository.

Happy scrapping with RowsX!
