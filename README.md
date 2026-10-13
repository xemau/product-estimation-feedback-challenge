# The Price of Nothing

A 1–2 minute, self-guided workshop experiment about how product presentation affects perceived value. It runs on one laptop and shares results with phones on the same Wi-Fi network. No account, cloud service, or runtime internet connection is needed.

## Run it on local Wi-Fi

1. Use Node.js 24 or newer. Install once with `npm ci` while online.
2. Start the app with `npm run dev`. Nuxt listens on `0.0.0.0:3000`.
3. Find the laptop's Wi-Fi address. On macOS, run `ipconfig getifaddr en0`; on Linux, run `hostname -I`. Use the address for the active Wi-Fi adapter.
4. Open `http://LOCAL_IP:3000` on a phone connected to the same Wi-Fi. If the page does not load, allow inbound connections to port 3000 in the laptop firewall and check that the Wi-Fi does not isolate devices.
5. Complete an experiment on one device, then complete another on a second device. Both results dashboards should show two completed experiments, and update within 10 seconds.

The organizer can open `/dashboard` on the same server and enter the password `cool`. This page shows totals, price comparisons, reasons and recent written responses without completing the experiment. It refreshes every 5 seconds. **Reset all data** opens a confirmation prompt and requires the password again; it deletes every submission and invalidates participant sessions.

For a production build, run `npm run build` and `npm run preview`. The preview also listens on `0.0.0.0:3000`. Run commands from the repository root so the database remains at `data/experiment.sqlite`. That file and its SQLite journals are excluded from Git and survive server restarts. Set `EXPERIMENT_DB_PATH` to use another location.

## Checks

Run `npm run typecheck`, `npm run build`, then `npm run test:flow`. The flow test uses a temporary database and verifies stage access, retries, shared results, and persistence after a restart. It does not add sample responses to the workshop database.

## How it works

The server gives each browser a random participant cookie and saves randomized presentation order and progress in SQLite. The six estimates are saved one at a time. After the sixth estimate, the reveal becomes available. Submitting one reason and an optional note unlocks results. The reveal and results APIs check that progress on the server. A new browser must complete the experiment itself; **New Experiment** starts a new record without deleting earlier results.

The dashboard counts started sessions as participants and uses completed experiments for all averages and reasons. A percentage difference is omitted when a listing average is zero. Written explanations appear without names, are displayed as plain text, and are limited to the 50 most recent responses from other participants. There are no pilot or fabricated responses in the app.

The gallery update uses experiment version 2. Earlier submissions remain in the same database but are excluded from the current results because they were made with different photographs and descriptions. Browsers holding an earlier session start a new experiment.

## Photography

Each pair shows the same physical product from one retail listing. The presentations use different lead photos and reorder the same local gallery. The files are served locally, so no image request needs the internet during the workshop.

| Local gallery | Product source |
| --- | --- |
| `public/products/shirt-1.jpg` through `shirt-4.jpg` | [Regular-fit white cotton T-shirt](https://www2.hm.com/nl_nl/productpage.0685816001.html) |
| `public/products/mug-1.jpg` through `mug-4.jpg` | [White 36 cl porcelain mug](https://www.ikea.com/nl/en/p/ikea-365-mug-white-80278367/) |
| `public/products/tote-1.jpg` through `tote-3.jpg` | [Beige cotton-canvas tote](https://www2.hm.com/nl_nl/productpage.1285582001.html) |

The product names and presentation copy in the app are fictional. Source retailer names, actual retail prices and visible label photos are not shown to participants.
