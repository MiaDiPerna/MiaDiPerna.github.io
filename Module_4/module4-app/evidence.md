# Evidence

Research for the problem in `problem.md`: a sports team selling tickets on several online platforms can't get one clear, current count of sales.

**About the sources:** most sources describing this problem are companies that sell ticketing software, so they have a reason to make the problem sound big. Each finding is labeled with its source type. Every claim below was checked against its source page on 2026-11-10.

## Data

### 1. Ticket sellers list on several platforms
- The NFL says that "rather than requiring season-ticket holders to list separately across different platforms to reach competing audiences," "eligible tickets can be listed once and distributed through multiple participating marketplaces." Ticketmaster currently has exclusive access to that resale inventory, and under the change "other authorized secondary marketplaces will gain access to season-ticket resale inventory from all 32 NFL teams." SeatGeek has reportedly agreed in principle to take part. *News article.* [1]

### 2. Reports from different systems disagree
- Box-office reports can conflict: "different reports can easily contain different data," and "time must be spent reconciling figures and working out which data is accurate." *Promoted content written by a ticketing software CEO.* [2]

### 3. Cost A: overselling
- Listing on several platforms splits your inventory, and "each one needs to be updated whenever a sale is made." Otherwise, "overselling becomes a real risk." *Vendor blog.* [3]
- Overselling "becomes a gate-day crisis and a refund program." *Vendor blog.* [4]
- A double booking can bring "refunds, card disputes, and a bad review." *Venue software blog, not about sports.* [5]

### 4. Cost B: empty seats
- Ticket Compare estimated the Kansas City Chiefs lost **$2,164,542 per home game** from "over 21,000 unfilled seats on average," at an average ticket price of "just a shade over $100." It analyzed "22 NFL teams that were unable to fill their stadiums," and "ten teams reported zero empty seats." *Analysis by a ticket comparison company, method not published.* [6]

### 5. Cost D: missed or mismatched payouts
- Payouts are based on net sales, which subtract ticketing fees and taxes from total revenue, and "refunds and chargebacks can also affect the total amount sent." Eventbrite "holds 20% of your net sales in reserve," paid out with the final payout. *Platform help docs.* [7]
- "A statement can show strong gross sales and a much smaller net payout," because of fees, refunds, chargebacks, and reserves. *Vendor blog.* [8]
- Payment "errors come from manual data entry, duplicate transactions, mismatched records across separate tools." *Vendor blog.* [9]

