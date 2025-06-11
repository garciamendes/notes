package handlers

import "github.com/google/uuid"

type UserDTO struct {
	Name     *string `json:"name"`
	Email    string  `json:"email" validate:"email,required"`
	Password string  `json:"password" validate:"required"`
}

type UserResponse struct {
	ID    uuid.UUID
	Name  string `json:"name"`
	Email string `json:"email"`
}

type LoginDTO struct {
	Email    string `json:"email"`
	Password string `json:"password"`
}

type LoginResponse struct {
	Token string `json:"token"`
}
