// For more information, see https://crawlee.dev/
import { PlaywrightCrawler } from "crawlee";

// PlaywrightCrawler crawls the web using a headless
// browser controlled by the Playwright library.
const crawler = new PlaywrightCrawler({
  // Use the requestHandler to process each of the crawled pages.
  async requestHandler({ request, page, enqueueLinks, log, pushData }) {
    const title = await page.title();
    let posts = [];

    const potentialPosts = await page.locator(".forum-post__content").all();

    console.log("Length", potentialPosts.length);

    if (potentialPosts.length > 0) {
      potentialPosts.forEach(async (post) => {
        let postText = await post.innerText();
        console.log("Post", postText);

        // Save results as JSON to ./storage/datasets/default
        await pushData({ title, url: request.loadedUrl, text: postText });
      });
    }

    log.info(`Title of ${request.loadedUrl} is '${title}'`);

    // Extract links from the current page
    // and add them to the crawling queue.
    await enqueueLinks();
  },
  // Comment this option to scrape the full website.
  //   maxRequestsPerCrawl: 1,
  // Uncomment this option to see the browser window.
  // headless: false,
});

// Add first URL to the queue and start the crawl.
await crawler.run(["https://med.over.net/forum/"]);
