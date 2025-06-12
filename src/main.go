package main

import (
	"log"
	"net/http"

	"github.com/garciamendes/notes/src/db"
	"github.com/garciamendes/notes/src/handlers"
	"github.com/garciamendes/notes/src/routes"
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
	api := router.PathPrefix("/api").Subrouter()

	userRoutes := api.PathPrefix("/user").Subrouter()
	routes.UserRoutes(userRoutes, handlers)

	http.ListenAndServe(":8080", router)
}
