export function calculateAge(dateOfBirth) {
    if (!dateOfBirth) return null;

    const [year, month, day] = dateOfBirth.split("-").map(Number);
    const today = new Date();

    let age = today.getFullYear() - year;

    if (
        today.getMonth() + 1 < month ||
        (today.getMonth() + 1 === month && today.getDate() < day)
    ) {
        age--;
    }

    return age;
}

export function validateAgeAndTenure(dateOfBirth, tenureMonths) {
    const age = calculateAge(dateOfBirth);
    const tenure = Number(tenureMonths);

    if (age === null || !tenureMonths || !Number.isFinite(tenure)) {
        return true;
    }

    return age + tenure / 12 <= 65;
}