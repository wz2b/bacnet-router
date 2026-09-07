// pages/InterfacesPage.tsx

export default function InterfacesPage() {
    return (
        <div className="page">
            <h2>Interfaces</h2>

            <section className="settings-group">
                <div className="settings-group-header">
                    <h2>Local BACnet/IP Interfaces</h2>

                    <div className="settings-group-description">
                        Configure the local BACnet/IP endpoints available
                        to SuperRouter.
                    </div>
                </div>

                <div className="settings-group-body">
                    <p>
                        Select an interface from the navigation menu
                        to view or modify its configuration.
                    </p>

                    <div className="button-row">
                        <button
                            type="button"
                            className="button button-primary"
                        >
                            Add Interface
                        </button>
                    </div>
                </div>
            </section>
        </div>
    );
}