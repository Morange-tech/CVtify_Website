export function calculateSavings(monthlyPrice = 0, yearlyPrice = 0) {
    const monthly = Number(monthlyPrice || 0);
    const yearly = Number(yearlyPrice || 0);

    if (!monthly || !yearly) return 0;

    const yearlyNormal = monthly * 12;
    return Math.round(((yearlyNormal - yearly) / yearlyNormal) * 100);
}

export function getPerMonth(monthlyPrice = 0, yearlyPrice = 0, billingCycle = 'monthly') {
    const monthly = Number(monthlyPrice || 0);
    const yearly = Number(yearlyPrice || 0);

    if (billingCycle === 'yearly') {
        return (yearly / 12).toFixed(2);
    }

    return monthly.toFixed(2);
}

export function getCurrentPrice(monthlyPrice = 0, yearlyPrice = 0, billingCycle = 'monthly') {
    return billingCycle === 'yearly'
        ? Number(yearlyPrice || 0)
        : Number(monthlyPrice || 0);
}