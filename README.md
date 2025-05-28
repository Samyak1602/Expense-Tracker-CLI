# Expense Tracker CLI

A simple command-line tool to track your expenses. Expenses are stored in a local `expenses.json` file.

## Features
- Add new expenses with description and amount
- List all expenses
- Delete an expense by ID
- Show total expenses
- Show monthly summary for a given month

## Usage

### Add an Expense
```
node expense-tracker.js add --description "Coffee" --amount 3.5
```

### List Expenses
```
node expense-tracker.js list
```

### Delete an Expense
```
node expense-tracker.js delete --id 2
```

### Show Total Summary
```
node expense-tracker.js summary
```

### Show Monthly Summary
```
node expense-tracker.js summary --month 5
```

## Data File
All expenses are stored in `expenses.json` in the same directory.

## Example
```
$ node expense-tracker.js add --description "Lunch" --amount 12.5
Expense added successfully (ID: 1)

$ node expense-tracker.js list
ID	Date		Description	Amount
1	2025-05-28	Lunch	$12.5

$ node expense-tracker.js summary
Total expenses: $12.5
```
https://roadmap.sh/projects/expense-tracker

