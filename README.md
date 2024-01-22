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

## How does this work with the Rows? :thinking:
In the following image, you can see how it works and each step will have a better explanation:

![image](https://github.com/rows/X/assets/7489569/34f0fcec-332d-4226-acaf-9cb7ec46d3cf)

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
