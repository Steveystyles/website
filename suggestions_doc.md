# Free API and Embedded Content Suggestions for a Sports & Scotland‑Themed Website

## Introduction

This document summarises a set of free APIs and embeddable resources that you can use to populate a website for a sports‑loving parent who enjoys Scottish history, geography and word puzzles.  The suggested APIs require no subscription and are suitable for hobby projects.

## Sports Data

| Resource | What it offers | Evidence of free access |
| --- | --- | --- |
| **TheSportsDB API** | REST API for sports results and fixtures (soccer, NFL, NBA, etc.).  For football it returns team details, upcoming fixtures, past results and YouTube highlights via endpoints such as `eventsnext.php` (next events), `eventslast.php` (last events) and `eventsday.php`【80115789271395†L500-L609】. | The documentation explains that the base URL can be used with a free API key (e.g., `123`) and outlines which features are free versus premium【80115789271395†L120-L134】. |
| **Football‑Data.org** | Provides fixture lists, match results, team data, standings and top scorers for competitions including the Scottish Premier League and Scottish Cup.  Endpoints include `/competitions`, `/matches`, `/standings` and `/scorers`【553602416376456†L83-L231】. | The API is free to use with rate limits and offers these resources without subscription【553602416376456†L83-L231】. |
| **SportMonks European Plan (free tier)** | Offers comprehensive data for the Scottish Premiership: live scores, fixtures and season schedules, standings, advanced and standard player statistics, odds and top scorers【35711729072246†L1094-L1119】. | The plan description notes that unlimited testing is allowed for the Scottish Premiership on the free trial【35711729072246†L1094-L1119】. |
| **Open‑source football datasets** | Community‑maintained CSV datasets (e.g., from football‑data.co.uk) for historical results that you can download and visualise without an API key. | These datasets are publicly available and can be downloaded at no cost. |

### How to use

- Fetch upcoming fixtures or live scores for St Mirren and other Scottish teams with TheSportsDB or Football‑Data.org and display them on your site.
- Show league standings and top scorers using the SportMonks free tier, updating your page automatically when new data arrives.

## Scottish History and Heritage

| Resource | What it offers | Evidence of free access |
| --- | --- | --- |
| **Statistics.gov.scot** | A data portal with over 250 collections of official statistics (demographics, economics, health, etc.) covering Scotland.  The data is machine‑readable via a linked‑data API and suitable for apps and dashboards【32588211700145†L41-L100】. | The Scottish Government notes that the platform makes all datasets consistent and machine‑readable, and the API is available under the Open Government Licence for free【32588211700145†L94-L100】. |
| **Historic Environment Scotland Web Feature Service (WFS)** | Spatial datasets for listed buildings, scheduled monuments, battlefields and other heritage sites.  Each dataset can be downloaded and is also exposed as a web service for querying and mapping【268787063745394†L10-L46】. | The downloads page states that the datasets are available via an Atom feed or Web Feature Service【268787063745394†L10-L46】, making them accessible without payment. |
| **National Library of Scotland Historic Maps API** | A free API providing a georeferenced historic map layer (1920s–1940s Ordnance Survey) covering Scotland, England and Wales【560867926052112†L47-L52】.  Useful for embedding old map layers in modern maps. | The Library explains that this API offers a free way to reuse the map layer【560867926052112†L47-L52】. |
| **ScotlandsPlaces & Historic Environment Records APIs (Apitalks)** | Upcoming APIs aggregating archaeological and heritage data, intended to be free since development is funded by Apitalks【664910175121066†L73-L77】【357560741864358†L97-L100】. | The API listings state that usage will be free【664910175121066†L73-L77】【357560741864358†L97-L100】. |

### How to use

- Create interactive maps showing listed buildings and scheduled monuments using the WFS data and overlay them on the historic maps from the National Library of Scotland.
- Use statistics.gov.scot to embed demographic or economic charts about your local area, giving context to the sports content.

## Geography and Distances

| Resource | What it offers | Evidence of free access |
| --- | --- | --- |
| **OpenRouteService** | An open‑source API offering routing, geocoding, isochrone (reachability) and distance‑matrix services using OpenStreetMap data.  You can request up to 500 isochrones per day for free and use directions, POI and elevation services【39123916697697†L60-L71】. | The service states that it offers “a variety of different geo‑services with a single API all of them free to use and open source”【39123916697697†L60-L71】. |
| **National Library of Scotland Boundaries Viewer** | An interactive tool to explore historical counties, parishes and modern administrative boundaries【560867926052112†L93-L103】.  Can be embedded or linked to provide geographic context. | The viewer is publicly available and designed for free use【560867926052112†L93-L103】. |

### How to use

- Implement a distance‑calculator widget that lets users enter two Scottish towns and shows the driving or walking distance using OpenRouteService.
- Embed the NLS Boundaries Viewer so visitors can explore historical counties or parishes related to their favourite football teams or birthplaces.

## Word Puzzles, Dictionaries and Trivia

| Resource | What it offers | Evidence of free access |
| --- | --- | --- |
| **Shadify Puzzle API** | Open‑source API for generating puzzles including crosswords, Sudoku and word searches.  It can create puzzle grids and check solutions【515309585809297†L309-L312】. | The GitHub documentation describes it as an HTTP API for building puzzles and provides the code for self‑hosting【515309585809297†L309-L312】. |
| **Free Dictionary API (dictionaryapi.dev)** | Fetch definitions, pronunciations, synonyms and origins of English words.  Useful for a “word of the day” or hints in puzzles. | The API asserts that it “is—and always will be—free”【658384507557375†L71-L76】. |
| **Datamuse API** | A word‑finding engine for developers; generates rhymes, synonyms, words matching patterns and more.  Does not require an API token【708136924061081†L50-L56】. | The documentation notes that the service is strictly read‑only and an API token is not required【708136924061081†L50-L56】. |
| **Wordnik API (free plan)** | Provides definitions, example sentences, synonyms, antonyms and random words; useful for word puzzles or trivia.  The free plan allows 100 calls per hour【905276281142574†L15-L21】. | The pricing page lists a free basic plan with 100 calls/hour and no fee【905276281142574†L15-L21】. |
| **Numbers API** | Returns trivia or historical facts about numbers, dates or years—for example, random number facts like “42 is the answer to the Ultimate Question of Life, the Universe, and Everything”【689105275587513†L89-L96】. | The Numbers API is publicly available; requests can be made directly via its endpoints without an API key【689105275587513†L89-L96】. |

### How to use

- Embed crossword or Sudoku puzzles by running the Shadify API on your server and serving the generated grids on your site.
- Display a “word of the day” or “random number fact” using the Free Dictionary API or Numbers API.
- Use Datamuse or Wordnik to generate synonyms and rhyming hints for custom word games or quizzes.

## Putting it All Together

By combining these free resources you can create a rich, interactive website for your father.  For example:

- Show live scores and upcoming matches for St Mirren and other Scottish clubs using TheSportsDB and SportMonks APIs.  Add league tables and top‑scorer charts from Football‑Data.org.
- Use OpenRouteService to build a widget where users enter two places and see the distance or travel time.  Overlay the route on a historic map layer from the National Library of Scotland for added historical interest.
- Display demographic or historical facts about Scottish towns using statistics.gov.scot, and highlight heritage sites near those places using the Historic Environment Scotland WFS.
- Offer daily puzzles (crossword, Sudoku or word search) generated via Shadify, with clues or definitions fetched from the Free Dictionary API or Wordnik.  Include a “fun fact of the day” from the Numbers API to keep things fresh.

All these services are free and should not require paid subscriptions, making them ideal for a personal hobby site.
