
import { useEffect, useRef, useState } from "react";
import {
    validatePAN,
    validateAadhaar,
} from "../utils/validators";

export default function useVerification(value, type) {
    const [isVerifying, setIsVerifying] = useState(false);
    const [isVerified, setIsVerified] = useState(false);
    const [error, setError] = useState("");

    const timerRef = useRef(null);
    const lastVerifiedValue = useRef("");

    useEffect(() => {
        const normalizedValue = value.trim().toUpperCase();

        if (
            lastVerifiedValue.current &&
            normalizedValue !== lastVerifiedValue.current
        ) {
            lastVerifiedValue.current = "";
            setIsVerified(false);
            setIsVerifying(false);
            setError("");
        }

        return () => {
            if (timerRef.current) {
                clearTimeout(timerRef.current);
            }
        };
    }, [value]);

    function verify() {
        if (timerRef.current) {
            clearTimeout(timerRef.current);
        }

        const normalizedValue = value.trim().toUpperCase();

        const result =
            type === "PAN"
                ? validatePAN(normalizedValue)
                : validateAadhaar(normalizedValue);

        setIsVerified(false);
        setError("");

        if (!result.valid) {
            setIsVerifying(false);
            setError(result.error);
            return;
        }

        setIsVerifying(true);

        timerRef.current = setTimeout(() => {
            setIsVerifying(false);
            setIsVerified(true);
            setError("");
            lastVerifiedValue.current = normalizedValue;
        }, 1500);
    }

    return {
        verify,
        isVerifying,
        isVerified,
        error,
    };
}
