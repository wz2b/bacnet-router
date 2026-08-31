package model

type StaticNetworkRule struct {
	ID uint `gorm:"primaryKey"`

	ForeignBBMDAddress string `gorm:"not null;index;uniqueIndex:idx_bbmd_network"`
	Network            uint16 `gorm:"not null;uniqueIndex:idx_bbmd_network"`
}

type COVForwardRule struct {
	ID uint `gorm:"primaryKey"`

	ForeignBBMDAddress string `gorm:"not null;index;uniqueIndex:idx_cov_rule"`

	DeviceInstance uint32 `gorm:"not null;index;uniqueIndex:idx_cov_rule"`

	/*
	   ObjectType and ObjectInstance are either both nil or both set.

	   nil/nil:
	       Match every COV notification from DeviceInstance.

	   non-nil/non-nil:
	       Match only the specified object on DeviceInstance.
	*/
	ObjectType     *uint16 `gorm:"uniqueIndex:idx_cov_rule"`
	ObjectInstance *uint32 `gorm:"uniqueIndex:idx_cov_rule"`
}
