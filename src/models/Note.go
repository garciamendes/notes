package models

import (
	"time"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

type Note struct {
	ID      uuid.UUID `gorm:"type:uuid;primaryKey"`
	Title   string    `json:"name" validate:"required"`
	Content string    `json:"content" validate:"required"`

	UserID uuid.UUID
	User   User

	CreatedAt time.Time
	UpdatedAt time.Time
}

func (n *Note) BeforeCreate(tx *gorm.DB) (err error) {
	n.ID = uuid.New()
	return
}
