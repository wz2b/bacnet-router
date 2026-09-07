export default function BBMDsPage() {
    const handleAddBBMD = () => {
        // TODO: Create a new BBMD configuration and navigate to it.
        console.log("add BBMD");
    };

    return (
        <div className="page">
            <h2>BBMDs</h2>

            <section className="settings-group">
                <div className="settings-group-header">
                    <h2>Configured BBMDs</h2>

                    <div className="settings-group-description">
                        Configure the remote BACnet/IP BBMDs connected
                        to SuperRouter.
                    </div>
                </div>

                <div className="settings-group-body">
                    <p>
                        Select a BBMD from the navigation menu to view
                        or modify its configuration.
                    </p>

                    <div className="button-row">
                        <button
                            type="button"
                            className="button button-primary"
                            onClick={handleAddBBMD}
                        >
                            Add BBMD
                        </button>
                    </div>
                </div>
            </section>
        </div>
    );
}