export default function InterfaceDiagnosticsPage() {
    return (
        <div className="page">
            <h2>Diagnostics</h2>

            <section className="settings-group">
                <div className="settings-group-header">
                    <h2>Interface Status</h2>

                    <div className="settings-group-description">
                        Runtime status and diagnostic information for this
                        BACnet/IP interface.
                    </div>
                </div>

                <div className="settings-group-body">
                    <p>
                        Interface diagnostics will go here.
                    </p>
                </div>
            </section>
        </div>
    );
}