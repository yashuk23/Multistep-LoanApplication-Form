
import { z } from "zod";

const fullNameSchema = z
    .string()
    .trim()
    .min(2, "Name must contain at least 2 characters.")
    .max(100, "Name cannot exceed 100 characters.")
    .regex(
        /^[a-zA-Z .]+$/,
        "Use letters, spaces, and periods only."
    );

function calculateAge(dateOfBirth) {
    const [year, month, day] = dateOfBirth.split("-").map(Number);
    const today = new Date();

    let age = today.getFullYear() - year;

    const birthdayNotReached =
        today.getMonth() + 1 < month ||
        (today.getMonth() + 1 === month && today.getDate() < day);

    if (birthdayNotReached) age--;

    return age;
}

export const step2Schema = z
    .object({
        fullName: fullNameSchema,

        dateOfBirth: z
            .string()
            .min(1, "Date of birth is required.")
            .refine((value) => {
                if (!value) return false;

                const date = new Date(`${value}T00:00:00`);
                return (
                    !Number.isNaN(date.getTime()) &&
                    date.getFullYear() === Number(value.slice(0, 4)) &&
                    date.getMonth() + 1 === Number(value.slice(5, 7)) &&
                    date.getDate() === Number(value.slice(8, 10))
                );
            }, "Enter a valid date of birth.")
            .refine((value) => {
                if (!value) return false;

                const [year, month, day] = value.split("-").map(Number);
                const today = new Date();

                let age = today.getFullYear() - year;

                if (
                    today.getMonth() + 1 < month ||
                    (today.getMonth() + 1 === month && today.getDate() < day)
                ) {
                    age--;
                }

                return age >= 21 && age <= 65;
            }, "Applicant must be between 21 and 65 years old."),

        gender: z.enum(["Male", "Female", "Other"], {
            message: "Please select your gender.",
        }),

        maritalStatus: z.enum(
            ["Single", "Married", "Divorced", "Widowed"],
            { message: "Please select your marital status." }
        ),

        fatherName: fullNameSchema,
        motherName: fullNameSchema,

        email: z
            .string()
            .trim()
            .email("Enter a valid email address."),

        mobile: z
            .string()
            .regex(
                /^[6-9]\d{9}$/,
                "Enter a valid 10-digit mobile number."
            ),

        alternateMobile: z
            .string()
            .regex(
                /^$|^[6-9]\d{9}$/,
                "Enter a valid 10-digit alternate number."
            )
            .optional(),
    })
    .superRefine((data, ctx) => {
        if (
            data.alternateMobile &&
            data.alternateMobile === data.mobile
        ) {
            ctx.addIssue({
                code: "custom",
                path: ["alternateMobile"],
                message: "Alternate mobile must differ from primary mobile.",
            });
        }
    });
