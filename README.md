# The Price of Nothing

A 1–2 minute, self-guided workshop experiment about how product presentation affects perceived value. It runs on one laptop and shares results with phones on the same Wi-Fi network. No account, cloud service, or runtime internet connection is needed.

## Run it on local Wi-Fi

1. Use Node.js 24 or newer. Install once with `npm ci` while online.
2. Start the app with `npm run dev`. Nuxt listens on `0.0.0.0:3000`.
3. Find the laptop's Wi-Fi address. On macOS, run `ipconfig getifaddr en0`; on Linux, run `hostname -I`. Use the address for the active Wi-Fi adapter.
4. Open `http://LOCAL_IP:3000` on a phone connected to the same Wi-Fi. If the page does not load, allow inbound connections to port 3000 in the laptop firewall and check that the Wi-Fi does not isolate devices.
5. Complete an experiment on one device, then complete another on a second device. Both results dashboards should show two completed experiments, and update within 10 seconds.

For a production build, run `npm run build` and `npm run preview`. The preview also listens on `0.0.0.0:3000`. Run commands from the repository root so the database remains at `data/experiment.sqlite`. That file and its SQLite journals are excluded from Git and survive server restarts. Set `EXPERIMENT_DB_PATH` to use another location.

## Checks

Run `npm run typecheck`, `npm run build`, then `npm run test:flow`. The flow test uses a temporary database and verifies stage access, retries, shared results, and persistence after a restart. It does not add sample responses to the workshop database.

## How it works

The server gives each browser a random participant cookie and saves randomized presentation order and progress in SQLite. The six estimates are saved one at a time. After the sixth estimate, the reveal becomes available. Submitting one reason and an optional note unlocks results. The reveal and results APIs check that progress on the server. A new browser must complete the experiment itself; **New Experiment** starts a new record without deleting earlier results.

The dashboard counts started sessions as participants and uses completed experiments for all averages and reasons. A percentage difference is omitted when an ordinary average is zero. Written explanations appear without names, are displayed as plain text, and are limited to the 50 most recent responses from other participants. There are no pilot or fabricated responses in the app.

## Photography

The two presentations in each category point to the **same local file**. These are real photographs downloaded for offline use:

| File | Source | License |
| --- | --- | --- |
| `public/products/shirt.jpg` | [White T-shirt photo by MART PRODUCTION](https://www.pexels.com/photo/woman-in-white-crew-neck-t-shirt-9558752/) | [Pexels License](https://www.pexels.com/license/) |
| `public/products/mug.jpg` | [White mug photo by eric anada](https://www.pexels.com/photo/white-ceramic-cup-1001990/) | [Pexels License](https://www.pexels.com/license/) |
| `public/products/tote.jpg` | [Canvas tote photo by Alican Helik](https://www.pexels.com/photo/young-woman-in-a-casual-outfit-standing-outside-on-the-background-of-a-white-sheet-17849287/) | [Pexels License](https://www.pexels.com/license/) |

The product names and marketing copy in the app are fictional and do not imply endorsement by the photographers or anyone pictured.
