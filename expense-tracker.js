const fs = require('fs');
const filePath = 'expenses.json';

const args = process.argv.slice(2);
const command = args[0];

if (command === "add") {
    const descriptionIndex = args.indexOf("--description");
    const amountIndex = args.indexOf("--amount");

    if (descriptionIndex !== -1 && amountIndex !== -1) {
        const description = args[descriptionIndex + 1];
        const amount = parseFloat(args[amountIndex + 1]);
        if (isNaN(amount)) {
            console.log("Please provide a valid amount.");
            process.exit(1);
        }
        addExpense(description, amount);
    } else {
        console.log("Missing --description or --amount flag.");
    }
} 
else if (command === "list") {
    listExpenses();
} 
else if (command === "delete") {
    const idIndex = args.indexOf("--id");
    if (idIndex !== -1) {
        const id = parseInt(args[idIndex + 1]);
        if (isNaN(id)) {
            console.log("Please provide a valid expense ID.");
            process.exit(1);
        }
        deleteExpense(id);
    } else {
        console.log("Missing --id");
    }
} 
else if (command === "summary") {
    const monthFlagIndex = args.indexOf("--month");
    if (monthFlagIndex !== -1) {
        const month = parseInt(args[monthFlagIndex + 1]);
        if (!isNaN(month) && month >= 1 && month <= 12) {
            showMonthlySummary(month);
        } else {
            console.log("Please provide a valid month (1–12).");
        }
    } else {
        showTotalSummary();
    }
} 
else {
    console.log("Unknown command. Available commands: add, list, delete, summary");
}

function addExpense(description, amount) {
    if (!fs.existsSync(filePath)) {
        fs.writeFileSync(filePath, '[]');
    }

    const data = fs.readFileSync(filePath, 'utf-8');
    let expenses = JSON.parse(data);
    const nextId = expenses.length > 0 ? Math.max(...expenses.map(e => e.id)) + 1 : 1;
    const now = new Date().toISOString();

    const newExpense = {
        id: nextId,
        description: description,
        amount: amount,
        createdAt: now
    };

    expenses.push(newExpense);
    fs.writeFileSync(filePath, JSON.stringify(expenses, null, 2));

    console.log(`Expense added successfully (ID: ${nextId})`);
}

function listExpenses() {
    if (!fs.existsSync(filePath)) {
        console.log("No expenses found.");
        return;
    }
    const data = fs.readFileSync(filePath, 'utf-8');
    const expenses = JSON.parse(data);

    if (expenses.length === 0) {
        console.log("No expenses to show.");
        return;
    }

    console.log("ID\tDate\t\tDescription\tAmount");
    expenses.forEach(expense => {
        const date = new Date(expense.createdAt).toISOString().split('T')[0];
        console.log(`${expense.id}\t${date}\t${expense.description}\t$${expense.amount}`);
    });
}

function deleteExpense(id) {
    if (!fs.existsSync(filePath)) {
        console.log("No expenses found.");
        return;
    }

    const data = fs.readFileSync(filePath, 'utf-8');
    let expenses = JSON.parse(data);

    const index = expenses.findIndex(expense => expense.id === id);
    if (index === -1) {
        console.log(`Expense with ID ${id} not found.`);
        return;
    }

    expenses.splice(index, 1);
    fs.writeFileSync(filePath, JSON.stringify(expenses, null, 2));
    console.log(`Expense ID ${id} deleted successfully.`);
}

function showTotalSummary() {
    if (!fs.existsSync(filePath)) {
        console.log("No expenses found.");
        return;
    }

    const data = fs.readFileSync(filePath, 'utf-8');
    const expenses = JSON.parse(data);

    const total = expenses.reduce((sum, expense) => sum + expense.amount, 0);
    console.log(`Total expenses: $${total}`);
}

function showMonthlySummary(month) {
    if (!fs.existsSync(filePath)) {
        console.log("No expenses found.");
        return;
    }

    const data = fs.readFileSync(filePath, 'utf-8');
    const expenses = JSON.parse(data);

    const currentYear = new Date().getFullYear();
    const filtered = expenses.filter(expense => {
        const date = new Date(expense.createdAt);
        return date.getMonth() + 1 === month && date.getFullYear() === currentYear;
    });

    const total = filtered.reduce((sum, expense) => sum + expense.amount, 0);
    const monthName = new Date(2000, month - 1).toLocaleString('default', { month: 'long' });

    console.log(`Total expenses for ${monthName}: $${total}`);
}