## Could not verify (removed from Data)
These sources blocked access, so their claims were removed. Open them in a browser and add a claim back only if the page says it.
- Orion Innovation league case study (claimed: ticket data spread across systems limited visibility, and finance couldn't reconcile payments): https://www.orioninnovation.com/insights/case-studies/bringing-control-and-visibility-to-league-wide-ticket-operations/
- TouchNet college athletics blog (claimed: separate systems for ticketing, point-of-sale, and access force manual reconciliation): https://www.touchnet.com/trends/blog/2025/05/27/rethinking-commerce-and-access-in-college-athletics
- ScienceDirect study (claimed: NFL teams could sell about 20,000 more seats per game): https://www.sciencedirect.com/science/article/abs/pii/S1441352312000435
- ResearchGate MLB resale study (claimed: resellers cut prices sharply on game day): https://www.researchgate.net/publication/368935878_Does_time_matter_How_major_league_baseball_secondary_market_sellers_make_ticket_pricing_decisions

## Gaps (no good evidence found)
- TODO: **How common the problem is.** The survey [11] had only 2 responses, and neither respondent has done the job. Still need answers from people who work in team ticketing or operations.
- TODO: **Systems that don't connect at sports teams.** The only sports-specific sources on this couldn't be verified (see above).
- TODO: **Dollar cost of overselling.** No figure. Sources describe the results (refunds, card disputes) but don't price them.
- TODO: **Dollar cost of missed payouts.** No figure. Sources explain how money goes missing, not how much.
- TODO: **Time spent reconciling by hand.** No reliable number found.
- TODO: **Empty seats caused by bad counts.** The Chiefs figure counts all empty seats. Nothing links empty seats to unclear sales counts specifically.
- TODO: **Smaller teams.** The sports evidence is about the NFL. Nothing found on college, minor-league, or club teams.

## User research

### Survey results
A 5-question Google Forms survey (questions in `survey.md`) got **2 responses**. **Neither respondent has done this job.** They don't work in team ticket sales or operations, so their answers are guesses, not reports of what actually happened. With only 2 people, the results also can't show how common anything is. Treat them as weak evidence. They don't confirm or rule out any part of the problem. *Survey responses.* [11]

| Question | Answers (out of 2) |
|---|---|
| 1. Do you sell on more than one website, and is it hard to know your total sales? | Yes: 1 · Sometimes: 1 · No: 0 |
| 2. How often do you have a problem knowing your sales? | Every game: 0 · A few times a season: 1 · Rarely or never: 1 |
| 3. What does it cost you when it happens? (check all that apply) | Sold more tickets than seats: 1 · Empty seats we didn't expect: 1 · A website paid less than expected: 0 · Takes a lot of staff time: 0 · None of these: 0 |
| 4. How do you add up your total sales today? | A spreadsheet: 2 · Check each website one by one: 0 · Other: 0 |
| 5. Anything else you'd like to share? (optional) | 1 answer: "No" |

**What the respondents guessed:**
- Both guessed that knowing the total sales is at least sometimes hard (Q1).
- Neither guessed it happens every game. One guessed a few times a season, and one guessed rarely or never (Q2).
- One picked overselling, and one picked unexpected empty seats (Q3). The summary doesn't show whether those came from the same person or from different people.
- No one picked being underpaid by a website or losing a lot of staff time (Q3).
- Both picked a spreadsheet as the way to add up sales (Q4).
- No quotes or dollar figures were given.

TODO: Survey or interview 2 or 3 people who actually work in ticket sales or operations for a team. Their answers would replace these guesses.

## Existing alternatives
- **Spreadsheets:** what the manager in `problem.md` uses today, by pulling data from each platform and combining it by hand.
- **Shared-inventory ticketing platforms:** Fever says "multi-channel selling allows different ticketing providers to operate from a single shared inventory." *Vendor claim.* [10]
- **League-wide resale systems:** the NFL's model lets a ticket be "listed once and distributed through multiple participating marketplaces." [1]
- TODO: Where these fall short for the manager in `problem.md`, for example cost, or teams being locked into one vendor's contract.

## Sources
1. TicketNews, "Ticketmaster Keeps Top NFL Resale Role as League Expands Access for Competitors" (Oct 2026): https://www.ticketnews.com/2026/10/ticketmaster-nfl-resale-competitors-access/
2. The Stage, "When ticket sales grow, spreadsheets become a liability" (promoted content, Oct 2026): https://www.thestage.co.uk/promoted-content/when-ticket-sales-grow-spreadsheets-become-a-liability-ticketcrm
3. Evey Events, "Can You List Tickets on Multiple Sites": https://www2.eveyevents.com/blog/can-you-list-tickets-on-multiple-sites/
4. Webook, "What Breaks in a High-Demand Ticket On-Sale": https://webook.com/business/en/blog/high-demand-ticket-onsale-failures
5. Perfect Venue, "How to Avoid Double Bookings at Your Venue": https://www.perfectvenue.com/post/double-booking
6. Yahoo Sports, "Study Finds Which Surprise NFL Team Loses the Most Revenue From Empty Stadium Seats" (Sep 2, 2025): https://sports.yahoo.com/article/study-finds-surprise-nfl-team-141431775.html
7. Eventbrite Help Center, "Understanding your event payout amount": https://www.eventbrite.com/help/en-us/articles/111819/understanding-your-event-payout-amount/
8. TickPick, "When Do Ticketing Platforms Pay Organizers? Payouts Compared": https://www.tickpick.com/blog/organizer/ticketing-platform-payout-schedules
9. SquadUp, "Common payment challenges in live event operations": https://blog.squadup.com/common-payment-challenges-in-live-event-operations-and-how-to-fix-them
10. Fever, "All-in-One Sports Ticketing Software for Clubs & Stadiums": https://business.feverup.com/industries/sports-ticketing-software/
11. "Ticket Sales Counts" survey (Google Forms, responses as of Nov 12, 2026; 2 responses, neither from someone who has done the job). Questions in `survey.md`.
