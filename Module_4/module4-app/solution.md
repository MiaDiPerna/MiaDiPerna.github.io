# The solution

> Based on the interviews from 2026-11-10. The survey answers came in on Nov 12 (2 responses, see `evidence.md`). They didn't change this plan, because neither respondent has done the job, so their answers were guesses. Revisit the plan if someone who works in team ticketing or operations answers.

## In one sentence
[WHAT THE APP DOES.]
**SeatSync** is a phone app for the operations manager of a professional sports team. The manager types in ticket sales from every website the team sells on, and SeatSync shows one total, warns when a game is close to selling out, and checks that each website pays what it owes.

## What someone does with it
[STEP BY STEP, FROM OPENING IT ON THEIR PHONE TO FINISHING THE TASK.]

**First time only:**
1. Open SeatSync.
2. Type in the name of each website the team sells tickets on.
3. The manager invites staff by email. SeatSync opens the manager's email app with an invite and a link to SeatSync already written.

**Checking sales:**
1. Open SeatSync. Home shows each game with tickets sold and seats left across all websites.
2. Tap "Add game" to add a game: its name, date, and total seats.
3. Tap a game, type in how many tickets each website sold, and tap Save.
4. When a game reaches 10% of seats left, SeatSync shows a warning on Home and on the Game screen. The manager then takes the remaining seats off each website by hand.

**Checking payouts:**
1. Open Payouts.
2. For each website, type in what it sold and what it paid.
3. Each website shows "Matches" or "Flagged."
4. Tap a flagged website to see what it sold, what it paid, and the difference.

## The screens
[EACH SCREEN: WHAT IT SHOWS, WHAT YOU CAN TAP, WHAT HAPPENS WHEN YOU TAP IT.]

**1. Your websites** (first time, or from "Edit websites" on Home)
- **Shows:** the list of websites the team sells tickets on.
- **Type a name and tap Add:** adds a website.
- **Tap Remove:** removes a website and its numbers.

**2. Home**
- **Shows:** each game, with tickets sold and seats left across all websites.
- **Shows:** a warning for any game with 10% of seats or fewer left.
- **Tap Add game:** type the game's name, date, and total seats.
- **Tap a game:** opens the Game screen.
- **Tap Payouts:** opens the Payouts screen.
- **Tap Invite staff:** opens the Invite staff screen.

**3. Game**
- **Shows:** total sold and seats left, then a box for how many tickets each website sold.
- **Type the numbers and tap Save:** updates the total.
- **Tap Delete this game:** removes the game.
- **Tap back:** returns to Home.

**4. Payouts**
- **Shows:** each website's sales, its payout, and "Matches" or "Flagged."
- **Tap a website that isn't entered yet, or Edit amounts:** type what it sold and what it paid.
- **Tap a flagged website:** shows what it sold, what it paid, and the difference.

**5. Invite staff**
- **Shows:** the staff who have been invited.
- **Tap "Invite":** type a staff member's email, and SeatSync opens the email app with the invite written.

There are only these five screens. Everything is saved on the phone or computer it was typed into.

## What it does not do
[THE FEATURES YOU ARE LEAVING OUT ON PURPOSE.]
SeatSync does only the things in the one-sentence description. It does not:
- log in to or connect to ticket websites (the manager types the numbers in)
- take sold seats off other websites (the manager does this by hand)
- send phone notifications or emails by itself
- give staff their own login, or share numbers between phones
- sell tickets
- set or change ticket prices
- count box office or walk-up sales (online websites only)
- scan tickets at the gate
- contact fans or do marketing
- make charts, reports, or predictions
- show any warning other than the 10% seats-left warning
- support more than one team
- replace the team's ticketing system

Anything not listed in "The screens" is not part of SeatSync.

## Where the information comes from
[WHAT THE PERSON TYPES IN, AND WHAT THE APP ALREADY KNOWS.]

**What the manager types in:** the name of each ticket website, each game's name, date, and total seats, how many tickets each website sold per game, what each website sold and paid, and the email of each staff member to invite.

**What the app works out:** the combined total, seats left, when a game hits 10% of seats left, and which payouts don't match their sales.

---

## Notes kept from earlier drafts (not part of the template)
- **Pricing:** yearly subscription per team. TODO: Price per year.
- **Why not an all-in-one system like Fever:** no switching websites, cheaper, and a simple phone app built for the manager.
- **Risk:** connecting to ticket websites automatically (instead of typing numbers in) would need those websites to let outside apps read sales data. Automatic seat removal would also need permission to change listings. Because of this, the working version (Nov 17) has the manager type the numbers in.
- **Risk:** pro teams often have big ticketing contracts already. Ticketmaster currently has exclusive access to NFL season-ticket resale (see `evidence.md`), which could limit which websites SeatSync can connect to.
