package handlers

import (
	"encoding/json"
	"fmt"
	"net/http"
	"strings"

	"github.com/garciamendes/notes/src/models"
	"github.com/go-playground/validator/v10"
	"github.com/google/uuid"
	"golang.org/x/crypto/bcrypt"
	"gorm.io/gorm"
)

type UserHandler struct {
	DB *gorm.DB
}

func (h *Handler) User() *UserHandler {
	return &UserHandler{DB: h.DB}
}

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

func (userHandler UserHandler) Register(w http.ResponseWriter, r *http.Request) {
	defer r.Body.Close()
	var userDTO UserDTO

	if err := json.NewDecoder(r.Body).Decode(&userDTO); err != nil {
		http.Error(w, "JSON Inválido", http.StatusBadRequest)
		return
	}

	validate := validator.New()
	err := validate.Struct(userDTO)

	if err != nil {
		var errors []string
		for _, err := range err.(validator.ValidationErrors) {
			errors = append(errors, err.Field()+": "+err.Tag())
		}
		http.Error(w, strings.Join(errors, ", "), http.StatusBadRequest)
		return
	}

	password, err := hashPassword(userDTO.Password)

	if err != nil {
		http.Error(w, "System Error", http.StatusBadRequest)
		return
	}

	newUser := models.User{
		Name:     userDTO.Name,
		Email:    userDTO.Email,
		Password: password,
	}

	fmt.Println(newUser)

	if result := userHandler.DB.Create(&newUser); result.Error != nil {
		if strings.Contains(result.Error.Error(), "duplicate key") {
			http.Error(w, "Email already exists", http.StatusConflict)
		} else {
			http.Error(w, "Erro create user", http.StatusInternalServerError)
		}
		return
	}

	name := ""
	if newUser.Name != nil {
		name = *newUser.Name
	}
	userResponse := UserResponse{
		ID:    newUser.ID,
		Name:  name,
		Email: newUser.Email,
	}
	w.Header().Add("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(userResponse)
}

func hashPassword(password string) (string, error) {
	passwordHashed, err := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)

	if err != nil {
		return "", err
	}

	return string(passwordHashed), nil
}
