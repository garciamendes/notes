package models

import (
	"time"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

type User struct {
	ID       uuid.UUID `gorm:"type:uuid;primaryKey"`
	Name     *string   `json:"name"`
	Email    string    `gorm:"unique" json:"email" validate:"required,email"`
	Password string    `json:"password" validate:"required"`

	Notes []Note `gorm:"foreignKey:UserID" json:"notes"`

	CreatedAt time.Time
	UpdatedAt time.Time
}

func (u *User) BeforeCreate(tx *gorm.DB) (err error) {
	u.ID = uuid.New()
	return
}
