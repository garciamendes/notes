package main

import (
	"log"
	"net/http"

	"github.com/garciamendes/notes/src/db"
	"github.com/garciamendes/notes/src/handlers"
	"github.com/gorilla/mux"
	"github.com/joho/godotenv"
)

func main() {
	err := godotenv.Load()

	if err != nil {
		log.Fatal("Error load 'ENVS': ", err)
	}

	DB := db.Init()
	if DB.Error != nil {
		log.Fatal(DB.Error)
		return
	}

	handlers := handlers.New(DB)
	router := mux.NewRouter()

	// User
	router.HandleFunc("/user", handlers.User().Register).Methods(http.MethodPost)
	router.HandleFunc("/user/login", handlers.User().Login).Methods(http.MethodPost)

	http.ListenAndServe(":8080", router)
}
