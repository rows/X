# RowsX

RowsX is a Chrome extension that performs simple web scraping tasks for business users. It was built to help users load data from websites with HTML tables into spreadsheets, and is developed by [Rows.com](https://rows.com).

[Demo video](https://www.youtube.com/watch?v=RjOLjgCvayM) · [Install extension from the Chrome Web Store](https://chromewebstore.google.com/detail/rowsx/abkccndhocmfdombbpmnhfjidcdcjjeo) · [X](https://twitter.com/RowsHQ) · [LinkedIn](https://www.linkedin.com/company/rowshq) · [Discord](https://discord.gg/MqnBDJdf)


![RowsX](https://github.com/rows/X/assets/31993620/c80634eb-27d5-443f-b5de-bb8c2c21e1b3)


## About Rows

[Rows](https://rows.com) is a modern spreadsheet. It is the easiest way to import, transform and share data in a spreadsheet.

## Why Open-source RowsX?

We're opening RowsX to the community and invite everyone to contribute with new features, support to new websites or new ideas to improve it. 

RowsX was born during a team hackathon in January of 2024. We built it to solve a problem we see our customers struggle with everyday: getting data from the web to a spreadsheet. The Rows platform lets you import data from files, via Integrations with APIs and SaaS services, and connectors on 3rd party platforms that call our Rows API. RowsX extends the importing options to the Browser! Since launching it, more than two thousand people have used it to import lists of data from countless sites, internal tools and back office systems.


## Open Bounties Program

Join our Open Bounties Program and get rewarded for enhancing the extension! 

Current Open Bounties:

- [ ] Port extension to Safari: $250
- [ ] Support parsing tables in PDFs: $150. [Example](https://www.oecd.org/pisa/OECD_2022_PISA_Results_Comparing%20countries%E2%80%99%20and%20economies%E2%80%99%20performance%20in%20mathematics.pdf).

To ensure quality and alignment with our goals, features are only eligible for a bounty once they are approved by our team and made publicly available. If you have submitted code to solve one of the bounties, let us know at security@rows.com.

Note: RowsX is a tool for business people to use that translates what they see into a spreadsheet. Atm we don't aim to build a fully automated scraper platform that operates beyond the actions of the user and what the user can see.

## Get Started

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

### .env File

The environment configuration file plays a crucial role in managing the application's integration with the Rows API (this is needed to store the information of user feedback, if you're not doing anywork related with that we could leave it empty in our local computer). The env file contains three specific variables essential for ensuring that the application can securely and accurately interact with the Rows API. Here’s a brief explanation of each variable:

- `VITE_ROWS_API_KEY`: This variable stores the Rows API key, which is necessary for authenticating requests made from our application to the Rows service. It ensures that our application has the permission to access and modify the spreadsheet data.
- `VITE_SPREADSHEET_ID`: This variable holds the ID of the spreadsheet we want to access. It specifies the target spreadsheet within the Rows platform where all the data from our application is stored or retrieved from.
- `VITE_TABLE_ID`: This variable contains the ID of the specific table within the spreadsheet mentioned above. It identifies the exact location within the spreadsheet where data entries should be made or updated.
- `VITE_TABLE_ID_USAGE`: This variable contains the ID of the specific table within the spreadsheet mentioned above. It identifies the exact location within the spreadsheet where data entries should be made or updated. The table is then used to store this extension usage.

By storing these keys in the environment configuration file and automating its creation during the release process via GitHub Actions, we ensure that the setup is secure, efficient, and less prone to errors, enabling seamless integration and data management.

## How to add a new scraper?

There are 2 different ways of building a custom scraper:

1. **The data is loaded from a list**

```js
{
    header: 'ProductHunt results',
    listElementsQuery: '<CSS selector to find all elements for a list>',
    elementParser: [
        //...
        { title: 'Product image', query: '<CSS selector that will find an image on each element>', type: 'image' },
        { title: 'Product name', query: '<CSS selector that will find the desired text>', type: 'text' },
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
        { rows: '<CSS selector to find all rows>', cols: '<CSS selector to find all cols>' },
        { rows: '<CSS selector to find all rows>', cols: '<CSS selector to find all cols>' },
    ],
    mergeTablesBy: 'row' // <- it will merge the tables by row or by column this is optional
}
```

> [!TIP]
> The `mergeTablesBy` property defines the strategy for combining multiple tables into a single dataset. This parameter is optional and could be set as `row`, which means that tables will be merged by rows, resulting in a single table with all rows combined. If set to `column`, tables will be merged by columns, resulting in a single table with all columns combined.

### When use `.example` and `[class*="example"]`

`.example` and `[class*="example"]` are both CSS selectors that can be used to select elements in an HTML document. However, they have different purposes and should be used in different situations.

- The selector `.example` selects all elements that have the class example. This is a simple way to select elements with a specific class.
- The selector `[class*="example"]` selects all elements that have the word example as a part of their class name. This selector is more versatile than `.example`, because it allows you to select elements that have a class name that starts with `example`, ends with `example`, or has `example` anywhere in the middle.

> [!TIP]
> The last selector (`[class*="example"]`) is more versatile but could lead to undesirable results, so use it with caution!

#### Example of different selectors' usage

<img width="724" alt="image" src="https://github.com/rows/X/assets/7489569/674d5939-9991-471b-99b5-240b24e0a8f7">

For example, if I want to extract the element title from an item at idealista.pt we could use the following configuration:

```js
{ title: 'Description', query: '.item-link', type: 'get-attribute', attribute: 'title' }
```

<img width="726" alt="image" src="https://github.com/rows/X/assets/7489569/59cc34ab-bbaa-46e4-aef3-b19d8b7fd4e6">

If I want to identify the list of elements that I want to extract information I can use

```js
{
  listElementsQuery: '[data-test*="post-item-"]';
}
```

## How does this work with the Rows? :thinking:

In the following image, you can see how it works and each step will have a better explanation:

![image](https://github.com/rows/X/assets/7489569/1425f71f-153c-4e8a-9bb2-cff78ef80a97)

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
10. The user sees the scraped information in Table 1 of a new Page.


## Contributions

Contributions to RowsX are welcome! If you have issues or suggestions for improving the extension, please feel free to open an issue or submit a pull request on the GitHub repository.

Happy scraping with RowsX!
