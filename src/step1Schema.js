import { validateAgeAndTenure } from "./utils/loanValidation";
import { z } from "zod";

export const loanRules = {
    Personal: {
        minAmount: 50000,
        maxAmount: 1000000,
        minTenure: 12,
        maxTenure: 60,
        purposes: [
            "Medical Expenses",
            "Education",
            "Travel",
            "Debt Consolidation",
            "Other",
        ],
    },

    Home: {
        minAmount: 50000,
        maxAmount: 10000000,
        minTenure: 60,
        maxTenure: 360,
        purposes: [
            "Purchase a Home",
            "Home Construction",
            "Home Renovation",
            "Other",
        ],
    },

    Business: {
        minAmount: 50000,
        maxAmount: 5000000,
        minTenure: 12,
        maxTenure: 120,
        purposes: [
            "Business Expansion",
            "Equipment Purchase",
            "Working Capital",
            "Other",
        ],
    },
};

export const createStep1Schema = (dateOfBirth = "") => z.object({
        loanType: z.enum(["Personal", "Home", "Business"], {
            message: "Please select a loan type.",
        }),

        loanAmount: z.coerce.number().positive(
            "Enter a valid loan amount."
        ),

        loanTenure: z.coerce.number().int().positive(
            "Select a valid loan tenure."
        ),

        loanPurpose: z.string().min(
            1,
            "Please select a loan purpose."
        ),

        referralCode: z
            .string()
            .trim()
            .refine(
                (value) => value === "" || /^[a-zA-Z0-9]{6,10}$/.test(value),
                "Referral code must be 6–10 alphanumeric characters."
            ),
    })
    .superRefine((data, ctx) => {
        const rules = loanRules[data.loanType];

        if (!rules) return;

        if (
            data.loanAmount < rules.minAmount ||
            data.loanAmount > rules.maxAmount
        ) {
            ctx.addIssue({
                code: "custom",
                path: ["loanAmount"],
                message: `Amount must be between ₹${rules.minAmount.toLocaleString("en-IN")} and ₹${rules.maxAmount.toLocaleString("en-IN")}.`,
            });
        }

        if (
            data.loanTenure < rules.minTenure ||
            data.loanTenure > rules.maxTenure
        ) {
            ctx.addIssue({
                code: "custom",
                path: ["loanTenure"],
                message: `Tenure must be between ${rules.minTenure} and ${rules.maxTenure} months.`,
            });
        }

        if (!rules.purposes.includes(data.loanPurpose)) {
            ctx.addIssue({
                code: "custom",
                path: ["loanPurpose"],
                message: "Select a purpose valid for this loan type.",
            });
        }

        const dateOfBirth = data.dateOfBirth;

        if (
            dateOfBirth &&
            data.loanTenure &&
            !validateAgeAndTenure(dateOfBirth, data.loanTenure)
        ) {
            ctx.addIssue({
                code: "custom",
                path: ["loanTenure"],
                message: "Your age plus loan tenure cannot exceed 65 years.",
            });
        }
    });
