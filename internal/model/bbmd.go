package model

/*
ForeignBBMD represents a remote BBMD with which the SuperRouter
communicates.

GORM relationship examples in this model:

 1. LocalEndpoint is a "belongs to" relationship.

    The ForeignBBMD table stores only LocalEndpointID. The
    LocalEndpoint field itself is not stored in the foreign_bbmds
    table; GORM can populate it from the local_endpoints table.

    ForeignBBMD.LocalEndpointID -> LocalEndpoint.ID

    Because this follows GORM's normal <Field>ID convention, no
    explicit foreignKey/references tags are required.

 2. AdditionalBDTEntries is a "has many" relationship.

    The foreign key is stored in each BDTEntry, not in the
    ForeignBBMD row:

    BDTEntry.ForeignBBMDAddress -> ForeignBBMD.Address

    Because ForeignBBMD uses Address rather than ID as its primary
    key, this relationship is declared explicitly with foreignKey
    and references tags.
*/
type ForeignBBMD struct {
	// Address is the BBMD's IP address and optional UDP port.
	//
	// Address is also the primary key, because the remote BACnet/IP
	// endpoint identifies this BBMD in our configuration.
	Address string `gorm:"primaryKey"`

	// Name is a human-readable name used for display and configuration.
	Name string

	/*
		LocalEndpoint identifies the local BACnet/IP endpoint used to
		communicate with this BBMD.

		Only LocalEndpointID is stored in the foreign_bbmds table.
		LocalEndpoint is an association that GORM can populate from the
		local_endpoints table, for example with:

		    db.Preload("LocalEndpoint").First(&bbmd, ...)

		Multiple ForeignBBMDs may reference the same LocalEndpoint.
	*/
	LocalEndpointID uint
	LocalEndpoint   LocalEndpoint

	/*
		ManageBDT specifies whether the SuperRouter owns the configuration
		of this BBMD's Broadcast Distribution Table.

		If true, the SuperRouter rewrites the remote BDT so that it contains:

		    1. This SuperRouter's required BDT entry.
		    2. Each entry in AdditionalBDTEntries.

		If false, the SuperRouter does not modify the remote BBMD's BDT.
	*/
	ManageBDT bool

	/*
		AdditionalBDTEntries contains user-configured BDT entries to write
		to the remote BBMD when ManageBDT is true.

		This is a GORM "has many" relationship. These entries are stored
		as separate rows in the bdt_entries table. Each row contains
		ForeignBBMDAddress, which references this ForeignBBMD's Address.

		ON UPDATE CASCADE is important because Address is the ForeignBBMD
		primary key. If a ForeignBBMD's address changes, the corresponding
		ForeignBBMDAddress values in its BDT entries change with it.

		ON DELETE CASCADE ensures that deleting a ForeignBBMD also deletes
		its associated BDT entries.
	*/
	AdditionalBDTEntries []BDTEntry `gorm:"foreignKey:ForeignBBMDAddress;references:Address;constraint:OnUpdate:CASCADE,OnDelete:CASCADE;"`

	/*
		StaticNetworks are networks that are administratively known to be
		reachable through this BBMD.

		Unlike learned routes, these do not age out and do not require
		discovery before they can be used.
	*/
	StaticNetworks []StaticNetworkRule `gorm:"foreignKey:ForeignBBMDAddress;references:Address;constraint:OnUpdate:CASCADE,OnDelete:CASCADE;"`

	/*
		COVForwardRules identify COV notifications that should always be
		propagated to this BBMD, regardless of whether the router has
		learned a matching downstream subscription.
	*/
	COVForwardRules []COVForwardRule `gorm:"foreignKey:ForeignBBMDAddress;references:Address;constraint:OnUpdate:CASCADE,OnDelete:CASCADE;"`
}

/*
BDTEntry represents an additional entry that should be installed in a
managed ForeignBBMD's Broadcast Distribution Table.

The SuperRouter's own BDT entry is implicit and is therefore not stored
as a BDTEntry.
*/
type BDTEntry struct {
	ID uint `gorm:"primaryKey"`

	// ForeignBBMDAddress is the foreign key back to ForeignBBMD.Address.
	//
	// This field is database relationship plumbing; user code normally
	// accesses BDT entries through ForeignBBMD.AdditionalBDTEntries.
	ForeignBBMDAddress string `gorm:"not null;index"`

	// Address is the BACnet/IP address of the BDT peer.
	Address string

	// Mask is the BACnet/IP broadcast distribution mask for this entry.
	Mask string
}
