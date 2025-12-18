// hooks/useEnrollmentForm.tsx
import { useEffect, useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { enrollmentSchema, EnrollmentSchema } from "@/schema";
import { addStudent } from "@/data";
import type { ReactNode } from "react";

/**
 * Reusable hook that centralizes:
 * - useForm setup with defaultValues + reset on incoming ids
 * - submit flow calling addStudent + activity callback + messages
 *
 * onSuccess: (data, result) => void -> called when addStudent returns success
 */
export function useEnrollmentForm(
    initialStudentId?: string,
) {
    const [successMessage, setSuccessMessage] = useState<ReactNode | undefined>(undefined);
    const [errorMessage, setErrorMessage] = useState<ReactNode | undefined>(undefined);
    const [isPending, startTransition] = useTransition();

    const { control, formState: { errors }, handleSubmit, reset } = useForm<EnrollmentSchema>({
        defaultValues: {
            student: { id: initialStudentId ?? "" }
        },
        resolver: zodResolver(enrollmentSchema(true))
    });

    // update form when ids change (handles async data arrival)
    useEffect(() => {
        reset({
            student: { id: initialStudentId ?? "" }
        });
    }, [initialStudentId, reset]);

    const onSubmit = (data: EnrollmentSchema) => {
        setErrorMessage(undefined);
        setSuccessMessage(undefined);

        startTransition(() => {
            addStudent(data, true)
                .then((res) => {
                    if (res.isSuccess) {
                        setSuccessMessage(res.success);
                        reset(); // clears the form after success
                    } else {
                        setErrorMessage(res.error);
                    }
                })
                .catch((err) => {
                    setErrorMessage(err?.message ?? String(err));
                });
        });
    };

    return {
        control,
        errors,
        handleSubmit,
        reset,
        onSubmit,
        isPending,
        successMessage,
        errorMessage,
        setSuccessMessage,
        setErrorMessage
    };
}
