import {
    ReactNode,
    useState,
} from "react";

interface FormFieldProps {
    label: string;
    hint?: string;
    help?: ReactNode;
    children: ReactNode;
}

export default function FormField({
                                      label,
                                      hint,
                                      help,
                                      children,
                                  }: FormFieldProps) {
    const [helpOpen, setHelpOpen] = useState(false);

    return (
        <div className="form-field-row">
            <div className="form-field-label">
                <label>
                    {label}
                </label>
            </div>

            <div className="form-field-control">
                {children}

                {hint && (
                    <div className="form-field-hint">
                        {hint}
                    </div>
                )}

                {help && (
                    <div className="form-field-help">
                        <button
                            type="button"
                            className="form-field-help-toggle"
                            onClick={() => setHelpOpen(!helpOpen)}
                            aria-expanded={helpOpen}
                        >
                            {helpOpen ? "▾" : "▸"} Details
                        </button>

                        {helpOpen && (
                            <div className="form-field-help-content">
                                {help}
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}