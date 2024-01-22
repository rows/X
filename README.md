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
2. **The RowsX UI is displayed and Event Trigger** - Initially, the RowsX UI displays an empty state component, indicating that no data has been extracted. This signifies the extension is ready to start extracting data from the current web page. And after rendering everything it will trigger the `rows_x:start` event.
3. **Background Script Activation** - Upon displaying the empty state component, the RowsX UI emits an event named `rows_x:start`. This event will be listened to by the service worker who is running in the `background.js` script, which is responsible for handling background tasks and communication with the extension's popup window.
4. **Data Extraction Process** - The background.js script receives the `rows_x:start` event and starts the data extraction process. It first attempts to identify a suitable scraper based on the URL of the current web page. If a matching scraper is found, it utilizes that scraper to extract the relevant data from the page. If no matching scraper is found, the script falls back to extracting data directly from HTML tables on the page.

## Contributions
Contributions to RowsX are welcome! If you have issues or suggestions for improving the extension, please feel free to open an issue or submit a pull request on the GitHub repository.

Happy scrapping with RowsX!
