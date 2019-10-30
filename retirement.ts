interface Cost {
    age: number;
    amount: number;
}



interface Finance {
    money: number;
    expenses: number;
    salary: number;
}

interface Rate {
    inflation: number;
    return: number;
    tax: number;
    capitalGainsTax: number;
}

interface Age {
    current: number;
    retirement: number;
    death: number;
}

// TODO: When applying captial gains tax to the money, separate money into principal and interest
function computeNextYearMoney(finance: Finance, rate: Rate): Finance {
    // Make copy of incoming finance object
    const nextYrFinance = { ...finance }

    // Make intermediate computations
    let interest: number = finance.money * rate.return
    let expensesAfterInflation = finance.expenses * (1 + rate.inflation)
    let salaryAfterTax = finance.salary * (1 - rate.tax)

    // Update new finance object
    nextYrFinance.expenses = expensesAfterInflation
    nextYrFinance.money = finance.money + interest - expensesAfterInflation + salaryAfterTax

    return nextYrFinance
}

function computeProjectedYears(finance: Finance, rate: Rate, years: number): Finance[] {
    let finances: Finance[] = [computeNextYearMoney(finance, rate)]
    for (let year = 1; year < years; year++) {
        let currFinance = finances[year - 1]
        let nextFinance = computeNextYearMoney(currFinance, rate)
        finances.push(nextFinance)
    }
    return finances
}

function projectRetirement(finance: Finance, rate: Rate, age: Age): Finance[] {
    let finances: Finance[]

    let financesBeforeRetirement = computeProjectedYears(finance, rate, age.retirement - age.current)
    finances = financesBeforeRetirement

    let retirementFinance = { ...finances[finances.length - 1] }
    retirementFinance.salary = 0

    let financesAfterRetirement = computeProjectedYears(retirementFinance, rate, age.death - age.retirement)
    finances = [...finances, ...financesAfterRetirement]

    return finances
}

function projectFutures(finance: Finance, rate: Rate, age: Age): Finance[][] {
    let futures: Finance[][] = []

    // Assume you can retire next year at the earliest
    // Assume you must retire when you are 80

    let latestRetirement = Math.min(80, age.death)
    for (let retirement = age.current + 1; retirement <= latestRetirement; retirement++) {
        age.retirement = retirement
        futures.push(projectRetirement(finance, rate, age))
    }

    return futures
}

function main() {
    const finance: Finance = {
        money: 63000,
        salary: 108000 + 157000,
        expenses: 18000
    }
    let currExpenses = 18000
    let futureExpenses = 3 * currExpenses

    let rate: Rate = {
        inflation: .02,
        return: .04,
        tax: .35,
        capitalGainsTax: .15
    }

    let startAge = 23
    let endAge = 100

    let money = []
    let rawExpenses = []
    let expenseRate = []
}

main()