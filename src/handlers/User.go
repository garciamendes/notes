package handlers

import (
	"encoding/json"
	"fmt"
	"net/http"
	"os"
	"strings"
	"time"

	"github.com/garciamendes/notes/src/models"
	"github.com/go-playground/validator/v10"
	"github.com/golang-jwt/jwt/v5"
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

func (userHandler UserHandler) Register(w http.ResponseWriter, r *http.Request) {
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
	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(userResponse)
}

func (userHandler UserHandler) Login(w http.ResponseWriter, r *http.Request) {
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

	err = comparePassword(user.Password, loginDto.Password)
	if err != nil {
		http.Error(w, "Invalid credentials", http.StatusBadRequest)
		return
	}

	token, err := tokenGeneration(user.ID)
	fmt.Println(token, err)
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

func hashPassword(password string) (string, error) {
	passwordHashed, err := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)

	if err != nil {
		return "", err
	}

	return string(passwordHashed), nil
}

func comparePassword(passwordHashed, password string) error {
	return bcrypt.CompareHashAndPassword([]byte(passwordHashed), []byte(password))
}

func tokenGeneration(userID uuid.UUID) (string, error) {
	claims := jwt.MapClaims{
		"user": userID,
		"exp":  time.Now().Add(time.Hour * 48).Unix(),
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	tokenString, err := token.SignedString([]byte(os.Getenv("TOKEN_SECRET_KEY")))

	return tokenString, err
}
