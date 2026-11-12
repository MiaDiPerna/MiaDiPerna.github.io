# The solution

> Based on the interviews from 2026-11-10. The survey answers came in on Nov 12 (2 responses, see `evidence.md`). They didn't change this plan, because neither respondent has done the job, so their answers were guesses. Revisit the plan if someone who works in team ticketing or operations answers.

## In one sentence
[WHAT THE APP DOES.]
**SeatSync** is a phone app for the operations manager of a professional sports team. It connects every website the team sells tickets on, shows one live total, stops overselling, and checks that each website pays what it owes.

## What someone does with it
[STEP BY STEP, FROM OPENING IT ON THEIR PHONE TO FINISHING THE TASK.]

**First time only:**
1. Open SeatSync.
2. Log in to each ticket website once to connect it.
3. The manager invites staff by email. Each staff member gets their own login and sees the same screens as the manager.

**Checking sales:**
1. Open SeatSync. Home shows each game with tickets sold and seats left across all websites.
2. Tap a game to see how many tickets each website sold.
3. Whenever a seat sells on one website, SeatSync removes it from the others.
4. When a game reaches 10% of seats left, SeatSync sends a phone notification.

**Checking payouts:**
1. Open Payouts.
2. Each website shows "Matches" or "Flagged."
3. Tap a flagged website to see what it sold, what it paid, and the difference.

## The screens
[EACH SCREEN: WHAT IT SHOWS, WHAT YOU CAN TAP, WHAT HAPPENS WHEN YOU TAP IT.]

**1. Connect websites** (first time only)
- **Shows:** the list of ticket websites.
- **Tap a website:** opens its login, which connects it to SeatSync.

**2. Home**
- **Shows:** each game, with tickets sold and seats left across all websites.
- **Tap a game:** opens the Game screen.
- **Tap Payouts:** opens the Payouts screen.
- **Tap Invite staff:** opens the Invite staff screen.

**3. Game**
- **Shows:** total sold and seats left, then how many tickets each website sold.
- **Tap back:** returns to Home.

**4. Payouts**
- **Shows:** each website's sales, its payout, and "Matches" or "Flagged."
- **Tap a flagged website:** shows what it sold, what it paid, and the difference.

**5. Invite staff**
- **Shows:** the staff who have been invited.
- **Tap "Invite":** type a staff member's email, and SeatSync sends them their own login.

There are only these five screens. Staff see the same screens as the manager.

## What it does not do
[THE FEATURES YOU ARE LEAVING OUT ON PURPOSE.]
SeatSync does only the four things in the one-sentence description. It does not:
- sell tickets
- set or change ticket prices
- count box office or walk-up sales (online websites only)
- scan tickets at the gate
- contact fans or do marketing
- make charts, reports, or predictions
- send any alert other than the 10% seats-left notification
- support more than one team
- replace the team's ticketing system

Anything not listed in "The screens" is not part of SeatSync.

## Where the information comes from
[WHAT THE PERSON TYPES IN, AND WHAT THE APP ALREADY KNOWS.]

**What the manager types in (once):** their login for each ticket website, and the email of each staff member to invite.

**What the app gets from the websites:** ticket sales, seats per game, and payouts.

**What the app works out:** the combined total, when a game hits 10% of seats left, and which payouts don't match their sales.

---

## Notes kept from earlier drafts (not part of the template)
- **Pricing:** yearly subscription per team. TODO: Price per year.
- **Why not an all-in-one system like Fever:** no switching websites, cheaper, and a simple phone app built for the manager.
- **Risk:** SeatSync only works if ticket websites let outside apps read sales data. Automatic seat removal also needs permission to change listings.
- **Risk:** pro teams often have big ticketing contracts already. Ticketmaster currently has exclusive access to NFL season-ticket resale (see `evidence.md`), which could limit which websites SeatSync can connect to.
