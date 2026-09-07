import {
    type ChangeEvent,
    useState,
} from "react";

import FormField from "../components/FormFieldRow";

import {
    isIPv4AddressInput,
    isValidIPv4Address,
} from "../utils/network";

interface InterfaceOption {
    id: number;
    name: string;
    address: string;
    port: number;
}

const interfaces: InterfaceOption[] = [
    {
        id: 1,
        name: "BACnet Primary",
        address: "10.7.4.208",
        port: 47808,
    },
    {
        id: 2,
        name: "BACnet Secondary",
        address: "10.7.5.208",
        port: 47808,
    },
];

export default function BBMDSettingsPage() {
    const [name, setName] = useState("");
    const [localEndpointId, setLocalEndpointId] = useState(1);

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
        <div className="page">
            <h2>Settings</h2>

            <section className="settings-group">
                <div className="settings-group-header">
                    <h2>BBMD Configuration</h2>

                    <div className="settings-group-description">
                        Configure the remote BBMD and the local
                        BACnet/IP interface used to communicate with it.
                    </div>
                </div>

                <div className="settings-group-body">
                    <FormField
                        label="Name"
                        hint="A descriptive name used to identify this BBMD."
                        help={
                            <>
                                <p>
                                    The name is only used by SuperRouter
                                    for display and configuration purposes.
                                    It has no effect on BACnet communication.
                                </p>

                                <p>
                                    Choose something that makes the remote
                                    BBMD easy to recognize, such as a
                                    building, network, or controller name.
                                </p>
                            </>
                        }
                    >
                        <input
                            type="text"
                            value={name}
                            onChange={(event) =>
                                setName(event.target.value)
                            }
                            placeholder="Building 11 BBMD"
                        />
                    </FormField>

                    <FormField
                        label="Local Interface"
                        hint="The local BACnet/IP interface SuperRouter uses to communicate with this BBMD."
                        help={
                            <>
                                <p>
                                    This selects the local BACnet/IP
                                    endpoint through which traffic to and
                                    from this BBMD is sent.
                                </p>

                                <p>
                                    Multiple BBMD relationships may share
                                    the same local interface.
                                </p>

                                <p>
                                    Interface addresses and BACnet/IP
                                    ports are configured separately under
                                    Interfaces.
                                </p>
                            </>
                        }
                    >
                        <select
                            value={localEndpointId}
                            onChange={(event) =>
                                setLocalEndpointId(
                                    Number(event.target.value),
                                )
                            }
                        >
                            {interfaces.map((iface) => (
                                <option
                                    key={iface.id}
                                    value={iface.id}
                                >
                                    {iface.name}
                                    {" — "}
                                    {iface.address}:{iface.port}
                                </option>
                            ))}
                        </select>
                    </FormField>

                    <FormField
                        label="Address"
                        hint="IP address of the remote BBMD, optionally including a UDP port."
                        help={
                            <>
                                <p>
                                    Enter the IP address of the remote
                                    BBMD. If no port is specified,
                                    SuperRouter will use the standard
                                    BACnet/IP port.
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
                            onBlur={() =>
                                setAddressTouched(true)
                            }
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
                                Enter a valid IPv4 address with an
                                optional port from 1 through 65535.
                            </div>
                        )}
                    </FormField>

                    <FormField
                        label="Manage BDT"
                        hint="Automatically manage the remote BBMD's Broadcast Distribution Table."
                        help={
                            <>
                                <p>
                                    When enabled, SuperRouter writes the
                                    remote BBMD's BDT during
                                    initialization.
                                </p>

                                <p>
                                    The table contains this router
                                    together with any additional BDT
                                    entries configured for this BBMD.
                                </p>
                            </>
                        }
                    >
                        <input
                            type="checkbox"
                            checked={manageBDT}
                            onChange={(event) =>
                                setManageBDT(
                                    event.target.checked,
                                )
                            }
                        />
                    </FormField>
                </div>
            </section>
        </div>
    );
}