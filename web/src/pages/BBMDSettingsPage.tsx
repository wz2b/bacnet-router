import {
    type ChangeEvent,
    useState,
} from "react";

import FormField from "../components/FormFieldRow";

import {
    isIPv4AddressInput,
    isValidIPv4Address,
} from "../utils/network";

export default function BBMDSettingsPage() {
    const [name, setName] = useState("");
    const [address, setAddress] = useState("");
    const [addressTouched, setAddressTouched] = useState(false);
    const [manageBDT, setManageBDT] = useState(false);

    const addressValid = isValidIPv4Address(address);
    const addressHasError =
        addressTouched && !addressValid;

    const handleAddressChange = (
        event: ChangeEvent<HTMLInputElement>,
    ) => {
        const value = event.target.value;

        if (isIPv4AddressInput(value)) {
            setAddress(value);
        }
    };

    return (
        <div>
            <h2>Settings</h2>

            <FormField
                label="Name"
                hint="A descriptive name used to identify this BBMD."
                help={
                    <>
                        <p>
                            The name is only used by SuperRouter for display
                            and configuration purposes. It has no effect on
                            BACnet communication.
                        </p>

                        <p>
                            Choose something that makes the remote BBMD easy
                            to recognize, such as a building, network, or
                            controller name.
                        </p>
                    </>
                }
            >
                <input
                    type="text"
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                    placeholder="Building 11 BBMD"
                />
            </FormField>

            <FormField
                label="Address"
                hint="IP address of the remote BBMD, optionally including a UDP port."
                help={
                    <>
                        <p>
                            Enter the IP address of the remote BBMD. If no
                            port is specified, SuperRouter will use the
                            standard BACnet/IP port.
                        </p>

                        <p>
                            Examples:
                        </p>

                        <p>
                            <code>10.7.4.41</code>
                            <br />
                            <code>10.7.4.41:47808</code>
                        </p>
                    </>
                }
            >
                <input
                    type="text"
                    value={address}
                    onChange={handleAddressChange}
                    onBlur={() => setAddressTouched(true)}
                    placeholder="10.7.4.41:47808"
                    spellCheck={false}
                    aria-invalid={addressHasError}
                    aria-describedby={
                        addressHasError
                            ? "bbmd-address-error"
                            : undefined
                    }
                />

                {addressHasError && (
                    <div
                        id="bbmd-address-error"
                        className="form-field-error"
                        role="alert"
                    >
                        Enter a valid IPv4 address with an optional
                        port from 1 through 65535.
                    </div>
                )}
            </FormField>

            <FormField
                label="Manage BDT"
                hint="Automatically manage the remote BBMD's Broadcast Distribution Table."
                help={
                    <>
                        <p>
                            When enabled, SuperRouter writes the remote BBMD's
                            BDT during initialization.
                        </p>

                        <p>
                            The table contains this router together with any
                            additional BDT entries configured below.
                        </p>
                    </>
                }
            >
                <input
                    type="checkbox"
                    checked={manageBDT}
                    onChange={(event) => setManageBDT(event.target.checked)}
                />
            </FormField>
        </div>
    );
}