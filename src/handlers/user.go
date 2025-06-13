package handlers

import (
	"encoding/json"
	"fmt"
	"net/http"
	"strings"

	"github.com/garciamendes/notes/src/middlewares"
	"github.com/garciamendes/notes/src/models"
	"github.com/garciamendes/notes/src/utils"
	"github.com/go-playground/validator/v10"
	"gorm.io/gorm"
)

type UserHandler struct {
	DB *gorm.DB
}

func (h *Handler) User() *NoteHandler {
	return &NoteHandler{DB: h.DB}
}

func (userHandler NoteHandler) Register(w http.ResponseWriter, r *http.Request) {
	defer r.Body.Close()
	var userDTO UserDTO

	if err := json.NewDecoder(r.Body).Decode(&userDTO); err != nil {
		http.Error(w, "System Error", http.StatusBadRequest)
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

	password, err := utils.HashPassword(userDTO.Password)

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

	w.Header().Add("Content-Type", "application/json")
	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(nil)
}

func (userHandler NoteHandler) Login(w http.ResponseWriter, r *http.Request) {
	defer r.Body.Close()

	var loginDto LoginDTO
	if err := json.NewDecoder(r.Body).Decode(&loginDto); err != nil {
		http.Error(w, "Invalid credentials", http.StatusBadRequest)
		return
	}

	validate := validator.New()
	err := validate.Struct(loginDto)

	if err != nil {
		var errors []string
		for _, err := range err.(validator.ValidationErrors) {
			errors = append(errors, err.Field()+": "+err.Tag())
		}
		http.Error(w, strings.Join(errors, ", "), http.StatusBadRequest)
		return
	}

	var user models.User
	if result := userHandler.DB.Select("id", "password").First(&user, "email = ?", loginDto.Email); result.Error != nil {
		http.Error(w, "Invalid credentials", http.StatusBadRequest)
		return
	}

	err = utils.ComparePassword(user.Password, loginDto.Password)
	if err != nil {
		http.Error(w, "Invalid credentials", http.StatusBadRequest)
		return
	}

	token, err := utils.TokenGeneration(user.ID)
	if err != nil {
		http.Error(w, "Invalid credentials", http.StatusBadRequest)
		return
	}

	response := LoginResponse{
		Token: token,
	}

	w.Header().Add("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(response)
}

func (UserHandler NoteHandler) Me(w http.ResponseWriter, r *http.Request) {
	userID, ok := r.Context().Value(middlewares.UserIDKey).(string)

	if !ok {
		http.Error(w, "Unauthorized", http.StatusUnauthorized)
		return
	}

	var user User
	if result := UserHandler.DB.Select("ID", "name", "email").First(&user, "id = ?", userID); result.Error != nil {
		http.Error(w, "user not found", http.StatusNotFound)
		return
	}

	w.Header().Add("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(user)
}
