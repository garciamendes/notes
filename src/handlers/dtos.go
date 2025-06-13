package handlers

import (
	"github.com/google/uuid"
)

type UserDTO struct {
	Name     *string `json:"name"`
	Email    string  `json:"email" validate:"email,required"`
	Password string  `json:"password" validate:"required"`
}

type User struct {
	ID    uuid.UUID `json:"id"`
	Name  string    `json:"name"`
	Email string    `json:"email"`
}

type LoginDTO struct {
	Email    string `json:"email"`
	Password string `json:"password"`
}

type LoginResponse struct {
	Token string `json:"token"`
}

type NotesDetail struct {
	ID      uuid.UUID `gorm:"type:uuid;primaryKey" json:"id"`
	Title   string    `json:"name" validate:"required"`
	Content string    `json:"content" validate:"required"`
}

type Notes struct {
	ID    uuid.UUID `gorm:"type:uuid;primaryKey" json:"id"`
	Title string    `json:"name" validate:"required"`
}

type PaginationNotes struct {
	Total     int64   `json:"total"`
	Page      int     `json:"page"`
	TotalPage int     `json:"total_page"`
	Notes     []Notes `json:"notes"`
}
